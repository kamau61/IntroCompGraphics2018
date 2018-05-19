window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

PLANET.debug.Debug = function () {
    let options = {
        reset: function () {
            params.color = 0;
            updateColor();
            this.SmoothTerrain();
            this.RoughOcean();
            this.DefaultLevels();
        },
        generate: function () {
            simplex = new SimplexNoise();
            update();
        },
        SmoothTerrain: function () {
            params.PlanetRadius = 100;
            params.PlanetDetail = 7;
            params.TerrainDisplacement = 0.1;
            params.TerrainDensity = 0.1;
            params.TerrainDetail = 9;
            update();
        },
        SharpTerrain: function () {
            params.TerrainDensity = 0.03;
            params.TerrainDetail = 9;
            params.PlanetRadius = 100;
            params.PlanetDetail = 7;
            params.TerrainDisplacement = 0.25;
            update();
        },
        SmoothOcean: function () {
            params.WaveSpeed = 0.25;
            params.WaveLength = 5;
            params.WaveHeight = 0.025;
        },
        RoughOcean: function () {
            params.WaveSpeed = 0.25;
            params.WaveLength = 1;
            params.WaveHeight = 0.05;
        },
        DefaultLevels: function () {
            planet.climate.set(25.5);
        },
        RandomColor: function(){
            params.Color = Math.floor(Math.random()*colorSchemes.length);
            updateColor();
        }
    };

    let update = function () {
        planet.update();
        // updateCamera(params.PlanetRadius);
    };

    let updateColor = function () {
        //colors = colorSchemes[params.Color];//somehow this does not trigger listen of the color panels
        colors.LeafColor = colorSchemes[params.Color].LeafColor;
        colors.ForestColor = colorSchemes[params.Color].ForestColor;
        colors.GrassColor = colorSchemes[params.Color].GrassColor;
        colors.TrunkColor = colorSchemes[params.Color].TrunkColor;
        colors.SoilColor = colorSchemes[params.Color].SoilColor;
        colors.SandColor = colorSchemes[params.Color].SandColor;
        colors.SnowColor = colorSchemes[params.Color].SnowColor;
        colors.SeaColor = colorSchemes[params.Color].SeaColor;
        colors.SeabedColor = colorSchemes[params.Color].SeabedColor;
        planet.update();
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
        .onChange(function () {
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
    terrainControls.add(options, 'SmoothTerrain');
    terrainControls.add(options, 'SharpTerrain');
    let oceanControls = planetControls.addFolder('Ocean');
    oceanControls.add(params, 'WaterOpacity', 0, 100).onChange(update).listen();
    oceanControls.add(params, 'WaveSpeed', 0, 1).listen();
    oceanControls.add(params, 'WaveLength', 1, 5).listen();
    oceanControls.add(params, 'WaveHeight', 0, 0.3).listen();
    oceanControls.add(options, 'SmoothOcean');
    oceanControls.add(options, 'RoughOcean');
    let forestControls = planetControls.addFolder('Forest');
    //TODO onChange -> generate forest
    forestControls.add(params, 'TreeSpread', -1, 1).onChange().listen();
    forestControls.add(params, 'GrassSpread', -1, 1).onChange().listen();
    forestControls.add(params, 'ForestDensity', -1, 1).onChange().listen();
    let levelControls = planetControls.addFolder('Levels');
    levelControls.add(params, 'SnowLevel', 0, 100).onChange(update).listen();
    levelControls.add(params, 'SandLevel', 0, 100).onChange(update).listen();
    levelControls.add(params, 'SeaLevel', 0, 100).onChange(update).listen();
    levelControls.add(options, 'DefaultLevels');
    let colorControls = planetControls.addFolder('Colors');
    colorControls.addColor(colors, 'LeafColor').onChange(update).listen();
    colorControls.addColor(colors, 'ForestColor').onChange(update).listen();
    colorControls.addColor(colors, 'GrassColor').onChange(update).listen();
    colorControls.addColor(colors, 'TrunkColor').onChange(update).listen();
    colorControls.addColor(colors, 'SoilColor').onChange(update).listen();
    colorControls.addColor(colors, 'SandColor').onChange(update).listen();
    colorControls.addColor(colors, 'SnowColor').onChange(update).listen();
    colorControls.addColor(colors, 'SeaColor').onChange(update).listen();
    colorControls.addColor(colors, 'SeabedColor').onChange(update).listen();
    colorControls.add(params, 'Color', {
        EarthyTones: colorSchemes.indexOf(EarthyTones),
        QuickSilver: colorSchemes.indexOf(QuickSilver),
        RosyRed: colorSchemes.indexOf(RosyRed),
        LimyGreen: colorSchemes.indexOf(LimyGreen),
        MintyBlue: colorSchemes.indexOf(MintyBlue),
        BerryPurple: colorSchemes.indexOf(BerryPurple),
        FruityCandy: colorSchemes.indexOf(FruityCandy),
        DreamyUnicorn: colorSchemes.indexOf(DreamyUnicorn),
        PrettyMermaid: colorSchemes.indexOf(PrettyMermaid),
        FancyFairy: colorSchemes.indexOf(FancyFairy),
        FlamyDragon: colorSchemes.indexOf(FlamyDragon),
        LazyPanda: colorSchemes.indexOf(LazyPanda)
    }).onChange(updateColor).listen();
    colorControls.add(options, 'RandomColor');
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
