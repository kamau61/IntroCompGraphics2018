window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
let scene, camera, renderer, light, canvas, gui, simplex, timer, manager, color, utils, raycaster,controls;

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
    TreeSpread: -0.5,//0.6, //less the number, wider each forest, -1/+1
    GrassSpread: -0.5,//0, //less the number, wider each grassland, -1/+1
    ForestDensity: 0.3, //more the number, more forests, 0.1/0.3

    TreeCount: 5000,

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
    TreesGeometry: [],
    TreesMaterials: [],
    DeadTreesGeometry: [],
    DeadTreesMaterials: []
};
let planet;
let axis = new THREE.Vector3(1, 0, 0);

PLANET.main.main = function () {
    timer = 0;
    utils = new PLANET.utils();
    colors = colorSchemes[params.Color];
    //init scene
    scene = new THREE.Scene();
    PLANET.main.loadModels();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = document.createElement('div');
    canvas.appendChild(renderer.domElement);
    document.body.appendChild(canvas);
    PLANET.controls.Controls();

    light = new PLANET.lighting.Lighting();
    raycaster = new THREE.Raycaster();
    scene.add(light);
    PLANET.main.render();

    window.addEventListener('resize', function () {
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
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
        planet.castShadow = true;
        planet.receiveShadow = true;
        document.addEventListener('mousedown', planet.terrain.modifyTerrain, false);
        PLANET.debug.Debug();
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
        console.log(object);
        object.traverse(function (child) {
            if (child.isMesh) {
                for (let material of child.material) {
                    // material.flatShading = true;
                    if (material.name === "Trunk") {
                        material.color.setHex(colors.TrunkColor);
                    } else {
                        material.color.setHex(colors.LeafColor);
                    }
                }
                if (child.name.includes("009")) {
                    res.DeadTreesGeometry.push(child.geometry);
                    res.DeadTreesMaterials.push(child.material);
                } else {
                    res.TreesGeometry.push(child.geometry);
                    res.TreesMaterials.push(child.material);
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

    controls.update();

    renderer.render(scene, camera);
};

function onTransitionEnd(event) {

    event.target.remove();

}
