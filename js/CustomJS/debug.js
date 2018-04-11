window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

var options = {
    reset: function () {
        params.TerrainDisplacement = 0.1;
        params.PlanetRotation = true;
        params.PlanetRotationY = 0.001;
        params.PlanetWireframe = false;
        params.PlanetFlatShading = true;
        PLANET.debug.updatePlanet();
        controls.reset();
    }
};

PLANET.debug.Debug = function() {
    gui = new dat.GUI();
    var planetControls = gui.addFolder('Planet');
    planetControls.add(params, 'PlanetRotation').listen();
    planetControls.add(params, 'PlanetRotationY', 0, 0.05).step(0.001).listen();
    planetControls.add(params, 'PlanetFlatShading').onChange(function() {
        PLANET.debug.updatePlanet();
    }).listen();
    planetControls.add(params, 'PlanetWireframe').onChange(function() {
        PLANET.debug.updatePlanet();
    }).listen();
    planetControls.add(params, 'TerrainDisplacement', 0, 0.2).step(0.01).onChange(function() {
        PLANET.debug.updatePlanet();
    }).listen();
    planetControls.open();
    gui.add(options, 'reset');
};

PLANET.debug.updatePlanet = function() {
    PLANET.planet.update();
    PLANET.debug.updateCamera(params.PlanetRadius);
};

PLANET.debug.updateCamera = function(distance) {
    controls.minDistance = distance * (1 + params.TerrainDisplacement);
    controls.maxDistance = distance * params.CameraMax;
    camera.position.set(0, 0, distance * params.CameraDefault);
    controls.update();
    controls.saveState();
};