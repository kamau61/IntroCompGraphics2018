window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

var options = {
    reset: function () {
        params.PlanetRadius = 100;
        params.PlanetDetail = 5;
        PLANET.debug.updatePlanetGeometry(params.PlanetRadius, params.PlanetDetail);
        params.PlanetRotation = true;
        params.PlanetRotationY = 0.001;
        params.PlanetWireframe = false;
        params.PlanetFlatShading = true;
        PLANET.debug.updatePlanetMaterial(params.PlanetWireframe, params.PlanetFlatShading);
        controls.reset();
    }
};

PLANET.debug.Debug = function() {
    gui = new dat.GUI();
    var planetControls = gui.addFolder('Planet');
    planetControls.add(params, 'PlanetRadius', 1, 200).step(10).onChange(function() {
        PLANET.debug.updatePlanetGeometry(params.PlanetRadius, params.PlanetDetail);
    }).listen();
    planetControls.add(params, 'PlanetDetail', 0, 5).step(1).onChange(function() {
        PLANET.debug.updatePlanetGeometry(params.PlanetRadius, params.PlanetDetail);
    }).listen();
    planetControls.add(params, 'PlanetRotation').listen();
    planetControls.add(params, 'PlanetRotationY', 0, 0.05).step(0.001).listen();
    planetControls.add(params, 'PlanetFlatShading').onChange(function() {
        PLANET.debug.updatePlanetMaterial(params.PlanetWireframe, params.PlanetFlatShading);
    }).listen();
    planetControls.add(params, 'PlanetWireframe').onChange(function() {
        PLANET.debug.updatePlanetMaterial(params.PlanetWireframe, params.PlanetFlatShading);
    }).listen();
    planetControls.open();
    gui.add(options, 'reset');
};

PLANET.debug.updatePlanetGeometry = function(radius, detail) {
    planet.terrain.geometry = new THREE.IcosahedronGeometry(radius, detail);
    planet.updateMatrix();
    PLANET.debug.updateCamera(radius);
};

PLANET.debug.updatePlanetMaterial = function(wireframe, flatShafing) {
    planet.terrain.material = new THREE.MeshPhongMaterial({
        wireframe: wireframe,
        flatShading: flatShafing
    });
};

PLANET.debug.updateCamera = function(distance) {
    controls.minDistance = distance * params.CameraMin;
    controls.maxDistance = distance * params.CameraMax;
    camera.position.set(0, 0, distance * params.CameraDefault);
    controls.update();
    controls.saveState();
};