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
                    'Autodesk.DocumentBrowser',
                    'Autodesk.AEC.LevelsExtension',
                    'Autodesk.DataVisualization',
                    'HistogramExtension',
                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('dark-theme');



            const canvas = viewer.impl.canvas;

            // canvas.addEventListener('dblclick', function (event) {
            //     event.preventDefault(); // Prevents default zoom on double-click

            //     const selectedItems = viewer.getSelection();
            //     if (selectedItems.length > 0) {
            //         const dbid = selectedItems[0];
            //         console.log(dbid);
            //         let globalid = localStorage.getItem('uniqueID');
            //         var hardassetURL = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalid;
            //         console.log(hardassetURL);

            //         // Open the URL in a new tab
            //         window.open(hardassetURL, '_blank');
            //     }
            // });


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
            



            // // Add click event listener to show the dbid of the selected object
            // viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
            //     const selectedItems = viewer.getSelection();
            //     if (selectedItems.length > 0) {
            //         const dbid = selectedItems[0];
            //         console.log(dbid);

            //         const dbIdArray = event.dbIdArray; // Get the selected object IDs

            //         const dbId = dbIdArray[0]; // Assume the first selected object

            //         const instanceTree = viewer.model.getInstanceTree();

            //         instanceTree.enumNodeFragments(dbId, (fragId) => {
            //             const fragList = viewer.model.getFragmentList();
            //             const matrix = new THREE.Matrix4();
            //             fragList.getWorldMatrix(fragId, matrix);

            //             const position = new THREE.Vector3();
            //             position.setFromMatrixPosition(matrix);

            //             console.log(`World Coordinates: x=${position.x}, y=${position.y}, z=${position.z}`);
            //         });
            //         // // Get the screen coordinates from the mouse click
            //         // const screenPoint = new THREE.Vector2(event.canvasX, event.canvasY);
                        
            //         // // Convert screen coordinates to world coordinates
            //         // const worldPoint = viewer.clientToWorld(screenPoint);

            //         // console.log('World Coordinates:', worldPoint);


            //     }
            // });  



            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
                if (viewer.model) {

                    viewer.loadExtension('Autodesk.AEC.LevelsExtension').then(function(levelsExt) {
                        levelsExt.floorSelector.addEventListener(Autodesk.AEC.FloorSelector.SELECTED_FLOOR_CHANGED, function(event) {
                            // const selectedFloorName = event.floor.name;
                            // console.log(event);
                            const selectedLevelIndex = event.levelIndex; // Get the level index from the event
                            console.log(`Selected Floor: ${selectedLevelIndex}`);
        
        
                            // Check if the loaded model is named "DB8"
                            const modelName = viewer.model.getDocumentNode().data.name;
                            console.log(modelName);
                            if (modelName === 'DB8-SEMY-ARST-ASBUILT' && selectedLevelIndex !== undefined) {
                                HEATMAP(viewer, selectedLevelIndex); // Call HEATMAP only if the model name is DB8
                                SPRITES(viewer, selectedLevelIndex); // SPRITES will be called
                            }
                            
                        });
        
                        // Optionally, you can set a default floor after loading the extension
                        // levelsExt.floorSelector.selectFloor(0, true); // Replace 0 with the default floor index if needed
                    });

                    let HardAsset = localStorage.getItem('HardAssetChecker');

                    console.log('HardAssetChecker')

                    if(HardAsset === 'Hard Asset'){

                        let assetValue = localStorage.getItem('ASSET');

                        console.log('SEARCHED:' + assetValue)

                        // Assuming `viewer.search` and other viewer methods are correctly defined
                        viewer.search(
                            assetValue,  // Pass the asset value from localStorage as the search query
                            function(dbIDs) {
                                viewer.isolate(dbIDs);  // Isolate the results based on dbIDs
                                viewer.fitToView(dbIDs);  // Fit the view to the results
                                viewer.select(dbIDs);  // Highlight
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
            });

            
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    function onDocumentLoadSuccess(doc) {
        // Load the model geometry
        viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())
            .then(() => {
                // Once the geometry is loaded, call surface shading setup
                viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
                    if (viewer.model) {
                    }
                });
            })
            .catch((error) => {
                console.error("Error loading geometry:", error);
            });
    }
    

    function onDocumentLoadFailure(code, message) {
        alert('Could not load model. See console for more details.');
        console.error(message);
    }

    // const sampleURN = 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg';

    // Autodesk.Viewing.Document.load('urn:' + sampleURN, onDocumentLoadSuccess, onDocumentLoadFailure);

    // urn:adsk.wipemea:dm.lineage:xdXReqV0T1azoWueEiSnzg

    console.log(urn);
    Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
}















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










