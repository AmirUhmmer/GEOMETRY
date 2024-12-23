//push test
import { HEATMAP } from './DB8SurfaceShading.mjs';
import { SPRITES } from './DB8Sprites.mjs';
// import './extensions/LoggerExtension.mjs';
import './extensions/HistogramExtension.mjs';



async function getAccessToken(callback) {
    try {
        // const resp = await fetch('/api/auth/token');

        const access_token = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const expires_in = localStorage.getItem('expires_at');
        const internal_token = localStorage.getItem('internal_token');


        // if (!resp.ok)
        //     throw new Error(await resp.text());
        // const { access_token, expires_in } = await resp.json();
        
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);        
    }
}

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, async function () {
            const config = {
                extensions: [
                    // 'Autodesk.DocumentBrowser',
                    // 'Autodesk.AEC.LevelsExtension',
                    // 'Autodesk.DataVisualization',
                    // 'HistogramExtension',
                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('dark-theme');



            const canvas = viewer.impl.canvas;

            canvas.addEventListener('dblclick', function (event) {
                event.preventDefault(); // Prevents default zoom on double-click
            
                const selectedItems = viewer.getSelection();
                if (selectedItems.length > 0) {
                    const dbid = selectedItems[0];
                    console.log("Selected DBID:", dbid);
            
                    // Retrieve properties using the DBID
                    viewer.getProperties(dbid, function(props) {
                        // Find the GlobalID property
                        let globalID = null;
                        props.properties.forEach(function(prop) {
                            if (prop.displayName === "Asset ID") {
                                globalID = prop.displayValue;
                            }
                        });
            
                        if (globalID) {
                            // Construct the URL using the GlobalID retrieved from the properties
                            var newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;
                            console.log("New URL:", newUrl);
            
                            // Open the URL in a new tab
                            window.open(newUrl, '_blank');
                        } else {
                            console.log("GlobalID not found.");
                        }
                    });
                }
            });
            



        

            
            resolve(viewer);
        });
    });
}

// export function loadModel(viewer, urn) {
//     function onDocumentLoadSuccess(doc) {
//         // Load the model geometry
//         viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())
//             .then(() => {
//                 // Once the geometry is loaded, call surface shading setup
//                 viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
//                     if (viewer.model) {
//                     }
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error loading geometry:", error);
//             });
//     }
    

//     function onDocumentLoadFailure(code, message) {
//         alert('Could not load model. See console for more details.');
//         console.error(message);
//     }

//     console.log(urn);
//     Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
// }


// DB8

// {3D - dsa3J29U}
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMg
// SMY-DB8-xxx-SIT-R24
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00
// SMY-DB8-xxx-SIT-R24
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg


// HG62
// MEP
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnZGZ01YNjRUVDBDcWU4THhZa2RvVUE/dmVyc2lvbj0xNw
// ARCHI
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj05OQ


// SOL10
// MEP
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnE4ZzFMRTB2UTJXTzVBSEo5S2Q1NUE/dmVyc2lvbj04
// ARCHI
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmdzMFBSQjNlUlVTNkFOTEswOXZEWUE/dmVyc2lvbj0xOQ



