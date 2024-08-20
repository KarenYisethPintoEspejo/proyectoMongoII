document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    if (!movieId) {
        console.error('No movieId provided in the URL');
        return; 
    }

    fetch(`/pelicula/peliculaId/${movieId}`)
        .then(response => response.json())
        .then(movieData => {
            console.log("Detalles de la película:", movieData);
            displayMovieDetail(movieData);
            setupBookNowButton(movieData.id); 
        })
        .catch(error => console.error('Error al cargar detalles de la película:', error));

    const cinemaInfo = document.querySelector('.cinema-info');
    const bookNowButton = document.querySelector('.book-now');

    function toggleBookNowButton() {
        if (bookNowButton.style.display === 'block') {
            bookNowButton.style.display = 'none';
            cinemaInfo.classList.remove('no-hover');
        } else {
            bookNowButton.style.display = 'block';
            cinemaInfo.classList.add('no-hover');
        }
    }
    cinemaInfo.addEventListener('click', () => {
        toggleBookNowButton();

        setTimeout(function(){
            bookNowButton.style.display='none'
            cinemaInfo.classList.remove('no-hover');
        }, 4000)
    });
});

function setupBookNowButton(movieId) {
    document.querySelector('.book-now').addEventListener('click', function() {
        console.log('Setting movieId in localStorage:', movieId); 
        localStorage.setItem('selectedMovieID', movieId);
        window.location.href = './asiento.html';
    });
}

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
                        <div class="container__information">
                            <p class="actor-name">${actor.nombre}</p>
                            <p class="actor-role">${actor.rol}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
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
