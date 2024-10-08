document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    function generateRandomOrderNumber() {
        return Math.floor(10000000 + Math.random() * 90000000);
    }
    const orderNumberElement = document.querySelector('.order-number-value');
    const orderNumber = generateRandomOrderNumber();
    localStorage.setItem('orderNumber', orderNumber);
    orderNumberElement.textContent = orderNumber;

    const selectionInfo = JSON.parse(localStorage.getItem('selectionInfo'));
    const ticketDetails = document.querySelector('.order-details');

    if (selectionInfo) {
        const movieId = localStorage.getItem('selectedMovieID');

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
                const seatType = selectionInfo.asiento.tipo;
                if (seatType === 'VIP') {
                    if (line.textContent.includes('REGULAR SEAT')) {
                        line.innerHTML = line.innerHTML.replace('REGULAR SEAT', 'VIP SEAT');
                    }
                    if (line.textContent.includes('VIP SEAT')) {
                        const vipSeatElement = line.querySelector('.price');
                        if (vipSeatElement) {
                            vipSeatElement.textContent = `$${precioTotal.toFixed(2)}`;
                        } else {
                            console.error('No se encontró el elemento para el precio VIP');
                        }
                    }
                } else if (seatType === 'Normal' || seatType === 'Regular') {
                    if (line.textContent.includes('REGULAR SEAT')) {
                        const regularSeatElement = line.querySelector('.price');
                        if (regularSeatElement) {
                            regularSeatElement.textContent = `$${precioTotal.toFixed(2)}`;
                        } else {
                            console.error('No se encontró el elemento para el precio regular');
                        }
                    }
                }
        
                if (line.textContent.includes('SERVICE FEE')) {
                    const serviceFeeElement = line.querySelector('.price');
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
            <img src="${movie.imagen}" alt="${movie.nombre}">
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

    let isCardChecked = false; 
    cardCheckbox.checked = isCardChecked;
    updateButtonState();

    cardCheckbox.addEventListener('change', function() {
        isCardChecked = cardCheckbox.checked;
        updateButtonState();
    });

    function updateButtonState() {
        if (isCardChecked) {
            buyButton.disabled = false;
            buyLink.classList.remove('disabled');
        } else {
            buyButton.disabled = true;
            buyLink.classList.add('disabled');
        }
    }

    buyButton.addEventListener('click', async function() {
        const selectionInfo = JSON.parse(localStorage.getItem('selectionInfo'));
        const orderNumber = localStorage.getItem('orderNumber');
        const movieId = localStorage.getItem('selectedMovieID');
        const storedUserId = localStorage.getItem('userId');
    
        if (!selectionInfo || !orderNumber || !movieId || !storedUserId) {
            console.error('Faltan datos para completar la compra.');
            alert('Faltan datos necesarios para la compra. Por favor, inténtelo de nuevo.');
            window.location.href = '../views/asiento.html';
            return;
        }
    
        const ticketData = {
            id: parseInt(orderNumber, 10), 
            id_usuario: parseInt(storedUserId, 10),
            id_asiento: parseInt(selectionInfo.asiento.id, 10),
            id_proyeccion: parseInt(selectionInfo.proyeccionId, 10), 
            precio: parseInt(selectionInfo.precio) 
        };
    
        try {
            const response = await fetch('/boleto/compraBoleto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketData)
            });
    
            const result = await response.json();
    
            if (response.ok && !result.error) {
                console.log('Compra exitosa:', result);
                alert('Compra realizada con éxito!');
                window.location.href = '../views/boleto.html';
            } else {
                console.error('Error al comprar el boleto:', result.error || 'Error desconocido');
                alert(`Error: ${result.error || 'Ocurrió un error al procesar la compra.'}`);
                window.location.href = '../views/asiento.html';
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de compra:', error);
            alert('Ocurrió un error al procesar la compra.');
            window.location.href = '../views/asiento.html';
        }
    });
});