export function loadModel(viewer, urns) {
    const loadOptions = {
        globalOffset: { x: 0, y: 0, z: 0 },  // force all models to origin
        placementTransform: (new THREE.Matrix4()).setPosition({ x: 0, y: 0, z: 0 })  // Force placement to origin
    };

    // Track the number of models to load and the count of successfully loaded models
    let modelsToLoad = urns.length ? urns : [
        { name: '3D - dsa3J29U', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw' },
        { name: 'SMY-DB8-SITE', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00' },
        { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg' }
    ];

    let modelsLoaded = 0; // Keep track of how many models have loaded

    function checkAllModelsLoaded() {
        if (modelsLoaded === modelsToLoad.length) {
            console.log("All models have been loaded.");
            // Perform actions only when all models are loaded
            if (viewer.model) {
                viewer.loadExtension('Autodesk.DataVisualization').then(() => {
                    console.log('Autodesk.DataVisualization loaded.');
                });
    
                viewer.loadExtension('HistogramExtension').then(() => {
                    console.log('HistogramExtension loaded.');
                });

                viewer.loadExtension('Autodesk.DocumentBrowser').then(() => {
                    console.log('Autodesk.DocumentBrowser loaded.');
                });
    
                viewer.loadExtension('Autodesk.AEC.LevelsExtension').then((levelsExt) => {
                    console.log('Autodesk.AEC.LevelsExtension loaded.');
                });
                
                console.log("Geometry loaded.");
                // Call surface shading setup or any other actions here
                viewer.loadExtension('Autodesk.AEC.LevelsExtension').then(function(levelsExt) {
                    levelsExt.floorSelector.addEventListener(Autodesk.AEC.FloorSelector.SELECTED_FLOOR_CHANGED, function(event) {
                        // const selectedFloorName = event.floor.name;
                        // console.log(event);
                        const selectedLevelIndex = event.levelIndex; // Get the level index from the event
                        console.log(`Selected Floor: ${selectedLevelIndex}`);
    
    
                        // Check if the loaded model is named "DB8"
                        // const modelName = viewer.model.getDocumentNode().data.name;
                        // console.log(modelName);
                        // if (modelName === 'DB8-SEMY-ARST-ASBUILT' && selectedLevelIndex !== undefined) {
                        //     HEATMAP(viewer, selectedLevelIndex); // Call HEATMAP only if the model name is DB8
                        //     SPRITES(viewer, selectedLevelIndex); // SPRITES will be called
                        // }



                        // Check if the loaded model is named "DB8"
                        // let LiveData = localStorage.getItem('LiveData');
                        // console.log(LiveData);
                        // if (LiveData === 'DB8' && selectedLevelIndex !== undefined) {
                        //     HEATMAP(viewer, selectedLevelIndex); // Call HEATMAP only if the model name is DB8
                        //     SPRITES(viewer, selectedLevelIndex); // SPRITES will be called
                        // }
                    });
    
                    // Optionally, you can set a default floor after loading the extension
                    // levelsExt.floorSelector.selectFloor(0, true); // Replace 0 with the default floor index if needed
                });

                let HardAsset = localStorage.getItem('HardAssetChecker');

                console.log(HardAsset);

                // Assuming this is part of your search function when Hard Asset is selected
                if(HardAsset === 'Hard Asset'){

                    let assetValue = localStorage.getItem('ASSET');
                    console.log('SEARCHED:' + assetValue)

                    // First, get the models from the viewer
                    const models = viewer.impl.modelQueue().getModels();

                    // Assuming `viewer.search` searches within the loaded models
                    viewer.search(
                        assetValue,  // Pass the asset value from localStorage as the search query
                        function(dbIDs) {
                            // First, hide all objects in all loaded models
                            models.forEach(model => {
                                viewer.isolate([], model);  // Isolate with an empty array hides all objects in each model
                            });

                            // Now, isolate and fit only the found objects from the search across all models
                            models.forEach(model => {
                                viewer.isolate(dbIDs, model);  // Isolate the found objects in each model
                            });

                            // Fit to view and highlight the found object
                            viewer.fitToView(dbIDs);
                            viewer.select(dbIDs);  // Highlight the objects
                        }
                    );
                }



                // ENABLE IF WANT TO SEARCH OBJECT IN MODEL


                // const overlay = document.getElementById('overlay');

                // overlay.style.visibility = 'visible';


                // document.getElementById("search").addEventListener("click", function first() {
                //     viewer.search(
                //       document.getElementById("filter").value,
                //       function (dbIDs) {
                //         viewer.isolate(dbIDs);
                //         viewer.fitToView(dbIDs);
                //     });
                // });
            }
        }
    }

    // Success handler for loading individual models
    function onDocumentLoadSuccess(doc) {
        let viewables = doc.getRoot().getDefaultGeometry();
        viewer.loadDocumentNode(doc, viewables, loadOptions)
            .then(() => {
                modelsLoaded++;
                checkAllModelsLoaded();  // Check if all models are loaded
            })
            .catch((error) => {
                console.error("Could not load model.", error);
                alert("Error loading model. See console for details.");
            });
    }

    // Failure handler for model loading
    function onDocumentLoadFailure(code, message) {
        console.error("Failed to load model:", message);
        alert("Could not load model. See console for details.");
    }

    // Load each model
    modelsToLoad.forEach((model) => {
        console.log(`Loading model: ${model.name || "Unnamed"} with URN: ${model.urn}`);
        Autodesk.Viewing.Document.load('urn:' + model, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}





// export function loadModel(viewer, urns) {
//     function onDocumentLoadSuccess(doc) {
//         // Load the model geometry
//         let viewables = doc.getRoot().getDefaultGeometry();

//         // Load the model and apply the placement transform
//         return viewer.loadDocumentNode(doc, viewables, {
//             globalOffset: { x: 0, y: 0, z: 0 },  // force all models to origin
//             placementTransform: (new THREE.Matrix4()).setPosition({ x: 0, y: 0, z: 0 })  // Force placement to origin
//         });
//     }

//     function onDocumentLoadFailure(code, message) {
//         console.error('Could not load model. See console for more details.', message);
//         alert('Could not load model. See console for more details.');
//     }

//     function loadModelSequentially(viewer, urns) {
//         if (!urns || urns.length === 0) return;

//         const loadDocument = (urn) => {
//             return new Promise((resolve, reject) => {
//                 Autodesk.Viewing.Document.load('urn:' + urn, (doc) => {
//                     onDocumentLoadSuccess(doc)
//                         .then(() => {
//                             console.log(`Loaded model with URN: ${urn}`);
//                             resolve();
//                         })
//                         .catch((error) => {
//                             console.error(`Error loading model: ${urn}`, error);
//                             reject(error);
//                         });
//                 }, onDocumentLoadFailure);
//             });
//         };

//         // Sequentially load the models one after another
//         urns.reduce((promise, urn) => {
//             return promise.then(() => loadDocument(urn));
//         }, Promise.resolve())
//             .then(() => {
//                 console.log("All models loaded successfully.");
//             })
//             .catch((error) => {
//                 console.error("Error loading models:", error);
//             });
//     }

//     // If no URNs are provided, use sample URNs for testing
//     const sampleUrns = [
//         { name: '3D - dsa3J29U', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw' },
//         { name: 'SMY-DB8-SITE', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00' },
//         { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg' }
//     ];

//     const modelsToLoad = urns.length > 0 ? urns : sampleUrns.map(model => model.urn); // Use provided URNs or fallback to sample URNs
//     console.log(modelsToLoad);

//     // Load models sequentially
//     loadModelSequentially(viewer, modelsToLoad);
// }


// export function loadModel(viewer, urns = null) {
//     function onDocumentLoadSuccess(doc) {
//         // Load the model geometry
//         viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())
//             .then(() => {
//                 // Once the geometry is loaded, call surface shading setup
//                 viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
//                     if (viewer.model) {
//                     }
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error loading geometry:", error);
//             });
//     }
    

//     function onDocumentLoadFailure(code, message) {
//         alert('Could not load model. See console for more details.');
//         console.error(message);
//     }

//     // If no URNs are provided, use sample URNs for testing
//     const sampleUrns = [
//         { name: '3D - dsa3J29U', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw', xform: {x:50,y:0,z:100} },
//         { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00', xform: {x:50,y:0,z:-50} },
//         { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg', xform: {x:50,y:0,z:-50} }

//         // { name: 'HG62 MEP', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnZGZ01YNjRUVDBDcWU4THhZa2RvVUE/dmVyc2lvbj0xNw' },
//         // { name: 'HG62 ARCHI', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj05OQ' }
//     ];

//     const modelsToLoad = sampleUrns; // Use provided URNs or fallback to sample URNs

//     // Loop through each model and load them
//     modelsToLoad.forEach((model) => {
//         console.log(`Loading model: ${model.name || "Unnamed"} with URN: ${model.urn}`);
//         Autodesk.Viewing.Document.load('urn:' + model.urn, onDocumentLoadSuccess, onDocumentLoadFailure);
//     });
// }














//                                WORKING
//added levels filter
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
//         Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
//             const config = {
//                 extensions: ['Autodesk.DocumentBrowser', 'Autodesk.AEC.LevelsExtension'] // Load custom extension here
//             };
//             const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
//             viewer.start();
//             viewer.setTheme('dark-theme');
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


// ******************************* WORKING ************************










