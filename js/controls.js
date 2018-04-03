window.PLANET = window.PLANET || {};
PLANET.controls = PLANET.controls || {};

PLANET.controls.Controls = function() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //for stopping animations during user control
    this.inControl = false;
    window.addEventListener('mousedown', function(ev) {
        this.inControl = true;
    });
    window.addEventListener('mouseup', function(ev) {
        this.inControl = false;
    });
    window.addEventListener('resize', function(ev) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });
};