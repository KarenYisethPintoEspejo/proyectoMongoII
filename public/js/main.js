document.getElementById('loginButton').addEventListener('click', async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del enlace

    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = true;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log(`Intentando login con usuario: ${username}`);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login exitoso');
            const { userId } = data;
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            window.location.href = './views/principal.html';
        } else {
            console.error('Error en el login:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    } finally {
        loginButton.disabled = false;
    }
});
