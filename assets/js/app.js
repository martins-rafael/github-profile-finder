const api = axios.create({
    baseURL: 'https://api.github.com/users/'
});

const createEl = element => document.createElement(element);

class App {
    constructor() {
        this.profiles = [];
        this.formElement = document.querySelector('.profile-form');
        this.inputElement = document.querySelector('input[name=profile_name]');
        this.profilesContainer = document.querySelector('.profiles-found');
        this.eventHandler();
    }

    eventHandler() {
        this.formElement.addEventListener('submit', event => this.addProfile(event));
    }

    setLoading(loading = true) {
        if (loading) {
            const loadElement = createEl('div');
            loadElement.setAttribute('id', 'loading');
            this.profilesContainer.appendChild(loadElement);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addProfile(event) {
        event.preventDefault();
        const profileInput = this.inputElement.value;

        if (profileInput.length === 0) return;

        this.setLoading();

        try {
            const response = await api.get(profileInput);
            const { login, avatar_url, name, bio, public_repos, public_gists, followers, following } = response.data;

            this.profiles.push({
                login,
                avatar_url,
                name,
                bio,
                public_repos,
                public_gists,
                followers,
                following
            });

            this.render();
        } catch (err) {
            alert('O perfil solicitado não foi encontrado!');
        }

        this.setLoading(false);
    }

    render() {
        const profile = this.profiles[this.profiles.length - 1];
        const imgElement = createEl('img');
        imgElement.setAttribute('src', profile.avatar_url);

        const nameElement = createEl('h3');
        nameElement.innerHTML = profile.name;

        const bioElement = createEl('h4');
        bioElement.innerHTML = profile.bio;

        const reposElement = createEl('p');
        reposElement.innerHTML = `${profile.public_repos} repositórios`;

        const gistsElement = createEl('p');
        gistsElement.innerHTML = `${profile.public_gists} gists`;

        const followersElement = createEl('p');
        followersElement.innerHTML = `${profile.followers} seguidores`;

        const followingElement = createEl('p');
        followingElement.innerHTML = `Seguindo ${profile.following}`;

        const infoWrapper = createEl('div');
        infoWrapper.classList.add('profile-content');
        infoWrapper.appendChild(nameElement);
        infoWrapper.appendChild(bioElement);
        infoWrapper.appendChild(reposElement);
        infoWrapper.appendChild(gistsElement);
        infoWrapper.appendChild(followersElement);
        infoWrapper.appendChild(followingElement);

        const card = createEl('div');
        card.classList.add('profile-card');
        card.setAttribute('id', profile.login);
        card.appendChild(imgElement);
        card.appendChild(infoWrapper);

        this.profilesContainer.appendChild(card);

        this.redirectToGitHub();
    }

    redirectToGitHub() {
        const githubLinks = document.querySelectorAll('.profile-card');
        githubLinks.forEach(link => {
            link.addEventListener('click', () => {
                let userName = link.getAttribute('id');
                window.open(`https://github.com/${userName}`);
            });
        });
    }
}

new App();

