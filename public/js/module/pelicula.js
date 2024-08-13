const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    if (!movieId) {
        console.error('No movieId provided in the URL');
        return; 
    }
    fetch(`http://localhost:5010/pelicula/peliculaId/${movieId}`)
        .then(response => response.json())
        .then(movieData => {
            console.log("Detalles de la película:", movieData);
            
            fetch(`http://localhost:5010/pelicula/listaPeliculas`)
                .then(response => response.json())
                .then(allMoviesData => {
                    const movieProjections = allMoviesData.find(pelicula => pelicula.id === parseInt(movieId));

                    if (movieProjections) {
                        console.log("Proyecciones encontradas:", movieProjections.fechas_proyecciones, movieProjections.horas_proyecciones);
                        movieData.fechas_proyecciones = movieProjections.fechas_proyecciones;
                        movieData.horas_proyecciones = movieProjections.horas_proyecciones;
                    } else {
                        console.error('No se encontraron proyecciones para la película con ID:', movieId);
                    }

                    displayMovieDetail(movieData);
                })
                .catch(error => console.error('Error al cargar las proyecciones de la película:', error));
        })
        .catch(error => console.error('Error al cargar detalles de la película:', error));
});

function displayMovieDetail(movie) {
    const container = document.getElementById('movie-detail-container');
    container.innerHTML = `
        <img src="${movie.imagen2}" alt="${movie.nombre}" class="movie-image">
        <div class="movies-container2">
            <h4>${movie.nombre}</h4>
            <p>${movie.generos.join(', ')}</p>
            <h5>${movie.sinopsis}</h5>
            <h3>Cast</h3>
            <div class="actors-container">
                ${movie.actores.map(actor => `
                    <div class="actor-info">
                        <img src="${actor.foto}" alt="${actor.nombre}" class="actor-photo">
                        <div>
                            <p class="actor-name">${actor.nombre}</p>
                            <p class="actor-role">${actor.rol}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="button__trailer__buy">
            <button class="trailer" data-trailer-url="${movie.trailer}">
                <i class='bx bxs-right-arrow'></i> Watch Trailer
            </button>
        </div>
    `;
    
    const trailerButton = container.querySelector('.trailer');
    trailerButton.addEventListener('click', function() {
        const trailerUrl = this.getAttribute('data-trailer-url');
        window.location.href = trailerUrl;
    });
}
