// import { initViewer, loadModel } from './viewer.mjs';
// import { initTree } from './sidebar.mjs';

// const login = document.getElementById('login');
// try {
//     const resp = await fetch('/api/auth/profile');
//     if (resp.ok) {
//         const user = await resp.json();
//         login.innerText = `Logout (${user.name})`;
//         login.onclick = () => {
//             const iframe = document.createElement('iframe');
//             iframe.style.visibility = 'hidden';
//             iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
//             document.body.appendChild(iframe);
//             iframe.onload = () => {
//                 window.location.replace('/api/auth/logout');
//                 document.body.removeChild(iframe);
//             };
//         }
//         const viewer = await initViewer(document.getElementById('preview'));
//         initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));
//     } else {
//         login.innerText = 'Login';
//         // login.onclick = () => window.location.replace('/api/auth/login');
        
//         login.onclick = () => {
//             // Open login in a popup window
//             const loginWindow = window.open('/api/auth/login', 'Login', 'width=600,height=600');
        
//             // Listen for the authentication token from the popup window
//             window.addEventListener('message', (event) => {
//                 if (event.origin !== window.location.origin) {
//                     return; // Ignore messages from other origins
//                 }
//                 const { token } = event.data;
//                 if (token) {
//                     // Save the token and refresh the page or load viewer
//                     // You can now use this token to make API calls
//                     window.location.reload();
//                 }
//             });
//         };
//     }
//     login.style.visibility = 'visible';
// } catch (err) {
//     alert('Could not initialize the application. See console for more details.');
//     console.error(err);
// }







import { initViewer, loadModel } from './viewer.mjs';
import { initTree } from './sidebar.mjs';


const login = document.getElementById('login');

try {
    // const resp = await fetch('/api/auth/profile');

    const authToken = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expires_at = localStorage.getItem('expires_at');
    const internal_token = localStorage.getItem('internal_token');

    const resp = await fetch('/api/auth/profile', {
        headers: {
            'Authorization': `Bearer ${authToken}`,  // Send authToken in the Authorization header
            'x-refresh-token': refreshToken,         // Send refreshToken in a custom header
            'x-expires-at': expires_at,              // Send expires_at in a custom header
            'x-internal-token': internal_token       // Send internal_token in a custom header
        }
    });


    if (resp.ok) {
        const user = await resp.json();
        login.innerText = `Logout (${user.name})`;
        login.onclick = () => {
            // Logout logic
            localStorage.removeItem('authToken');
            window.location.reload();  // Reload the page after logout
        };

        // Initialize the viewer and sidebar
        const viewer = await initViewer(document.getElementById('preview'));
        initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));

    } else {
        login.innerText = 'Login';
        login.onclick = () => {
            const loginWindow = window.open('/api/auth/login', 'Login', 'width=600,height=600');
        
            window.addEventListener('message', (event) => {
                if (event.origin !== window.location.origin) {
                    return;  // Ignore messages from other origins
                }
                
                const { token, refreshToken, expires_at, internal_token } = event.data;
                if (token) {
                    localStorage.setItem('authToken', token);  
                    localStorage.setItem('refreshToken', refreshToken); 
                    localStorage.setItem('expires_at', expires_at); 
                    localStorage.setItem('internal_token', internal_token); 

                    window.location.reload();  // Reload the page to load viewer with token

                    console.log(token);
                }
            });
        };
    }
    console.log(resp);
    login.style.visibility = 'visible';
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}