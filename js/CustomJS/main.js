window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
let scene, camera, renderer, light, canvas, gui, simplex, timer, manager, color, utils, raycaster;

const CONSTANTS = {
    OPT_TEMP: 25.5,
    OPT_RANGE: 4.5,
    FREEZE_POINT: -10,
    BOIL_POINT: 100
};
let params = {
    PlanetRadius: 100,
    PlanetDetail: 6,
    PlanetWireframe: false,
    PlanetFlatShading: true,
    PlanetRotationY: 0,
    SnowColor: 0xEEEEEE, //snow
    MountainColor: 0x594C3A,
    TerrainColor: 0x6B8E23, //olivedrab
    ForestColor: 0x456800,
    BeachColor: 0xF4A460, //sandybrown
    CoralColor: 0x4682B4, //steelblue
    WaterColor: 0x4682B4, //steelblue
    WaterLevel: 100,

    //params regarding temperature
    Temperature: 25.5,
    // ReactionRate: 0.2,
    Color: 0,

    //params regarding terrain generation
    TerrainDisplacement: 10,//10% of radius
    TerrainDensity: 0.1,//frequency of noise generator
    TerrainDetail: 9,//number of layers of noise

    //params regarding terrain type
    SnowLevel: 50,//50% of height above water from top
    SandLevel: 10,//10% of height above water
    SeaLevel: 50,//50% of terrain displacement

    //params regarding forest
    TreeScale: 0.01, //TODO bind this with planet detail
    TreeSpread: 0.5,//0.6, //less the number, wider each forest, -1/+1
    GrassSpread: -0.5,//0, //less the number, wider each grassland, -1/+1
    ForestDensity: 0.2, //more the number, more forests, 0.1/0.3

    //params regarding ocean
    WaterOpacity: 90,
    WaveSpeed: 0.25,
    WaveLength: 1,
    WaveHeight: 0.05,

    CameraMax: 2,
    ZoomSpeed: 1,
    RotateSpeed: 2,
    PanSpeed: 10
};
let colors = colorSchemes[0];
let res = {
    Trees: [],
    DeadTrees: [],
    Loading: 0
};
let planet;
let axis = new THREE.Vector3(1, 0, 0);

PLANET.main.main = function () {
    timer = 0;
    utils = new PLANET.utils();
    params.Color = Math.floor(Math.random() * colorSchemes.length);
    colors = colorSchemes[params.Color];
    //init scene
    scene = new THREE.Scene();
    PLANET.main.loadModels();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = document.createElement('div');
    canvas.appendChild(renderer.domElement);
    document.body.appendChild(canvas);
    PLANET.controls.Controls();

    light = new PLANET.lighting.Lighting();
    raycaster = new THREE.Raycaster();
    scene.add(light);
    PLANET.debug.Debug();
    PLANET.main.render();

    window.addEventListener('resize', function () {
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });
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
        let loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
        console.log(scene);
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    let plyLoader = new THREE.PLYLoader(manager);
    let planetGeometry;
    let fbxLoader = new THREE.FBXLoader(manager);

    plyLoader.load('res/models/sphere-' + params.PlanetDetail + ".ply", function (bufferGeometry) {
        planetGeometry = bufferGeometry;
    });


    fbxLoader.load('res/models/trees.fbx', function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // child.scale.set(params.TreeScale, params.TreeScale, params.TreeScale);
                child.position.set(0, 0, 0);
                for (let material of child.material) {
                    material.flatShading = true;
                    if (material.name === "Trunk") {
                        material.color.setHex(colors.TrunkColor);
                    } else {
                        material.color.setHex(colors.LeafColor);
                    }
                }
                if (child.name.includes("009")) {
                    res.DeadTrees.push(child);
                } else {
                    res.Trees.push(child);
                }
            }
        });
    });
};

PLANET.main.render = function () {
    requestAnimationFrame(PLANET.main.render);
    timer += 1 / 10;
    if (timer > 1000000) timer = 0;
    if (planet) {
        planet.animate();
    }
    if (light) {
        PLANET.lighting.animate();
    }

    renderer.render(scene, camera);
};

function onTransitionEnd(event) {

    event.target.remove();

}