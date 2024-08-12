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
            fetch(`http://localhost:5010/pelicula/listaPeliculas`)
                .then(response => response.json())
                .then(allMoviesData => {
                    const movieProjections = allMoviesData.find(pelicula => pelicula.id === parseInt(movieId));
                    if (movieProjections) {
                        movieData.fechas_proyecciones = movieProjections.fechas_proyecciones;
                        movieData.horas_proyecciones = movieProjections.horas_proyecciones;
                    }
                    displayMovieDetail(movieData);

                    const trailerButton = document.querySelector('.trailer');
                    trailerButton.dataset.trailerUrl = movieData.trailer;

                    trailerButton.addEventListener('click', function() {
                        const trailerUrl = this.dataset.trailerUrl;
                        if (trailerUrl) {
                            window.location.href = trailerUrl;
                        } else {
                            console.error('Trailer URL not found');
                        }
                    });
                })
                .catch(error => console.error('Error al cargar las proyecciones de la película:', error));
        })
        .catch(error => console.error('Error al cargar detalles de la película:', error));
});

function displayMovieDetail(movie) {
    const container = document.getElementById('movie-detail-container');
    const proyeccionesHTML = movie.fechas_proyecciones?.map((fecha, index) => `
        <li>Fecha: ${new Date(fecha).toLocaleDateString()} a las ${movie.horas_proyecciones[index]}</li>
    `).join('') || '<p>No hay proyecciones disponibles.</p>';

    container.innerHTML = `
        <img src="${movie.imagen}" alt="${movie.nombre}" class="movie-image">
        <h4>${movie.nombre}</h4>
        <p>${movie.generos.join(', ')}</p>
        <h5>${movie.sinopsis}</h5>
        <h3>Cast</h3>
        <p>${movie.actores.join(', ')}</p>
        <div class="proyecciones">
            <h6>Showtimes</h6>
            <ul>${proyeccionesHTML}</ul>
        </div>
    `;
}




