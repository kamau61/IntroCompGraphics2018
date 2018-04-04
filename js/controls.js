window.PLANET = window.PLANET || {};
PLANET.controls = PLANET.controls || {};

var options = {
    reset: function () {
        params.CubeRotation = CUBE_ROTATION.DEFAULT;
        params.SphereRotation = SPHERE_ROTATION.DEFAULT;
        params.SphereDirection = SPHERE_ROTATION.DIRECTION;
        controls.reset();
    }
}


PLANET.controls.Controls = function() {
    PLANET.controls.addResizeListener();

    //mouse controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //for stopping animations during user control
    inControl = false;
    PLANET.controls.addMouseEventListener();

    //gui controls
    gui = new dat.GUI();
    var cubeControls = gui.addFolder('Cube');
    cubeControls.add(params, 'CubeRotation', CUBE_ROTATION.MIN, CUBE_ROTATION.MAX).step(CUBE_ROTATION.STEP).listen();
    var sphereControls = gui.addFolder('Sphere');
    sphereControls.add(params, 'SphereRotation', SPHERE_ROTATION.MIN, SPHERE_ROTATION.MAX).step(SPHERE_ROTATION.STEP).listen();
    sphereControls.add(params, 'SphereDirection').listen();
    gui.add(options, 'reset');
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

PLANET.controls.addMouseEventListener = function() {
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