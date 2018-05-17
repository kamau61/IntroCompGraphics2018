window.PLANET = window.PLANET || {};
PLANET.controls = PLANET.controls || {};

PLANET.controls.Controls = function() {

    //init camera
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 5000);
    camera.position.set(0, 0, params.PlanetRadius * params.CameraMax);
    // cameraPos = camera.clone();
    // startRotation = camera.rotation.clone();

    // PLANET.controls.addResizeListener();

    //mouse controls
    controls = new PLANET.OrbitControls(camera, renderer.domElement);
    scene.add(camera);
    // PLANET.controls = new flyControls(camera);
//    PLANET.controls.object.set(0, 0, params.PlanetRadius * params.CameraMax);
//     scene.add(PLANET.controls.object);
//     controls.minDistance = params.PlanetRadius * (1 + params.TerrainDisplacement);
//     controls.maxDistance = params.PlanetRadius * params.CameraMax;

    //for stopping animations during user control
    // inControl = false;
    // var addMouseEventListener = function() {
    //     canvas.addEventListener('mousedown', function(ev) {
    //         inControl = true;
    //         if(ev.button === 2) {
    //             controls.reset();
    //         }
    //     });
    //
    //     canvas.addEventListener('mouseup', function() {
    //         inControl = false;
    //     });
    // };
    //
    // addMouseEventListener();
};

PLANET.controls.addResizeListener = function() {
    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
};
