window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, canvas, gui, simplex, timer, manager;
var params = {
    PlanetRadius: 100,
    PlanetDetail: 7,
    PlanetWireframe: false,
    PlanetFlatShading: true,
    PlanetRotationY: 0,
    TerrainDisplacement: 0.1,
    TerrainDensity: 0.1,
    TerrainDetail: 9,
    SnowLevel: 12,
    MountainLevel: 7,
    BeachLevel: 1,
    SnowColor: 0xEEEEEE, //snow
    MountainColor: 0x594C3A,
    TerrainColor: 0x6B8E23, //olivedrab
    ForrestColor: 0x456800,
    BeachColor: 0xF4A460, //sandybrown
    CoralColor: 0x4682B4, //steelblue
    WaterColor: 0x4682B4, //steelblue
    WaterLevel: 100,
    WaterOpacity: 0.9,
    WaveSpeed: 0.25,
    WaveLength: 1,
    WaveHeight: 0.05,
    CameraMax: 2,
    CameraDefault: 1.8,
    MoonDistance: 200,
    MoonSize: 30,
    SunDistance: 500,
    SunSize: 200,
    AutoRotate: false,
    AutoRotateSpeed: 2, // 30 seconds per round when fps is 60
    ZoomSpeed: 1,
    RotateSpeed: 2,
    PanSpeed: 10

};
var planet;
var axis = new THREE.Vector3(1, 0, 0);
var baseTrees = [];
var shadowMapViewer;

PLANET.main.main = function () {
    timer = 0;
    //init scene
    scene = new THREE.Scene();
    PLANET.main.loadModels();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    // var distance = params.PlanetRadius * params.CameraMax;
    // light = new THREE.DirectionalLight(0xffffff, 0.8);
    // light.position.set(-distance, distance, distance);
    // light.castShadow = true;

    light = new PLANET.lighting.Lighting();
    scene.add(light);


    PLANET.controls.Controls();
    PLANET.debug.Debug();
    console.log(scene);
    PLANET.main.render();
};

PLANET.main.loadModels = function () {
    manager = new THREE.LoadingManager();

    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onLoad = function () {
        console.log('Loading complete!');
        planet = new PLANET.planet.Planet(planetGeometry);
        scene.add(planet);
        planet.castShadow = true;
        planet.receiveShadow = true;
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
        console.log(scene);
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    var plyLoader = new THREE.PLYLoader(manager);
    var planetGeometry;
    var fbxLoader = new THREE.FBXLoader(manager);

    plyLoader.load('Resources/models/sphere-' + params.PlanetDetail + ".ply", function (bufferGeometry) {
        planetGeometry = bufferGeometry;
        //planet = new PLANET.planet.Planet(bufferGeometry);
        //scene.add(planet);
    });


    fbxLoader.load('trees.fbx', function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.scale.set(0.02, 0.02, 0.02);
                child.position.set(0, 0, 0);
                baseTrees.push(child);
            }
        });
    });
};

PLANET.main.render = function () {
    requestAnimationFrame(PLANET.main.render);
    timer += 1 / 10;
    if (timer > 1000000) timer = 0;
    if (planet) {
        planet.rotation.y += params.PlanetRotationY;
        PLANET.planet.animate();
    }
    if(light) {
      PLANET.lighting.animate();
    }

    renderer.render(scene, camera);
    shadowMapViewer.render(renderer);

};

function onTransitionEnd(event) {

    event.target.remove();

}
