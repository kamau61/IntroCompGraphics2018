window.PLANET = window.PLANET || {};
PLANET.controls = PLANET.controls || {};

PLANET.controls.Controls = function() {

    //init camera
    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
    camera.position.set(0, 0, params.PlanetRadius * params.CameraMax);
    controls = new PLANET.flyControls.FlyControls(camera);
    scene.add(controls.object);

};

