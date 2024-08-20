document.addEventListener('DOMContentLoaded', function() {
    const chooseseat = document.getElementById("back")
    chooseseat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back()
    })
    
    const countdownElement = document.getElementById('countdown');
    let timeLeft =  14 * 60 + 59;
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
});