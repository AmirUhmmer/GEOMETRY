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


        // retrieve query parameters from the URL
        let params = {};
        let queryString = window.location.search.substring(1);
        let queryParts = queryString.split("&");
        for (let i = 0; i < queryParts.length; i++) {
            let param = queryParts[i].split("=");
            params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
        }

        // get the entity name and record ID
        
        let entityType = params["typename"];  // The entity type name (e.g., iotdatapoint)
        let recordId = params["id"];     // The unique identifier (GUID) of the record

        // Log the full URL to the console
        let fullURL = window.location.href;
        console.log("Full URL:", fullURL); // This will log the full URL, e.g., http://localhost:8080/index.html?etn=iotdatapoint&id=12345678-1234-1234-1234-123456789abc


        // Now you can use `entityType` and `recordId` in your web app logic
        console.log("Entity Type:", entityType);
        console.log("Record ID:", recordId);



        // Initialize the viewer and sidebar
        const viewer = await initViewer(document.getElementById('preview'));

        // initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));


        // Mapping of recordId to geometry URN values
        const geometryMap = {
            //DB8
            '2e85182d-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg',
            
            //HG62
            '766fb31a-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnZGZ01YNjRUVDBDcWU4THhZa2RvVUE/dmVyc2lvbj0xNw'

        };

        // Default geometry if no match is found
        let geometry = geometryMap[recordId] || 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg';


        // Initialize the tree and handle model loading
        initTree('#tree', (id) => {
            // If no ID is provided, use the sample URN
            console.log(id);
            const urn = id !== 0 ? window.btoa(id).replace(/=/g, '') : geometry;
            loadModel(viewer, urn);
        });

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