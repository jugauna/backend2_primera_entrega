document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/sessions/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                if (response.ok) {
                    alert('Logout exitoso');
                    window.location.href = '/login';
                } else {
                    alert('Error al intentar hacer logout');
                }
            } catch (error) {
                console.error('Error al hacer logout:', error);
            }
        });
    }
});