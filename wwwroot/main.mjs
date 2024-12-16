// import { initViewer, loadModel } from './viewer.mjs';
// import { initTree } from './sidebar.mjs';


// const login = document.getElementById('login');

// try {
//     // const resp = await fetch('/api/auth/profile');

//     const authToken = localStorage.getItem('authToken');
//     const refreshToken = localStorage.getItem('refreshToken');
//     const expires_at = localStorage.getItem('expires_at');
//     const internal_token = localStorage.getItem('internal_token');

//     console.log(expires_at);

//     const resp = await fetch('/api/auth/profile', {
//         headers: {
//             'Authorization': `Bearer ${authToken}`,  // Send authToken in the Authorization header
//             'x-refresh-token': refreshToken,         // Send refreshToken in a custom header
//             'x-expires-at': expires_at,              // Send expires_at in a custom header
//             'x-internal-token': internal_token       // Send internal_token in a custom header
//         }
//     });


//     if (resp.ok) {
//         const user = await resp.json();
//         login.innerText = `Logout (${user.name})`;
//         login.onclick = () => {
//             // Logout logic
//             localStorage.removeItem('authToken');
//             window.location.reload();  // Reload the page after logout
//         };


//         // retrieve query parameters from the URL
//         let params = {};
//         let queryString = window.location.search.substring(1);
//         let queryParts = queryString.split("&");
//         for (let i = 0; i < queryParts.length; i++) {
//             let param = queryParts[i].split("=");
//             params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
//         }

//         // get the entity name and record ID
        
//         let entityType = params["typename"];  // The entity type name (e.g., iotdatapoint)
//         let recordId = params["id"];     // The unique identifier (GUID) of the record

//         // Log the full URL to the console
//         let fullURL = window.location.href;
//         console.log("Full URL:", fullURL); // This will log the full URL, e.g., http://localhost:8080/index.html?etn=iotdatapoint&id=12345678-1234-1234-1234-123456789abc


//         // Now you can use `entityType` and `recordId` in your web app logic
//         console.log("Entity Type:", entityType);
//         console.log("Record ID:", recordId);



//         // Initialize the viewer and sidebar
//         const viewer = await initViewer(document.getElementById('preview'));

//         // initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));


//         // Mapping of recordId to geometry URN values
//         const geometryMap = {
//             //DB8
//             '2e85182d-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg',

//             //HG62
//             '766fb31a-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj04NQ',

//             //SOL10
//             'f8c64108-adb7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmdzMFBSQjNlUlVTNkFOTEswOXZEWUE/dmVyc2lvbj0xOQ'

//         };

//         // Default geometry if no match is found
//         let geometry = geometryMap[recordId] || 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg';


//         // Initialize the tree and handle model loading
//         initTree('#tree', (id) => {
//             // If no ID is provided, use the sample URN
//             console.log(id);
//             const urn = id !== 0 ? window.btoa(id).replace(/=/g, '') : geometry;
//             loadModel(viewer, urn);
//         });

//     } else {
//         login.innerText = 'Login';
//         login.onclick = () => {
//             const loginWindow = window.open('/api/auth/login', 'Login', 'width=600,height=600');
        
//             window.addEventListener('message', (event) => {
//                 if (event.origin !== window.location.origin) {
//                     return;  // Ignore messages from other origins
//                 }
                
//                 const { token, refreshToken, expires_at, internal_token } = event.data;
//                 if (token) {
//                     localStorage.setItem('authToken', token);  
//                     localStorage.setItem('refreshToken', refreshToken); 
//                     localStorage.setItem('expires_at', expires_at); 
//                     localStorage.setItem('internal_token', internal_token); 

//                     window.location.reload();  // Reload the page to load viewer with token

//                     console.log(token);
//                 }
//             });
//         };
//     }
//     console.log(resp);
//     login.style.visibility = 'visible';
// } catch (err) {
//     alert('Could not initialize the application. See console for more details.');
//     console.error(err);
// }


// ENABLE TOP CODE TO VIEW THE SIDEBAR MAIN.MJS, AUTH/TOKEN, AUTH/PROFILE


