const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

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
            const container = document.getElementById('movies-container');
            container.innerHTML = '';

            const searchInput = document.getElementById('search-input');
            searchInput.focus();
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                const filteredMovies = filterMovies(movies, query);
                displayMovies(filteredMovies); 
            });

            // Establece el foco en el campo de búsqueda
            searchInput.focus();
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
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
    movies.forEach(movie => {
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
            window.location.href = `../views/pelicula.html?movieId=${movie.id}`;
        });
        container.appendChild(movieItem);
    });
}
