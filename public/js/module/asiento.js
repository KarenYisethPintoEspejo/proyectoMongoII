function selectDay(element) {
    document.querySelectorAll('.days .day').forEach(function(day) {
        day.classList.remove('active', 'active-state');
    });
    element.classList.add('active', 'active-state');
}

function selectHour(element) {
    document.querySelectorAll('.hour-price .hour').forEach(function(hour) {
        hour.classList.remove('active', 'active-state');
    });
    element.classList.add('active', 'active-state');
}

const asientos = document.querySelectorAll('.asientos__lista button, .asientos__preferenciales button');

asientos.forEach(asiento => {
    asiento.addEventListener('click', () => {
        asiento.classList.toggle('active');
    });
});

const precioElemento = document.querySelector('.precio h2');
let precioTotal = 0;
function selectHour(element) {
    const precioTexto = element.querySelector('p').textContent.trim();
    const precio = parseFloat(precioTexto.replace('$', '').replace(' ·3D', '')); 
    
    if (isNaN(precio)) {
        console.error('Error al extraer el precio:', precioTexto);
        return;
    }
    if (element.classList.contains('active')) {
        element.classList.remove('active', 'active-state');
        precioTotal -= precio;
    } else {
        element.classList.add('active', 'active-state');
        precioTotal += precio;
    }
    precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
}