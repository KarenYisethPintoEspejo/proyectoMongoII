document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back");
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back();
    });

    const movieId = localStorage.getItem('selectedMovieID');
    console.log('ID de la película desde localStorage:', movieId);
    if (!movieId) {
        console.error('No movieId found in localStorage');
        return;
    }

    let selectedDate = null;
    let selectedProjectionId = null;

    const hourPriceContainer = document.getElementById('hour-price-container');
    const seatsContainerFront = document.getElementById('seatsContainerFront');
    const seatsContainer = document.getElementById('seatsContainer');
    const precioElemento = document.querySelector('.precio h2');
    let precioTotal = 0;

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
        updateProjectionsForSelectedDate(); 
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
    
            if (movieData) {
                updateProjectionsForSelectedDate();
            } else {
                console.log('Esperando datos de la película...');
            }
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
    
            selectedProjectionId = element.dataset.projectionId; 
    
            const precioTexto = element.querySelector('p').textContent.trim();
            const precio = parseFloat(precioTexto.replace('$', '').replace(' ·3D', '')); 
            
            if (isNaN(precio)) {
                console.error('Error al extraer el precio:', precioTexto);
                return;
            }
            precioTotal = precio;
            precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
    
            if (selectedProjectionId) {
                fetchSeats(selectedProjectionId); 
                document.querySelector('.asientos').classList.remove('hidden'); // Mostrar los asientos
            }
        } else {
            precioTotal = 0; 
            precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
            document.querySelector('.asientos').classList.add('hidden'); // Ocultar los asientos si se deselecciona
        }
    }
    
    const asientos = document.querySelectorAll('.asientos__lista button, .asientos__preferenciales button');
    asientos.forEach(asiento => {
        asiento.addEventListener('click', () => {
            asiento.classList.toggle('active');
        });
    });

    function displayMovieProjections(movie) {
        if (!selectedDate) {
            hourPriceContainer.innerHTML = '<p>Select a date to view projections.</p>';
            return;
        }
    
        hourPriceContainer.innerHTML = '';
    
        if (!movie.horas_proyecciones || !movie.id_proyecciones || !movie.precios_proyecciones || !movie.formatos_proyecciones || !movie.fechas_proyecciones) {
            console.error('Datos de proyección no encontrados en movieData');
            hourPriceContainer.innerHTML = '<p>No projections data available.</p>';
            return;
        }
    
        if (movie.horas_proyecciones.length !== movie.id_proyecciones.length ||
            movie.horas_proyecciones.length !== movie.precios_proyecciones.length ||
            movie.horas_proyecciones.length !== movie.formatos_proyecciones.length ||
            movie.horas_proyecciones.length !== movie.fechas_proyecciones.length) {
            console.error('Los arrays de proyecciones tienen longitudes diferentes');
            hourPriceContainer.innerHTML = '<p>Data inconsistency found.</p>';
            return;
        }
    
        const selectedDateFormatted = new Date(selectedDate).toISOString().split('T')[0];
    
        const filteredProjections = movie.horas_proyecciones
            .map((hora, index) => ({
                id: movie.id_proyecciones[index],
                hora: hora,
                fecha: new Date(movie.fechas_proyecciones[index]).toISOString().split('T')[0], 
                precio: movie.precios_proyecciones[index],
                formato: movie.formatos_proyecciones[index]
            }))
            .filter(proyeccion => proyeccion.fecha === selectedDateFormatted);
    
        filteredProjections.forEach(proyeccion => {
            const hourDiv = document.createElement('div');
            hourDiv.className = 'hour';
            hourDiv.dataset.projectionId = proyeccion.id;
            hourDiv.innerHTML = `
                <h2>${proyeccion.hora}</h2>
                <p>$${proyeccion.precio} · ${proyeccion.formato}</p>
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
    
    

        function createRowContainer(container, rowName, isFrontRow = false) {
        const rowContainer = document.createElement('div');
        rowContainer.className = `row ${rowName} ${isFrontRow ? 'front' : 'other'}`;
        container.appendChild(rowContainer);
        return rowContainer;
    }
    async function fetchSeats(projectionId) {
        try {
            const asientosSection = document.querySelector('.asientos'); 
    
            if (!asientosSection) {
                console.error('Contenedor de asientos no encontrado');
                return;
            }
            asientosSection.classList.add('hidden');
    
          
            const response = await fetch(`/asiento/listarAsientosProyeccion/${projectionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
    

            const seatsContainerFront = document.querySelector('.asientos__normal');
            const seatsContainer = document.querySelector('.asientos__preferenciales');
    
            if (seatsContainerFront) {
                seatsContainerFront.querySelectorAll('.asientos__lista').forEach(div => div.innerHTML = '');
            }
    
            if (seatsContainer) {
                seatsContainer.querySelectorAll('div').forEach(div => {
                    Array.from(div.childNodes).forEach(child => {
                        if (child.nodeName !== 'SMALL') {
                            div.removeChild(child);
                        }
                    });
                });
            }

            if (data.error) {
                asientosSection.innerHTML = `<p>${data.error}</p>`;
            } else {
                const frontRowA = seatsContainerFront.querySelector('[fila="1"] .asientos__lista');
                const frontRowB = seatsContainerFront.querySelector('[fila="2"] .asientos__lista');
    
                const otherRows = {
                    'C': seatsContainer.querySelector('[colum="3"]'),
                    'D': seatsContainer.querySelector('[colum="4"]'),
                    'E': seatsContainer.querySelector('[colum="5"]'),
                    'F': seatsContainer.querySelector('[colum="6"]')
                };
    
                data.asientos.forEach(asiento => {
                    const seatElement = document.createElement('button');
                    seatElement.textContent = asiento.numero;
                    seatElement.className = 'seat';
    
                    if (asiento.ocupado) {
                        seatElement.classList.add('ocupado');
                        seatElement.style.backgroundColor = '#808080';
                        seatElement.style.pointerEvents = 'none';
                    } else {
                        seatElement.style.backgroundColor = '#323232';
                    }
    
                    if (asiento.fila === 'A') {
                        frontRowA.appendChild(seatElement);
                    } else if (asiento.fila === 'B') {
                        frontRowB.appendChild(seatElement);
                    } else if (['C', 'D', 'E', 'F'].includes(asiento.fila)) {
                        const rowDiv = otherRows[asiento.fila];
                        if (rowDiv) {
                            rowDiv.appendChild(seatElement);
                        } else {
                            console.warn(`Fila no reconocida: ${asiento.fila}`);
                        }
                    } else {
                        console.warn(`Fila no reconocida: ${asiento.fila}`);
                    }
                });
                asientosSection.querySelectorAll('small').forEach(letter => {
                    letter.style.display = 'inline';
                });
                asientosSection.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error al obtener los asientos:', error);
            const seatsContainer = document.querySelector('.asientos__preferenciales > div');
            if (seatsContainer) {
                seatsContainer.innerHTML = `<p>Error al obtener los asientos.</p>`;
            }
        }
    }
    
});
