window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

PLANET.debug.Debug = function() {
    var options = {
        reset: function () {
            params.PlanetWireframe = false;
            params.PlanetFlatShading = true;
            params.PlanetRotation = true;
            params.PlanetRotationY = 0;
            this.smoothTerrain();
            this.earthColor();
            params.WaterLevel = params.PlanetRadius;
            params.WaterColor = 0x4682B4;
            params.WaterOpacity = 0.9;
            this.roughOcean();
        },
        generate: function() {
            simplex = new SimplexNoise();
            update();
        },
        smoothTerrain: function() {
            params.PlanetRadius = 100;
            params.PlanetDetail = 7;
            params.TerrainDisplacement = 0.1;
            params.TerrainDensity = 0.1;
            params.TerrainDetail = 9;
            update();
        },
        sharpTerrain: function() {
            params.TerrainDensity = 0.03;
            params.TerrainDetail = 9;
            params.PlanetRadius = 100;
            params.PlanetDetail = 7;
            params.TerrainDisplacement = 0.25;
            update();
        },
        earthColor: function() {
            params.SnowColor = 0xFFFAFA;
            params.TerrainColor = 0x6B8E23;
            params.BeachColor = 0xF4A460;
            params.CoralColor = 0x4682B4;
            update();
        },
        greyScale: function() {
            params.SnowColor = 0xFFFFFF;
            params.TerrainColor = 0xF2F2F2;
            params.BeachColor = 0xCCCCCC;
            params.CoralColor = 0x808080;
            update();
        },
        smoothOcean: function() {
            params.WaveSpeed = 0.25;
            params.WaveLength = 5;
            params.WaveHeight = 0.025;
        },
        roughOcean: function() {
            params.WaveSpeed = 0.25;
            params.WaveLength = 1;
            params.WaveHeight = 0.05;
        }
    };

    var update = function() {
        PLANET.planet.update();
        // updateCamera(params.PlanetRadius);
    };

    var updateCamera = function() {
        PLANET.controls.minDistance = params.PlanetRadius * (1 + params.TerrainDisplacement);
        PLANET.controls.maxDistance = params.PlanetRadius * params.CameraMax;
        camera.position.set(0, 0, params.PlanetRadius * params.CameraMax);
        PLANET.controls.update();
        PLANET.controls.saveState();
    };

    gui = new dat.GUI();
    var planetControls = gui.addFolder('Planet');
    // planetControls.add(params, 'PlanetRotationY', 0, 0.05).listen();
    // planetControls.add(params, 'PlanetFlatShading').onChange(update).listen();
    // planetControls.add(params, 'PlanetWireframe').onChange(update).listen();
    planetControls.open();
    var terrainControls = planetControls.addFolder('Terrain');
    terrainControls.add(params, 'TerrainDensity', 0, 1).onChange(update).listen();
    terrainControls.add(params, 'TerrainDisplacement', 0, 0.5).onChange(update).listen();
    terrainControls.add(params, 'TerrainDetail', 1, 10).step(1).onChange(update).listen();
    terrainControls.addColor(params, 'TerrainColor').onChange(update).listen();
    terrainControls.add(params, 'SnowLevel', 0, 1).step(0.1).onChange(update).listen();
    terrainControls.addColor(params, 'SnowColor').onChange(update).listen();
    terrainControls.add(params, 'BeachLevel', 0, 0.1).step(0.01).onChange(update).listen();
    terrainControls.addColor(params, 'BeachColor').onChange(update).listen();
    terrainControls.addColor(params, 'CoralColor').onChange(update).listen();
    terrainControls.add(options, 'generate');
    terrainControls.add(options, 'smoothTerrain');
    terrainControls.add(options, 'sharpTerrain');
    terrainControls.add(options, 'earthColor');
    terrainControls.add(options, 'greyScale');
    terrainControls.open();
    var oceanControls = planetControls.addFolder('Ocean');
    oceanControls.add(params, 'WaterLevel', params.PlanetRadius - params.TerrainDisplacement * params.PlanetRadius, params.PlanetRadius + params.TerrainDisplacement * params.PlanetRadius).listen();
    oceanControls.addColor(params, 'WaterColor').onChange(update).listen();
    oceanControls.add(params, 'WaterOpacity', 0, 1).step(0.1).onChange(update).listen();
    oceanControls.add(params, 'WaveSpeed', 0, 1).listen();
    oceanControls.add(params, 'WaveLength', 1, 5).listen();
    oceanControls.add(params, 'WaveHeight', 0, 0.3).listen();
    oceanControls.add(options, 'smoothOcean');
    oceanControls.add(options, 'roughOcean');
    oceanControls.open();

    var cameraControls = gui.addFolder('Camera');
    cameraControls.add(camera.position, 'x').listen();
    cameraControls.add(camera.position, 'y').listen();
    cameraControls.add(camera.position, 'z').listen();
    cameraControls.add(PLANET.controls, 'movSpeed', 0, 100).name('Moving Speed').listen();
    cameraControls.add(PLANET.controls, 'rotSpeed', 0, 10).name('Rotating Speed').listen();
    cameraControls.add(PLANET.controls, 'minDistance', 0, 200).name('Minimum Distance').listen();
    cameraControls.add(PLANET.controls, 'maxDistance', 200, 1000).name('Maximum Distance').listen();
    cameraControls.open();
    gui.add(options, 'reset');
};
