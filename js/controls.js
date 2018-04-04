window.PLANET = window.PLANET || {};
PLANET.controls = PLANET.controls || {};


PLANET.controls.Controls = function() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //for stopping animations during user control
    inControl = false;
    PLANET.controls.addMouseEventListener();

    PLANET.controls.addResizeListener();
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
    window.addEventListener('mousedown', function(ev) {
        inControl = true;
        if(ev.button === 2) {
            controls.reset();
        }
    });

    window.addEventListener('mouseup', function() {
        inControl = false;
    });
};