import { initViewer, loadModel } from './viewer.mjs';
import { initTree } from './sidebar.mjs';

const login = document.getElementById('login');
try {
    const resp = await fetch('/api/auth/profile');
    if (resp.ok) {
        const user = await resp.json();
        login.innerText = `Logout (${user.name})`;
        login.onclick = () => {
            const iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
            document.body.appendChild(iframe);
            iframe.onload = () => {
                window.location.replace('/api/auth/logout');
                document.body.removeChild(iframe);
            };
        }
        const viewer = await initViewer(document.getElementById('preview'));
        initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));
    } else {
        login.innerText = 'Login';
        // login.onclick = () => window.location.replace('/api/auth/login');
        login.onclick = () => {
            // Open the login in a new window/tab
            const loginWindow = window.open('/api/auth/login', '_blank');
            
            // Poll to check if the login window has been closed
            const checkWindowClosed = setInterval(() => {
                if (loginWindow.closed) {
                    clearInterval(checkWindowClosed);
                    // Refresh the current page after the login window is closed
                    window.location.reload();
                }
            }, 500);
        };
    }
    login.style.visibility = 'visible';
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}