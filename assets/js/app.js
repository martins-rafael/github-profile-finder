const api = axios.create({
    baseURL: 'https://api.github.com/users/'
});

class App {
    constructor() {
        this.profiles = [];
        this.formElement = document.querySelector('.profile-form');
        this.inputElement = document.querySelector('input[name=profile_name]');
        this.profilesContainer = document.querySelector('.profiles-found');
        this.eventHandler();
    }

    createEl(element, inner) {
        const newElement = document.createElement(element);
        if (inner) newElement.innerHTML = inner;
        
        return newElement;
    };

    eventHandler() {
        this.formElement.addEventListener('submit', event => this.addProfile(event));
    }

    setLoading(loading = true) {
        if (loading) {
            const loadElement = this.createEl('div');
            loadElement.setAttribute('id', 'loading');
            this.profilesContainer.insertAdjacentElement("beforebegin", loadElement);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addProfile(event) {
        event.preventDefault();
        const profileInput = this.inputElement.value;

        if (profileInput.length === 0) return;

        const found = this.profiles.some(profile => profile.login.toLowerCase() == profileInput.toLowerCase());
        if (found) return;

        this.setLoading();

        try {
            const response = await api.get(profileInput);
            const { login, avatar_url, name, bio, public_repos, public_gists, followers, following } = response.data;
            console.log(login)
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
        const imgElement = this.createEl('img');
        imgElement.setAttribute('src', profile.avatar_url);

        const nameElement = this.createEl('h3', profile.name);
        const bioElement = this.createEl('h4', profile.bio);
        const reposElement = this.createEl('p', `${profile.public_repos} repositórios`);
        const gistsElement = this.createEl('p', `${profile.public_gists} gists`);
        const followersElement = this.createEl('p', `${profile.followers} seguidores`);
        const followingElement = this.createEl('p', `Seguindo ${profile.following}`);

        const infoWrapper = this.createEl('div');
        infoWrapper.classList.add('profile-content');
        infoWrapper.appendChild(nameElement);
        infoWrapper.appendChild(bioElement);
        infoWrapper.appendChild(reposElement);
        infoWrapper.appendChild(gistsElement);
        infoWrapper.appendChild(followersElement);
        infoWrapper.appendChild(followingElement);

        const card = this.createEl('div');
        card.classList.add('profile-card');
        card.setAttribute('id', profile.login);
        card.appendChild(imgElement);
        card.appendChild(infoWrapper);

        const firstCard = document.querySelector('.profile-card');
        if (firstCard) {
            firstCard.insertAdjacentElement('beforebegin', card);
        } else {
            this.profilesContainer.appendChild(card);
        }

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