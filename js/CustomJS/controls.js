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