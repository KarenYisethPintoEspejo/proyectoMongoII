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
