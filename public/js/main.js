document.addEventListener('DOMContentLoaded', () => {
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
            const searchInput = document.getElementById('search-input');
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
        const actorMatch = movie.actores && movie.actores.some(actor => actor.toLowerCase().includes(query));
        return nameMatch || genreMatch || actorMatch;
    });
}

function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    const today = new Date();
    const filteredMovies = movies.filter(movie => new Date(movie.fecha_estreno) < today);
    filteredMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.dataset.id = movie.id;  
        const imageUrl = movie.imagen;
        movieItem.innerHTML = `
            <img src="${imageUrl}" alt="${movie.nombre}" class="movie-image">
            <h3>${movie.nombre}</h3>
            <p>${movie.generos.join(', ')}</p>
        `;

        movieItem.addEventListener('click', () => {
            window.location.href = `./views/pelicula.html?movieId=${movie.id}`;
        });
        container.appendChild(movieItem);
    });
}

function displayComingSoon(movies) {
    const container = document.querySelector('.movie-carousel1');
    container.innerHTML = ''; 

    const today = new Date(); 
    const comingSoonMovies = movies.filter(movie => new Date(movie.fecha_estreno) > today);

    comingSoonMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.dataset.id = movie.id;  
        const imageUrl = movie.imagen; 
        movieItem.innerHTML = `
            <img src="${imageUrl}" alt="${movie.nombre}" class="movie-image">
            <h3>${movie.nombre}</h3>
            <p>${movie.generos.join(', ')}</p>
        `;
        movieItem.addEventListener('click', () => {
            window.location.href = `./views/pelicula.html?movieId=${movie.id}`;
        });

        container.appendChild(movieItem);
    });
}
