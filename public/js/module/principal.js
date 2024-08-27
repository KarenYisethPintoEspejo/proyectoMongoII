document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = './index.html';
    }

    fetch('/usuario/get-username')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            document.querySelector('.user-text p').textContent = `Hi, ${data.userName}!`;
        })
        .catch(error => console.error('Error al cargar el nombre de usuario:', error));

    const navItems = document.querySelectorAll('.nav-item');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            if (this.querySelector('.bx-search')) searchInput.focus();
        });
    });

    searchInput.addEventListener('focus', () => searchIcon.classList.add('active-icon'));
    searchInput.addEventListener('blur', () => searchIcon.classList.remove('active-icon'));


    const cacheKey = 'peliculas';
    const cacheExpiration = 3600000; 
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const currentTime = Date.now();
        if (currentTime - timestamp < cacheExpiration) {
            const movies = JSON.parse(data);
            initializeMovies(movies);
            return;
        }
    }

    fetch('/pelicula/listaPeliculas')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(movies => {
            localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: Date.now(),
                data: JSON.stringify(movies)
            }));

            initializeMovies(movies);
        })
        .catch(error => console.error('No se pudieron cargar las películas:', error));

    function initializeMovies(movies) {
        displayMovies(movies);
        displayComingSoon(movies);

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const filteredMovies = filterMovies(movies, query);
            const nowPlayingMovies = filteredMovies.filter(movie => new Date(movie.fecha_estreno) <= new Date());
            const comingSoonMovies = filteredMovies.filter(movie => new Date(movie.fecha_estreno) > new Date());

            toggleSections(nowPlayingMovies, comingSoonMovies);
        });
    }
});

const filterMovies = (movies, query) => movies.filter(movie => 
    movie.nombre.toLowerCase().includes(query) ||
    movie.generos.some(genre => genre.toLowerCase().includes(query)) ||
    (movie.actores && movie.actores.some(actor => actor.nombre.toLowerCase().includes(query)))
);

const toggleSections = (nowPlayingMovies, comingSoonMovies) => {
    const nowPlayingSection = document.querySelector('.now-playing');
    const comingSoonSection = document.querySelector('.coming-soon');
    const noResultsMessage = document.getElementById('no-results-message');

    if (nowPlayingMovies.length === 0 && comingSoonMovies.length === 0) {
        nowPlayingSection.style.display = 'none';
        comingSoonSection.style.display = 'none';
        noResultsMessage.style.display = 'block';
    } else {
        nowPlayingSection.style.display = 'block';
        comingSoonSection.style.display = 'block';
        noResultsMessage.style.display = 'none';
        displayMovies(nowPlayingMovies);
        displayComingSoon(comingSoonMovies);
    }
};

const displayMovies = (movies) => {
    const container = document.getElementById('movies-container');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    container.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    const today = new Date();
    const filteredMovies = movies.filter(movie => new Date(movie.fecha_estreno) <= today);

    if (filteredMovies.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    filteredMovies.forEach((movie, index) => {
        const movieItem = createMovieItem(movie, index);
        container.appendChild(movieItem);
        
        const dot = createIndicatorDot(index, container);
        indicatorsContainer.appendChild(dot);
    });

    const initialIndex = Math.min(1, filteredMovies.length - 1);
    container.scrollLeft = container.offsetWidth * initialIndex;
    updateActiveIndicator(initialIndex);

    container.addEventListener('scroll', updateActiveIndicatorOnScroll);
};

const createMovieItem = (movie, index) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.dataset.id = movie.id;
    movieItem.dataset.index = index;
    movieItem.innerHTML = `
        <img src="${movie.imagen}" alt="${movie.nombre}" class="movie-image" loading="lazy">
        <h3 class="movie-title">${movie.nombre}</h3>
        <p class="movie-genres">${movie.generos.join(', ')}</p>
    `;
    movieItem.addEventListener('click', () => {
        window.location.href = `./pelicula.html?movieId=${movie.id}`;
    });
    return movieItem;
};

const createIndicatorDot = (index, container) => {
    const dot = document.createElement('span');
    dot.classList.add('indicator');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        container.scrollLeft = container.offsetWidth * index;
        updateActiveIndicator(index);
    });
    return dot;
};

const updateActiveIndicatorOnScroll = () => {
    const container = document.getElementById('movies-container');
    const movieItems = document.querySelectorAll('.movie-item');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    movieItems.forEach((movieItem, index) => {
        const rect = movieItem.getBoundingClientRect();
        const distance = Math.abs((rect.left + rect.width / 2) - containerCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    updateActiveIndicator(closestIndex);
    updateMovieDetails(closestIndex);
};

const updateActiveIndicator = (activeIndex) => {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeIndex);
    });
};

const updateMovieDetails = (activeIndex) => {
    document.querySelectorAll('.movie-item').forEach((movieItem, index) => {
        const isActive = index === activeIndex;
        movieItem.querySelector('.movie-title').style.display = isActive ? 'block' : 'none';
        movieItem.querySelector('.movie-genres').style.display = isActive ? 'block' : 'none';
        movieItem.style.transform = isActive ? 'scale(1.2)' : 'scale(1.2)';
    });
};

const displayComingSoon = (movies) => {
    const container = document.querySelector('.movie-carousel1');
    container.innerHTML = '';

    const today = new Date();
    const comingSoonMovies = movies.filter(movie => new Date(movie.fecha_estreno) > today);

    if (comingSoonMovies.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    comingSoonMovies.forEach(movie => {
        const movieItem = createComingSoonItem(movie);
        container.appendChild(movieItem);
    });
};

const createComingSoonItem = (movie) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('coming-soon-item');
    movieItem.dataset.id = movie.id;
    movieItem.innerHTML = `
        <img src="${movie.imagen}" alt="${movie.nombre}" class="movie-image" loading="lazy">
        <div class="movie-text">
            <h3>${movie.nombre}</h3>
            <p>${movie.generos.join(', ')}</p>
        </div>
    `;
    movieItem.addEventListener('click', () => {
        window.location.href = `./pelicula.html?movieId=${movie.id}`;
    });
    return movieItem;
};
