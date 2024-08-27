document.addEventListener('DOMContentLoaded', () => {
    const storedUserId = localStorage.getItem('userId');
    fetch(`/boleto/boletos/${storedUserId}`)
        .then(response => response.json())
        .then(tickets => {
            if (Array.isArray(tickets) && tickets.length > 0) {
                const movieDetailsPromises = tickets.map(ticket => 
                    fetch(`/pelicula/peliculaId/${ticket.id_pelicula}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(movieData => ({
                            ...ticket,
                            movieData
                        }))
                );

                return Promise.all(movieDetailsPromises);
            } else {
                throw new Error('No se encontraron boletos para el usuario.');
            }
        })
        .then(ticketsWithMovies => {
            displayTickets(ticketsWithMovies);
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('main').innerHTML = `<p>Error: ${error.message}</p>`;
        });
});

function displayTickets(ticketsWithMovies) {
    const container = document.querySelector('main');
    container.innerHTML = '';

    ticketsWithMovies.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket';

        const date = new Date(ticket.fecha);
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = ticket.hora;

        ticketElement.innerHTML = `
            <section class="info-movie">
                <div class="ticket-header">
                    <img src="${ticket.movieData.imagen2 || 'default-image.jpg'}" alt="Movie Image" class="movie-image">
                </div>
                <div class="movie-title">
                    <h1>${ticket.movieData.nombre}</h1>
                    <p>Show this ticket at the entrance</p>
                </div>
            </section>
            <section class="ticket-info">
                <div class="info">
                    <div class="info-cinema">
                        <div class="text-cinema">
                            <p class="label">Cinema</p>
                            <p class="value">CAMPUSLANDS</p>
                        </div>
                        <div class="image-cinema">
                            <img src="https://ugc.production.linktr.ee/ZJXG7pbLSwyitEyTNSc8_O1cTAW6KAObqc4un?io=true&size=avatar-v3_0" alt="">
                        </div>
                    </div>
                </div>
                <section class="info-ticket">
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
                            <p class="value">${ticket.fila}${ticket.numero}</p>
                        </div>
                    </div>
                    <div class="third-box">
                        <div class="info">
                            <p class="label">Cost</p>
                            <p class="value">${ticket.precio.toFixed(2)}</p>
                        </div>
                        <div class="info">
                            <p class="label">Order ID</p>
                            <p class="value">${ticket.id}</p>
                        </div>
                    </div>
                </section>
                <div class="custom-dashed-line"></div>
                <div class="barcode">
                    <svg id="barcode-${ticket.id}"></svg>
                </div>
            </section>
        `;

        container.appendChild(ticketElement);

        JsBarcode(`#barcode-${ticket.id}`, ticket.id, {
            format: "CODE128", 
            width: 3,          
            height: 50,       
            displayValue: false 
        });
    });
}