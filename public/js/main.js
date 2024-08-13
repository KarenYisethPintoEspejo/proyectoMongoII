document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            if (this.querySelector('.bx-search')) {
                const moviesContainer = document.getElementById('movies-container');
                moviesContainer.innerHTML = ''; 
                moviesContainer.style.display = 'none'; 
                const comingSoonContainer = document.querySelector('.movie-carousel1');
                comingSoonContainer.innerHTML = ''; 
                comingSoonContainer.style.display = 'none'; 
                const searchInput = document.getElementById('search-input');
                searchInput.focus(); 
            }
        });
    });

    
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon'); 

    searchInput.addEventListener('focus', () => {
        searchIcon.classList.add('active-icon');
    });

    searchInput.addEventListener('blur', () => {
        searchIcon.classList.remove('active-icon');
    });

    fetch('http://localhost:5010/pelicula/listaPeliculas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(movies => {
            console.log('Películas obtenidas:', movies);
            displayMovies(movies);
            displayComingSoon(movies);

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                const filteredMovies = filterMovies(movies, query);
                const nowPlayingMovies = filteredMovies.filter(movie => new Date(movie.fecha_estreno) < new Date());
                const comingSoonMovies = filteredMovies.filter(movie => new Date(movie.fecha_estreno) > new Date());
                displayMovies(nowPlayingMovies);
                displayComingSoon(comingSoonMovies);
            });
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
            document.getElementById('movies-container').innerHTML = '<p>No se pudieron cargar las películas.</p>';
        });
});

function filterMovies(movies, query) {
    return movies.filter(movie => {
        const nameMatch = movie.nombre.toLowerCase().includes(query);
        const genreMatch = movie.generos.some(genre => genre.toLowerCase().includes(query));
        const actorMatch = movie.actores && movie.actores.some(actor => actor.nombre.toLowerCase().includes(query));
        return nameMatch || genreMatch || actorMatch;
    });
}

function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    const today = new Date();
    const filteredMovies = movies.filter(movie => new Date(movie.fecha_estreno) < today);

    const indicatorsContainer = document.getElementById('carousel-indicators');
    indicatorsContainer.innerHTML = '';

    if (filteredMovies.length === 0) {
        container.style.display = 'none'; 
    } else {
        container.style.display = 'flex'; 
        filteredMovies.forEach((movie, index) => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.dataset.id = movie.id;  
            movieItem.dataset.index = index;  
            const imageUrl = movie.imagen;
            movieItem.innerHTML = `
                <img src="${imageUrl}" alt="${movie.nombre}" class="movie-image">
                <h3 class="movie-title">${movie.nombre}</h3>
                <p class="movie-genres">${movie.generos.join(', ')}</p>
            `;

            movieItem.addEventListener('click', () => {
                window.location.href = `./views/pelicula.html?movieId=${movie.id}`;
            });

            container.appendChild(movieItem);
            
            const dot = document.createElement('span');
            dot.classList.add('indicator');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                container.scrollLeft = container.offsetWidth * index;
                updateActiveIndicator(index);
            });
            indicatorsContainer.appendChild(dot);
        });

        const thirdIndex = 1;
        if (filteredMovies.length > thirdIndex) {
            container.scrollLeft = container.offsetWidth * thirdIndex;
            updateActiveIndicator(thirdIndex);
        }

        container.addEventListener('scroll', () => {
            updateActiveIndicatorOnScroll();
        });
    }
}

function updateActiveIndicatorOnScroll() {
    const container = document.getElementById('movies-container');
    const indicators = document.querySelectorAll('.indicator');
    const movieItems = document.querySelectorAll('.movie-item');
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;

    let closestIndex = 0;
    let minDistance = Infinity;

    movieItems.forEach((movieItem, index) => {
        const rect = movieItem.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const distance = Math.abs((rect.left + rect.width / 2) - (containerRect.left + containerRect.width / 2));

        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    updateActiveIndicator(closestIndex);
    updateMovieDetails(closestIndex);
}

function updateActiveIndicator(activeIndex) {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function updateMovieDetails(activeIndex) {
    const movieItems = document.querySelectorAll('.movie-item');
    movieItems.forEach((movieItem, index) => {
        if (index === activeIndex) {
            movieItem.querySelector('.movie-title').style.display = 'block';
            movieItem.querySelector('.movie-genres').style.display = 'block';
            movieItem.style.transform = 'scale(1.2)';
        } else {
            movieItem.querySelector('.movie-title').style.display = 'none';
            movieItem.querySelector('.movie-genres').style.display = 'none';
            movieItem.style.transform = 'scale(1.2)';
        }
    });
}

function displayComingSoon(movies) {
    const container = document.querySelector('.movie-carousel1');
    container.innerHTML = ''; 

    const today = new Date(); 
    const comingSoonMovies = movies.filter(movie => new Date(movie.fecha_estreno) > today);

    if (comingSoonMovies.length === 0) {
        container.style.display = 'none'; 
    } else {
        container.style.display = 'flex'; 
        comingSoonMovies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('coming-soon-item');
            movieItem.dataset.id = movie.id;  
            const imageUrl = movie.imagen; 

            movieItem.innerHTML = `
                <img src="${imageUrl}" alt="${movie.nombre}" class="movie-image">
                <div class="movie-text">
                    <h3>${movie.nombre}</h3>
                    <p>${movie.generos.join(', ')}</p>
                </div>
            `;

            movieItem.addEventListener('click', () => {
                window.location.href = `./views/pelicula.html?movieId=${movie.id}`;
            });

            container.appendChild(movieItem);
        });
    }
}