import { initViewer, loadModel } from './viewer.mjs';
import { initTree } from './sidebar.mjs';

const login = document.getElementById('login');

// Function to fetch access token using Client Credentials from your server
export async function fetchAccessToken() {
    try {
        const response = await fetch('/api/auth/token');  // Fetch the token from the server-side endpoint
        if (!response.ok) {
            throw new Error('Failed to get access token');
        }
        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000); // Store expiry time in milliseconds
        localStorage.setItem('internal_token', data.internal_token);

        return data.access_token;  // Return the access token
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

// Function to check if the token is still valid
function isTokenExpired() {
    const expires_at = localStorage.getItem('expires_at');
    return !expires_at || Date.now() >= parseInt(expires_at, 10);
}

async function initApp() {
    try {
        let authToken = localStorage.getItem('authToken');
        let refreshToken = localStorage.getItem('refreshToken');
        let expires_at = localStorage.getItem('expires_at');
        let internal_token = localStorage.getItem('internal_token');

        // console.log(authToken);
        // console.log(refreshToken);
        // console.log(expires_at);
        // console.log(internal_token);

        // If the token is expired or not present, fetch a new one
        if (!authToken || isTokenExpired()) {
            console.log('Fetching new access token...');
            authToken = await fetchAccessToken();  // Get a new token if expired
        }

        // Fetch user profile using the access token
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
            login.innerText = `Logout`;
            login.style.visibility = 'hidden'; //test
            login.onclick = () => {
                // Logout logic
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('expires_at');
                localStorage.removeItem('internal_token');
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
            let property = params["property"];  // The property value, if it exists
            let uniqueID = params["uniqueID"];  // The uniqueID, if it exists

            if (uniqueID) {
                localStorage.setItem('uniqueID', uniqueID);
                console.log("uniqueID stored in localStorage:", uniqueID);
            } else {
                console.log("uniqueID not found in URL");
            }

            if (property) {
                property = decodeURIComponent(property); // Decode the URL encoded property value
                console.log("Decoded Property:", property);  // Logs the decoded property value
            }
            
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
            const geometryMapById = {
                // DB8
                '2e85182d-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg',
                
                // HG62
                '766fb31a-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj04NQ',
                
                // SOL10
                'f8c64108-adb7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmdzMFBSQjNlUlVTNkFOTEswOXZEWUE/dmVyc2lvbj0xOQ'
            };

            // Mapping of property value to geometry URN values
            const geometryMapByProperty = {
                // DB8
                'Drengsrudbekken 8 AS': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg',

                // HG62
                'Helgesensgate 62': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj04NQ',

                // SOL10
                'Solbråveien 10 AS': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmdzMFBSQjNlUlVTNkFOTEswOXZEWUE/dmVyc2lvbj0xOQ'
            };

            // Default geometry if no match is found
            const defaultGeometry = 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg';

            // Attempt to find geometry based on recordId
            let geometry = geometryMapById[recordId];

            // If no match was found for recordId, check for a match by property value
            if (!geometry && property) {
                geometry = geometryMapByProperty[property];
                localStorage.setItem('HardAssetChecker', 'Hard Asset');
                localStorage.setItem('ASSET', uniqueID);
            }

            // If still no match, fall back to the default geometry
            if (!geometry) {
                geometry = defaultGeometry;
                localStorage.setItem('HardAssetChecker', 'No Hard Asset');
            }



            // Initialize the tree and handle model loading
            initTree('#tree', (id) => {
                // If no ID is provided, use the sample URN
                console.log(id);
                const urn = id !== 0 ? window.btoa(id).replace(/=/g, '') : geometry;
                loadModel(viewer, urn);
            });

        } else {
            login.style.visibility = 'hidden'; //test
            throw new Error('Failed to authenticate');
        }

        console.log(resp);
        login.style.visibility = 'hidden'; //test
        // login.style.visibility = 'visible';
    } catch (err) {
        alert('Could not initialize the application. See console for more details.');
        console.error(err);
    }
}

// Initialize the app
initApp();