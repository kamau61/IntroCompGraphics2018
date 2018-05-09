window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

PLANET.debug.Debug = function () {
    var options = {
        reset: function () {
            params.PlanetWireframe = false;
            params.PlanetFlatShading = true;
            params.PlanetRotation = true;
            params.PlanetRotationY = 0;
            this.smoothTerrain();
            params.WaterLevel = params.PlanetRadius;
            this.roughOcean();
            update();
        },
        generate: function () {
            simplex = new SimplexNoise();
            update();
        },
        smoothTerrain: function () {
            params.PlanetRadius = 100;
            params.TerrainDisplacement = 0.1;
            params.TerrainDensity = 0.1;
            update();
        },
        sharpTerrain: function () {
            params.TerrainDensity = 0.03;
            params.PlanetRadius = 100;
            params.TerrainDisplacement = 0.25;
            update();
        },
        smoothOcean: function () {
            params.WaveSpeed = 0.25;
            params.WaveLength = 5;
            params.WaveHeight = 0.025;
        },
        roughOcean: function () {
            params.WaveSpeed = 0.25;
            params.WaveLength = 1;
            params.WaveHeight = 0.05;
        }
    };

    var update = function () {
        PLANET.planet.update();
        updateCamera(params.PlanetRadius);
    };

    var updateCamera = function () {
        controls.minDistance = params.PlanetRadius * (1 + params.TerrainDisplacement);
        controls.maxDistance = params.PlanetRadius * params.CameraMax;
        camera.position.set(0, 0, params.PlanetRadius * params.CameraMax);
        controls.update();
        controls.saveState();
    };

    gui = new dat.GUI();
    var cameraControls = gui.addFolder('Camera');
    //the final planet wouldn't be rotating
    cameraControls.add(params, 'AutoRotate').listen();
    cameraControls.add(params, 'AutoRotateSpeed', 0.5, 5).step(0.5).listen();
    cameraControls.add(params, 'ZoomSpeed', 0.5, 5).step(0.5).listen();
    cameraControls.add(params, 'RotateSpeed', 1, 10).step(1).listen();
    cameraControls.add(params, 'PanSpeed', 5, 20).step(1).listen();
    cameraControls.open();
    var planetControls = gui.addFolder('Planet');
    // planetControls.add(params, 'PlanetRotationY', 0, 0.05).listen();
    // planetControls.add(params, 'PlanetFlatShading').onChange(update).listen();
    // planetControls.add(params, 'PlanetWireframe').onChange(update).listen();
    planetControls.open();
    var terrainControls = planetControls.addFolder('Terrain');
    terrainControls.add(params, 'TerrainDensity', 0, 1).onChange(update).listen();
    terrainControls.add(params, 'TerrainDisplacement', 0, 0.5).onChange(update).listen();
    terrainControls.add(params, 'TerrainDetail', 1, 10).step(1).onChange(update).listen();
    terrainControls.add(params, 'SnowLevel', 0, 1).step(0.1).onChange(update).listen();
    terrainControls.add(params, 'BeachLevel', 0, 0.1).step(0.01).onChange(update).listen();
    terrainControls.add(options, 'generate');
    terrainControls.add(options, 'smoothTerrain');
    terrainControls.add(options, 'sharpTerrain');
    terrainControls.open();
    var oceanControls = planetControls.addFolder('Ocean');
    oceanControls.add(params, 'WaterLevel', params.PlanetRadius - params.TerrainDisplacement * params.PlanetRadius,
        params.PlanetRadius + params.TerrainDisplacement * params.PlanetRadius).listen();
    oceanControls.add(params, 'WaveSpeed', 0, 1).listen();
    oceanControls.add(params, 'WaveLength', 1, 5).listen();
    oceanControls.add(params, 'WaveHeight', 0, 0.3).listen();
    oceanControls.add(options, 'smoothOcean');
    oceanControls.add(options, 'roughOcean');
    oceanControls.open();

    gui.add(options, 'reset');
};