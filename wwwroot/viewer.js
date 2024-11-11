// async function getAccessToken(callback) {
//     try {
//         const resp = await fetch('/api/auth/token');
//         if (!resp.ok)
//             throw new Error(await resp.text());
//         const { access_token, expires_in } = await resp.json();
//         callback(access_token, expires_in);
//     } catch (err) {
//         alert('Could not obtain access token. See the console for more details.');
//         console.error(err);        
//     }
// }

// export function initViewer(container) {
//     return new Promise(function (resolve, reject) {
//             Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
//             const config = {
//                 extensions: ['Autodesk.DocumentBrowser']
//             };
//             const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
//             viewer.start();
//             viewer.setTheme('light-theme');
//             resolve(viewer);
//         });
//     });
// }

// export function loadModel(viewer, urn) {
//     function onDocumentLoadSuccess(doc) {
//         viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry());
//     }
//     function onDocumentLoadFailure(code, message) {
//         alert('Could not load model. See console for more details.');
//         console.error(message);
//     }
//     Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
// }




//commonjs
const Autodesk = require('forge-viewer');  // Adjust this based on your environment

async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok)
            throw new Error(await resp.text());
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);        
    }
}

// Convert export to CommonJS
module.exports.initViewer = function(container) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
            const config = {
                extensions: ['Autodesk.DocumentBrowser']
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
};

module.exports.loadModel = function(viewer, urn) {
    function onDocumentLoadSuccess(doc) {
        viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry());
    }
    function onDocumentLoadFailure(code, message) {
        alert('Could not load model. See console for more details.');
        console.error(message);
    }
    Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
};
