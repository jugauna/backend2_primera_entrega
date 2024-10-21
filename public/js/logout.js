// public/js/logout.js
const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST',
            credentials: 'include'  // Asegura que las cookies se incluyan en la solicitud
        });

        if (response.ok) {
            alert('Logout exitoso');
            window.location.href = '/login';  // Redirecciona al usuario a la página de login
        } else {
            alert('Error al intentar hacer logout');
        }
    } catch (error) {
        console.error('Error al hacer logout:', error);
    }
});