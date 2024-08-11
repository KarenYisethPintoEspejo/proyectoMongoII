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
            displayMovies(movies); 
            displayComingSoon(movies); 
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
            document.getElementById('movies-container').innerHTML = '<p>No se pudieron cargar las películas.</p>';
        });
});

function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = ''; 
    const today = new Date(); 
    const filteredMovies = movies.filter(movie => new Date(movie.fecha_estreno) < today);
    filteredMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        const imageUrl = movie.imagen; 
        movieItem.innerHTML = `
            <img src="${imageUrl}" alt="${movie.nombre}" class="movie-image">
            <h3>${movie.nombre}</h3>
            <p>${movie.generos.join(', ')}</p>
        `;

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

        const imageUrl = movie.imagen; 
        movieItem.innerHTML = `
            <img src="${imageUrl}" alt="${movie.nombre}" class="movie-image">
            <h3>${movie.nombre}</h3>
            <p>${movie.generos.join(', ')}</p>
        `;

        container.appendChild(movieItem);
    });
}
