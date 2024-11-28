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

// Function to check if a token is present in the URL and store it in localStorage
function handleTokenInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Store the token in localStorage
        localStorage.setItem('authToken', token);
        
        // Clear the token from the URL
        window.history.replaceState(null, null, window.location.pathname);
        
        // Optionally refresh or initialize the viewer
        window.location.reload();  // This reload is optional if you want to load something immediately
    }
}

// Check if the user is logged in by checking for a token in localStorage
async function checkAuthStatus() {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
        // Token exists, user is logged in
        // const resp = await fetch('/api/auth/profile');
        // const user = await resp.json();
        login.innerText = `Logout`;
        login.onclick = () => {
            // Logout logic
            localStorage.removeItem('authToken');
            window.location.reload();  // Reload the page after logout
        };

        // Initialize the viewer and tree
        initViewer(document.getElementById('preview'))
            .then(viewer => {
                initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, ''))); 
            })
            .catch(err => {
                console.error('Failed to initialize viewer:', err);
            });
    } else {
        // No token found, show login button
        login.innerText = 'Login';
        login.onclick = () => {
            // Open login in a popup window
            const loginWindow = window.open('/api/auth/login', 'Login', 'width=600,height=600');
        
            // Listen for the authentication token from the popup window
            window.addEventListener('message', (event) => {
                if (event.origin !== window.location.origin) {
                    return; // Ignore messages from other origins
                }
                const { token } = event.data;
                if (token) {
                    // Save the token and refresh the page or load viewer
                    localStorage.setItem('authToken', token);
                    window.location.reload();  // Reload to reflect the authenticated state
                }
            });
        };
    }
    login.style.visibility = 'visible';
}

try {
    // Handle token if present in the URL when page is loaded
    handleTokenInURL();
    
    // Check authentication status
    checkAuthStatus();
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}


