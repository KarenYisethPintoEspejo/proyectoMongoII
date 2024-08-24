document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    const selectionInfo = JSON.parse(localStorage.getItem('selectionInfo'));
    const ticketDetails = document.querySelector('.order-details');

    if (selectionInfo) {
        const movieId = localStorage.getItem('selectedMovieID');
        console.log('ID de la película desde localStorage en pago:', movieId);

        if (!movieId) {
            console.error('No se encontró el movieId en localStorage');
            return;
        }

        let movieData = JSON.parse(localStorage.getItem(`movieDetails_${movieId}`));
        if (!movieData) {

            fetchMovieDetails(movieId);
        } else {

            displayMovieDetails(movieData);
        }

        const seatDetail = `${selectionInfo.asiento.fila}${selectionInfo.asiento.numero}`;
        const ticketElement = ticketDetails.querySelector('.line .seat-number');
        ticketElement.textContent = seatDetail;

        const precioTotal = selectionInfo.precio;
        const serviceFee = 1.99;

        setTimeout(() => {
            const lines = ticketDetails.querySelectorAll('.line');
            lines.forEach(line => {
                if (line.textContent.includes('REGULAR SEAT')) {
                    const regularSeatElement = line.querySelector('.price');
                    console.log('Elemento de precio regular:', regularSeatElement);
                    if (regularSeatElement) {
                        regularSeatElement.textContent = `$${precioTotal.toFixed(2)}`;

                    } else {
                        console.error('No se encontró el elemento para el precio regular');
                    }
                } else if (line.textContent.includes('SERVICE FEE')) {
                    const serviceFeeElement = line.querySelector('.price');
                    console.log('Elemento de cargo por servicio:', serviceFeeElement);
                    if (serviceFeeElement) {
                        serviceFeeElement.textContent = `$${serviceFee.toFixed(2)} x 1`;
                    } else {
                        console.error('No se encontró el elemento para el cargo por servicio');
                    }
                }
            });
        }, 500);

    } else {
        console.error('No se encontró la información de selección en localStorage');
        const ticketElement = ticketDetails.querySelector('.line .seat-number');
        ticketElement.textContent = 'No seat selected';
    }

    function fetchMovieDetails(movieId) {
        fetch(`/pelicula/peliculaId/${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles de la película');
                }
                return response.json();
            })
            .then(movieData => {
                console.log("Detalles de la película:", movieData);
                localStorage.setItem(`movieDetails_${movieId}`, JSON.stringify(movieData));
                displayMovieDetails(movieData);
            })
            .catch(error => console.error('Error al cargar los detalles de la película:', error));
    }

    function displayMovieDetails(movie) {
        const movieInfoSection = document.querySelector('.movie-info');

        const date = new Date(selectionInfo.fecha);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
    
        movieInfoSection.innerHTML = `
            <img src="${movie.imagen2}" alt="${movie.nombre}">
            <div class="movie-details">
                <h1>${movie.nombre}</h1>
                <p>${movie.generos.join(', ')}</p>
                <h5>CAMPUSLANDS</h5>
                <h6>${formattedDate}. ${selectionInfo.hora}</h6>
            </div>
        `;
    }
    

    const countdownElement = document.getElementById('countdown');
    let timeLeft = 14 * 60 + 59;
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            window.history.back();
        } else {
            timeLeft--;
        }
    }
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    const cardCheckbox = document.getElementById('cardCheckbox');
    const buyButton = document.getElementById('buyButton');
    const buyLink = document.getElementById('buyLink');

    const isCardChecked = JSON.parse(localStorage.getItem('isCardChecked')) || false;
    cardCheckbox.checked = isCardChecked;
    updateButtonState();

    cardCheckbox.addEventListener('change', function() {
        localStorage.setItem('isCardChecked', cardCheckbox.checked);
        updateButtonState();
    });

    function updateButtonState() {
        if (cardCheckbox.checked) {
            buyButton.disabled = false;
            buyLink.classList.remove('disabled');
        } else {
            buyButton.disabled = true;
            buyLink.classList.add('disabled');
        }
    }
});
