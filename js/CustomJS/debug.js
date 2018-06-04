window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};

PLANET.debug.Debug = function () {
    let options = {
        reset: function () {
            params.color = 0;
            updateColor();
            this.defaultTerrain();
            this.defaultOcean();
            this.defaultLevels();
        },
        generate: function () {
            simplex = new SimplexNoise();
            update(true);
        },
        defaultTerrain: function () {
            params.TerrainDisplacement = 10;
            params.TerrainDensity = 0.1;
            params.TerrainDetail = 9;
            update(true);
        },
        defaultOcean: function () {
            params.WaveSpeed = 0.25;
            params.WaveLength = 1;
            params.WaveHeight = 0.05;
        },
        defaultLevels: function () {
            planet.climate.set(25.5);
        },
        randomColor: function(){
            params.Color = Math.floor(Math.random()*colorSchemes.length);
            updateColor();
        }
    };

    let update = function (rebuildTerrain) {
        planet.update(rebuildTerrain);
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
        update(false);
    };

    gui = new dat.GUI();
    let planetControls = gui.addFolder('Planet');
    planetControls.add(params, 'Temperature')
        .min(CONSTANTS.FREEZE_POINT)
        .max(CONSTANTS.LAVA_POINT)
        .onChange(function () {
            planet.climate.set(params.Temperature);
        })
        .step(0.1).listen();
    planetControls.close();
    let terrainControls = planetControls.addFolder('Terrain');
    terrainControls.add(params, 'TerrainDensity', 0, 1).onChange(update(true)).listen();
    terrainControls.add(params, 'TerrainDisplacement', 0, 50).onChange(update(true)).listen();
    terrainControls.add(params, 'TerrainDetail', 1, 10).step(1).onChange(update(true)).listen();
    terrainControls.add(options, 'generate');
    terrainControls.add(options, 'defaultTerrain');
    let oceanControls = planetControls.addFolder('Ocean');
    oceanControls.add(params, 'WaterOpacity', 0, 100).onChange(update(false)).listen();
    oceanControls.add(params, 'WaveSpeed', 0, 1).listen();
    oceanControls.add(params, 'WaveLength', 1, 5).listen();
    oceanControls.add(params, 'WaveHeight', 0, 0.3).listen();
    oceanControls.add(options, 'defaultOcean');
    let forestControls = planetControls.addFolder('Forest');
    //TODO onChange -> generate forest
    forestControls.add(params, 'TreeSpread', -1, 1).onChange().listen();
    forestControls.add(params, 'GrassSpread', -1, 1).onChange().listen();
    forestControls.add(params, 'ForestDensity', -1, 1).onChange().listen();
    //not needed cause everything is tided with temperature
    let levelControls = planetControls.addFolder('Levels');
    levelControls.add(params, 'SnowLevel', 0, 100).onChange(update(false)).listen();
    levelControls.add(params, 'SandLevel', 0, 100).onChange(update(false)).listen();
    levelControls.add(params, 'SeaLevel', 0, 100).onChange(update(false)).listen();
    levelControls.add(params, 'LavaLevel', 0, 100).onChange(update(false)).listen();
    levelControls.add(options, 'defaultLevels');
    let colorControls = planetControls.addFolder('Colors');
    colorControls.addColor(colors, 'LeafColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'ForestColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'GrassColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'TrunkColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'SoilColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'SandColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'SnowColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'SeaColor').onChange(update(false)).listen();
    colorControls.addColor(colors, 'SeabedColor').onChange(update(false)).listen();
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
        WillyWonka: colorSchemes.indexOf(WillyWonka)
    }).onChange(updateColor).listen();
    colorControls.add(options, 'randomColor');
    colorControls.close();


    let cameraControls = gui.addFolder('Camera');
    cameraControls.add(controls, 'movingSpeed', 0, 5).name('Moving Speed').listen();
    cameraControls.add(controls, 'rotatingSpeed', 0, 5).name('Rotating Speed').listen();
    cameraControls.add(controls, 'minDistance', 0, 200).name('Minimum Distance').listen();
    cameraControls.add(controls, 'maxDistance', 200, 1000).name('Maximum Distance').listen();
    cameraControls.add(controls, 'viewChangingDist', 20, 100).name('View Changing Distance').listen();
    cameraControls.open();

    let lightingControls = gui.addFolder('Lighting');
  	 lightingControls.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( PLANET.lighting.update );
  	 lightingControls.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( PLANET.lighting.update );
  	 lightingControls.add( effectController, "luminance", 0.0, 1 ).onChange( PLANET.lighting.update );
  	 lightingControls.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( PLANET.lighting.update );
  	 lightingControls.add( effectController, "sun" ).onChange( PLANET.lighting.update );
    lightingControls.open();


    gui.add(options, 'reset');
};