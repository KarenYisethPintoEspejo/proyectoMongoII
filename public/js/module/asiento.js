function selectDay(element) {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.days .day').forEach(function(day) {
        day.classList.remove('active', 'active-state');
    });
    if (!isActive) {
        element.classList.add('active', 'active-state');
    }
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
