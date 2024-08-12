document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    if (!movieId) {
        console.error('No movieId provided in the URL');
        return; 
    }
    fetch(`http://localhost:5010/pelicula/peliculaId/${movieId}`)
        .then(response => response.json())
        .then(data => {
            displayMovieDetail(data);
        })
        .catch(error => console.error('Error al cargar detalles de la película:', error));
});


function displayMovieDetail(movie) {
    const container = document.getElementById('movie-detail-container');
    container.innerHTML = `
        <h2>${movie.nombre}</h2>
        <img src="${movie.imagen}" alt="${movie.nombre}" class="movie-image">
        <p>${movie.sinopsis}</p>
        <!-- Agrega más detalles según necesites -->
    `;
}
