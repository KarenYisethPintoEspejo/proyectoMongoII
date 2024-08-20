document.addEventListener('DOMContentLoaded', function() {

    const chooseseat = document.getElementById("back")
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back()
    })
    const movieId = localStorage.getItem('selectedMovieID');
    console.log('ID de la película desde localStorage:', movieId);
    if (!movieId) {
        console.error('No movieId found in localStorage');
        return;
    }
    let selectedDate = null;

    const hourPriceContainer = document.getElementById('hour-price-container');
    hourPriceContainer.innerHTML = '<p>Select a date to view projections.</p>';

    let movieData = null;

    fetch('/pelicula/listaPeliculas')
        .then(response => response.json())
        .then(peliculasData => {
            movieData = peliculasData.find(pelicula => String(pelicula.id) === String(movieId));
            if (!movieData) {
                console.error('No se encontró la película con el ID proporcionado');
                return;
            }
            console.log("Detalles de la película:", movieData);
        })
        .catch(error => console.error('Error al cargar la lista de películas:', error));

    function selectDay(element) {
        const isActive = element.classList.contains('active');
        document.querySelectorAll('.days .day').forEach(function(day) {
            day.classList.remove('active', 'active-state');
        });
        if (!isActive) {
            element.classList.add('active', 'active-state');
            selectedDate = new Date(element.dataset.date).toISOString().split('T')[0]; 
            updateProjectionsForSelectedDate(); 
        }
    }

    const daysContainer = document.getElementById('days-container');
    const today = new Date();

    const getDayName = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.dataset.date = date.toISOString().split('T')[0]; 
        dayDiv.onclick = () => selectDay(dayDiv);

        const dayName = document.createElement('p');
        dayName.textContent = getDayName(date);
        const dayNumber = document.createElement('h2');
        dayNumber.textContent = date.getDate();

        dayDiv.appendChild(dayName);
        dayDiv.appendChild(dayNumber);

        daysContainer.appendChild(dayDiv);
    }

    function selectHour(element) {
        const isActive = element.classList.contains('active');
        document.querySelectorAll('.hour-price .hour').forEach(function(hour) {
            hour.classList.remove('active', 'active-state');
        });
        if (!isActive) {
            element.classList.add('active', 'active-state');

            const precioTexto = element.querySelector('p').textContent.trim();
            const precio = parseFloat(precioTexto.replace('$', '').replace(' ·3D', '')); 
            
            if (isNaN(precio)) {
                console.error('Error al extraer el precio:', precioTexto);
                return;
            }
            precioTotal = precio;
            precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
        } else {
            precioTotal = 0; 
            precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
        }
    }

    const asientos = document.querySelectorAll('.asientos__lista button, .asientos__preferenciales button');
    asientos.forEach(asiento => {
        asiento.addEventListener('click', () => {
            asiento.classList.toggle('active');
        });
    });

    const precioElemento = document.querySelector('.precio h2');
    let precioTotal = 0;

    function displayMovieProjections(movie) {
        if (!selectedDate) {
            hourPriceContainer.innerHTML = '<p>Select a date to view projections.</p>';
            return;
        }

        hourPriceContainer.innerHTML = '';

        if (!movie.horas_proyecciones || movie.horas_proyecciones.length === 0) {
            hourPriceContainer.innerHTML = '<p>No projections available for this movie.</p>';
            return;
        }

        const filteredProjections = movie.horas_proyecciones
            .map((hora, index) => ({
                hora: hora,
                fecha: new Date(movie.fechas_proyecciones[index]).toISOString().split('T')[0],
                precio: movie.precios_proyecciones[index],
                formato: movie.formatos_proyecciones[index]
            }))
            .filter(proyeccion => proyeccion.fecha === selectedDate);

        filteredProjections.forEach(proyeccion => {
            const hourDiv = document.createElement('div');
            hourDiv.className = 'hour';
            hourDiv.innerHTML = `
                <h2>${proyeccion.hora}</h2>
                <p> $${proyeccion.precio} · ${proyeccion.formato}</p>
            `;
            hourDiv.addEventListener('click', function() {
                selectHour(this);
            });
            hourPriceContainer.appendChild(hourDiv);
        });

        if (filteredProjections.length === 0) {
            hourPriceContainer.innerHTML = '<p>No projections available for this date.</p>';
        }
    }

    function updateProjectionsForSelectedDate() {
        if (!movieData) {
            console.error('Movie data is not loaded yet.');
            return;
        }
        displayMovieProjections(movieData);
    }


});
