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
<<<<<<< HEAD
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    PLANET.controls = new flyControls(camera);
    PLANET.controls.minDistance = params.PlanetRadius * (1 + params.TerrainDisplacement);
    PLANET.controls.maxDistance = params.PlanetRadius * params.CameraMax;

    //for stopping animations during user control
    inControl = false;
    var addMouseEventListener = function() {
        canvas.addEventListener('mousedown', function(ev) {
            inControl = true;
            if(ev.button === 2) {
                controls.reset();
            }
        });

        canvas.addEventListener('mouseup', function() {
            inControl = false;
        });
    };

    addMouseEventListener();
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
=======
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.minDistance = params.PlanetRadius * (1 + params.TerrainDisplacement);
    // controls.maxDistance = params.PlanetRadius * params.CameraMax;

    controls = new PLANET.OrbitControls(camera);
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.keys = [ 65, 83, 68 ];

//     controls.rotateSpeed = 1.0;
//     controls.zoomSpeed = 1.0;
//     controls.panSpeed = 1.0;
//        trackballControls.noZoom=false;
//    controls.noPan=false;
//     controls.staticMoving = true;
//        trackballControls.dynamicDampingFactor=0.3;

    // controls.panningMode = THREE.HorizontalPanning;
    // controls = new THREE.FirstPersonControls(camera);
    // controls.lookSpeed = 0.4;
    // controls.movementSpeed = 20;
    // controls.noFly = true;
    // controls.lookVertical = true;
    // controls.constrainVertical = true;
    // controls.verticalMin = 1.0;
    // controls.verticalMax = 2.0;
    // controls.lon = -150;
    // controls.lat = 120;


    //for stopping animations during user control
    inControl = false;
    // PLANET.controls.addMouseEventListener();
};
>>>>>>> b2a56284eec4cb23c3889f0af910446b1e52979f
