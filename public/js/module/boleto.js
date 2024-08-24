document.addEventListener("DOMContentLoaded", function() {
    const movieId = localStorage.getItem('selectedMovieID');
    const selectionInfo = JSON.parse(localStorage.getItem('selectionInfo'));

    if (movieId && selectionInfo) {
        const barcodeData = `Seat:${selectionInfo.asiento.fila}${selectionInfo.asiento.numero}`;

        JsBarcode("#barcode", barcodeData, {
            format: "CODE128", 
            width: 2.3,          
            height: 55,       
            displayValue: false 
        });

        let movieData = JSON.parse(localStorage.getItem(`movieDetails_${movieId}`));
        
        if (!movieData) {
            fetchMovieDetails(movieId);
        } else {
            displayMovieDetails(movieData);
        }

        displayTicketDetails(selectionInfo);
    } else {
        console.error('No se encontraron los datos necesarios en localStorage');
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
        const movieInfoSection = document.querySelector('.info-movie');
        
        movieInfoSection.innerHTML = `
            <div class="ticket-header">
                <img src="${movie.imagen2}" alt="Movie Image" class="movie-image">
            </div>

            <div class="movie-title">
                <h1>${movie.nombre}</h1>
                <p>Show this ticket at the entrance</p>
            </div>
        `;
    }

    function displayTicketDetails(selectionInfo) {
        const ticketInfoSection = document.querySelector('.info-ticket');
        const date = new Date(selectionInfo.fecha);
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = selectionInfo.hora;

        ticketInfoSection.innerHTML = `
            <div class="first-box">
                <div class="info">
                    <p class="label">Date</p>
                    <p class="value">${formattedDate}</p>
                </div>

                <div class="info">
                    <p class="label">Time</p>
                    <p class="value">${formattedTime}</p>
                </div>
            </div>
            
            <div class="second-box">
                <div class="info">
                    <p class="label">Cinema Hall #</p>
                    <p class="value">CineCampus</p>
                </div>

                <div class="info">
                    <p class="label">Seat</p>
                    <p class="value">${selectionInfo.asiento.fila}${selectionInfo.asiento.numero}</p>
                </div>
            </div>
            
            <div class="third-box"> 
                <div class="info">
                    <p class="label">Cost</p>
                    <p class="value">$${selectionInfo.precio.toFixed(2)}</p>
                </div>
                
                <div class="info">
                    <p class="label">Order ID</p>
                    <p class="value">${selectionInfo.orderId || '123456789'}</p>
                </div>
            </div>
        `;
    }
});
