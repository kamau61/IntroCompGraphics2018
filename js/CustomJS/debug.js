window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

PLANET.debug.Debug = function () {
    let options = {
        reset: function () {
            this.smoothTerrain();
            this.roughOcean();
            this.defaultColors();
            this.defaultLevels();
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
        defaultLevels: function () {
            PLANET.climate.set(25.5);
        },
        defaultColors: function () {
            colors.TrunkColor = 0x393226;
            colors.LeafColor = 0x5d7650;
            colors.ForestColor = 0x7e874e;
            colors.GrassColor = 0x8d9c61;
            colors.SoilColor = 0xabb6a0;
            colors.SandColor = 0xf2eadf;
            colors.SnowColor = 0xb6f5ff;
            colors.WaterColor = 0x49e8ff;
            colors.SeabedColor = 0x15454c;
            params.WaterOpacity = 90;
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
        .onChange(function(){
            planet.climate.set(params.Temperature);
        })
        .step(0.1).listen();
    planetControls.open();
    let terrainControls = planetControls.addFolder('Terrain');
    //TODO onChange -> generate terrain
    terrainControls.add(params, 'TerrainDensity', 0, 1).onChange(update).listen();
    terrainControls.add(params, 'TerrainDisplacement', 0, 50).onChange(update).listen();
    terrainControls.add(params, 'TerrainDetail', 1, 10).step(1).onChange(update).listen();
    terrainControls.add(options, 'generate');
    terrainControls.add(options, 'smoothTerrain');
    terrainControls.add(options, 'sharpTerrain');
    let oceanControls = planetControls.addFolder('Ocean');
    oceanControls.add(params, 'WaterOpacity', 0, 100).onChange(update).listen();
    oceanControls.add(params, 'WaveSpeed', 0, 1).listen();
    oceanControls.add(params, 'WaveLength', 1, 5).listen();
    oceanControls.add(params, 'WaveHeight', 0, 0.3).listen();
    oceanControls.add(options, 'smoothOcean');
    oceanControls.add(options, 'roughOcean');
    let forestControls = planetControls.addFolder('Forest');
    //TODO onChange -> generate forest
    forestControls.add(params, 'TreeSpread', -1, 1).onChange().listen();
    forestControls.add(params, 'GrassSpread', -1, 1).onChange().listen();
    forestControls.add(params, 'ForestDensity', -1, 1).onChange().listen();
    let levelControls = planetControls.addFolder('Levels');
    levelControls.add(params, 'SnowLevel', 0, 100).onChange(update).listen();
    levelControls.add(params, 'SandLevel', 0, 100).onChange(update).listen();
    levelControls.add(params, 'SeaLevel', 0, 100).onChange(update).listen();
    levelControls.add(options, 'defaultLevels');
    levelControls.open();
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
    colorControls.add(options, 'defaultColors');
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
