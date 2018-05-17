window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

PLANET.debug.Debug = function () {
    let options = {
        reset: function () {
            params.PlanetWireframe = false;
            params.PlanetRotation = true;
            params.PlanetRotationY = 0;
            this.smoothTerrain();
            this.default();
            params.WaterLevel = params.PlanetRadius;
            params.WaterColor = 0x4682B4;
            params.WaterOpacity = 0.9;
            this.roughOcean();
        },
        generate: function () {
            simplex = new SimplexNoise();
            update();
        },
        smoothTerrain: function () {
            params.PlanetRadius = 100;
            params.PlanetDetail = 7;
            params.TerrainDisplacement = 0.1;
            params.TerrainDensity = 0.1;
            params.TerrainDetail = 9;
            update();
        },
        sharpTerrain: function () {
            params.TerrainDensity = 0.03;
            params.TerrainDetail = 9;
            params.PlanetRadius = 100;
            params.PlanetDetail = 7;
            params.TerrainDisplacement = 0.25;
            update();
        },
        default: function () {
            colors.TrunkColor = 0x393226;
            colors.LeafColor = 0x5d7650;
            colors.ForestColor = 0x7e874e;
            colors.GrassColor = 0x8d9c61;
            colors.SoilColor = 0xabb6a0;
            colors.SandColor = 0xf2eadf;
            colors.SnowColor = 0xb6f5ff;
            colors.WaterColor = 0x49e8ff;
            colors.SeabedColor = 0x15454c;
            update();
        },
        greyScale: function () {
            colors.TrunkColor = 0xb3b3b3;
            colors.LeafColor = 0xa6a6a6;
            colors.ForestColor = 0xb3b3b3;
            colors.GrassColor = 0xbfbfbf;
            colors.SoilColor = 0xd9d9d9;
            colors.SandColor = 0xe6e6e6;
            colors.SnowColor = 0xffffff;
            colors.WaterColor = 0xf2f2f2;
            colors.SeabedColor = 0x808080;
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

    let update = function () {
        planet.update();
        // PLANET.planet.update();
        // updateCamera(params.PlanetRadius);
    };

    // let updateCamera = function() {
    //     PLANET.controls.minDistance = params.PlanetRadius * (1 + params.TerrainDisplacement);
    //     PLANET.controls.maxDistance = params.PlanetRadius * params.CameraMax;
    //     camera.position.set(0, 0, params.PlanetRadius * params.CameraMax);
    //     PLANET.controls.update();
    //     PLANET.controls.saveState();
    // };

    gui = new dat.GUI();
    let planetControls = gui.addFolder('Planet');
    planetControls.add(params, 'Temperature')
        .min(CONSTANTS.FREEZE_POINT)
        .max(CONSTANTS.BOIL_POINT)
        .step(0.1)
        .onChange(function () {
            PLANET.temperature.set(params.Temperature);
        }).listen();
    // planetControls.add(params, 'PlanetRotationY', 0, 0.05).listen();
    // planetControls.add(params, 'PlanetWireframe').onChange(update).listen();
    planetControls.open();
    let terrainControls = planetControls.addFolder('Terrain');
    terrainControls.add(params, 'TerrainDensity', 0, 1).onChange(update).listen();
    terrainControls.add(params, 'TerrainDisplacement', 0, 0.5).onChange(update).listen();
    terrainControls.add(params, 'TerrainDetail', 1, 10).step(1).onChange(update).listen();
    terrainControls.add(params, 'SnowLevel', 0, 1).step(0.1).onChange(update).listen();
    terrainControls.add(params, 'SandLevel', 0, 0.1).step(0.01).onChange(update).listen();
    terrainControls.add(options, 'generate');
    terrainControls.add(options, 'smoothTerrain');
    terrainControls.add(options, 'sharpTerrain');
    let oceanControls = planetControls.addFolder('Ocean');
    oceanControls.add(params, 'WaterLevel', params.PlanetRadius - params.TerrainDisplacement * params.PlanetRadius, params.PlanetRadius + params.TerrainDisplacement * params.PlanetRadius).listen();
    oceanControls.add(params, 'WaterOpacity', 0, 1).step(0.1).onChange(update).listen();
    oceanControls.add(params, 'WaveSpeed', 0, 1).listen();
    oceanControls.add(params, 'WaveLength', 1, 5).listen();
    oceanControls.add(params, 'WaveHeight', 0, 0.3).listen();
    oceanControls.add(options, 'smoothOcean');
    oceanControls.add(options, 'roughOcean');
    let colorControls = planetControls.addFolder('Colors');
    colorControls.addColor(colors, 'TrunkColor').onChange(update).listen();
    colorControls.addColor(colors, 'LeafColor').onChange(update).listen();
    colorControls.addColor(colors, 'ForestColor').onChange(update).listen();
    colorControls.addColor(colors, 'GrassColor').onChange(update).listen();
    colorControls.addColor(colors, 'SoilColor').onChange(update).listen();
    colorControls.addColor(colors, 'SandColor').onChange(update).listen();
    colorControls.addColor(colors, 'SnowColor').onChange(update).listen();
    colorControls.addColor(colors, 'WaterColor').onChange(update).listen();
    colorControls.addColor(colors, 'SeabedColor').onChange(update).listen();
    colorControls.add(options, 'default');
    colorControls.add(options, 'greyScale');
    colorControls.open();


    let cameraControls = gui.addFolder('Camera');
    // cameraControls.add(camera.position, 'x').listen();
    // cameraControls.add(camera.position, 'y').listen();
    // cameraControls.add(camera.position, 'z').listen();
    // cameraControls.add(PLANET.controls, 'movSpeed', 0, 100).name('Moving Speed').listen();
    // cameraControls.add(PLANET.controls, 'rotSpeed', 0, 10).name('Rotating Speed').listen();
    // cameraControls.add(PLANET.controls, 'minDistance', 0, 200).name('Minimum Distance').listen();
    // cameraControls.add(PLANET.controls, 'maxDistance', 200, 1000).name('Maximum Distance').listen();
    cameraControls.open();
    gui.add(options, 'reset');
};
