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
        login.onclick = () => window.location.replace('/api/auth/login');
        
        // login.onclick = () => {
        //     // Open login in a popup window
        //     const loginWindow = window.open('/api/auth/login', 'Login', 'width=600,height=600');
        
        //     // Listen for the authentication token from the popup window
        //     window.addEventListener('message', (event) => {
        //         if (event.origin !== window.location.origin) {
        //             return; // Ignore messages from other origins
        //         }
        //         const { token } = event.data;
        //         if (token) {
        //             // Save the token and refresh the page or load viewer
        //             // You can now use this token to make API calls
        //             window.location.reload();
        //         }
        //     });
        // };
    }
    login.style.visibility = 'visible';
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}