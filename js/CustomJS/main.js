window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, canvas, gui, simplex, timer;
var params = {
    PlanetRadius: 100,
    PlanetDetail: 'sphere-8.ply',
    PlanetWireframe: false,
    PlanetFlatShading: true,
    PlanetRotationY: 0,
    TerrainDisplacement: 0.1,
    TerrainDensity: 0.1,
    TerrainDetail: 9,
    TerrainColor: 0x6B8E23, //olivedrab
    SnowLevel: 0.5,
    SnowColor: 0xFFFAFA, //snow
    BeachLevel: 0.1,
    BeachColor: 0xF4A460, //sandybrown
    CoralColor: 0x4682B4, //steelblue
    WaterColor: 0x4682B4, //steelblue
    WaterLevel: 100,
    WaterOpacity: 0.9,
    WaveSpeed: 0.25,
    WaveLength: 1,
    WaveHeight: 0.05,
    CameraMax: 2,
    ZoomSpeed: 1,
    RotateSpeed: 2,
    PanSpeed: 10

};
var planet;
var axis = new THREE.Vector3(1, 0, 0);

PLANET.main.main = function () {
    timer = 0;
    //init scene
    scene = new THREE.Scene();
    PLANET.main.loadModels();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = document.createElement('div');
    canvas.appendChild(renderer.domElement);
    document.body.appendChild(canvas);
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });
    //init light
    var distance = params.PlanetRadius * params.CameraMax;
    light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-distance, distance, distance);
    light.castShadow = true;
    scene.add(light);
    var ambLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambLight);
    // PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.debug.Debug();
    console.log(scene);
    PLANET.main.render();
};

PLANET.main.loadModels = function () {
    var loader = new THREE.PLYLoader();
    loader.load('Resources/models/' + params.PlanetDetail, function (bufferGeometry) {
            planet = new PLANET.planet.Planet(bufferGeometry);
            scene.add(planet);
        },
        function (event) {
            console.log('loaded: ' + event.loaded);
        });
};

PLANET.main.addObjects = function (bufferGeometry) {


};

PLANET.main.render = function () {
    requestAnimationFrame(PLANET.main.render);
    timer += 1 / 10;
    if (timer > 1000000) timer = 0;
    if (planet) {
        planet.rotation.y += params.PlanetRotationY;
        PLANET.planet.animate();
    }
    // PLANET.controls.update();
    renderer.render(scene, camera);
};