window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
let scene, camera, renderer, light, color, canvas, gui, simplex, timer, utils;
const CONSTANTS = {
    OPT_TEMP: 25.5,
    OPT_RANGE: 4.5,
    FREEZE_POINT: -10,
    BOIL_POINT: 100
};
let params = {
    PlanetRadius: 100,
    PlanetDetail: 7,

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

PLANET.main.main = function () {
    timer = 0;
    utils = new PLANET.utils();
    params.Color = Math.floor(Math.random()*colorSchemes.length);
    colors = colorSchemes[params.Color];
    //init scene
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = document.createElement('div');
    canvas.appendChild(renderer.domElement);
    document.body.appendChild(canvas);
    window.addEventListener('resize', function () {
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });
    //init light
    let distance = params.PlanetRadius * params.CameraMax;
    light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-distance, distance, distance);
    light.castShadow = true;
    scene.add(light);
    let ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
    // PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.debug.Debug();
    console.log(scene);
    PLANET.main.render();
    PLANET.main.loadResources();
};

PLANET.main.loadResources = function () {
    let loader;
    res.Loading++;
    loader = new THREE.FBXLoader();
    loader.load('trees.fbx', function (object) {
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
        PLANET.main.onResourcesReady(res.Trees);
    });
};

PLANET.main.onResourcesReady = function (resource) {
    res.Loading--;
    if (res.Loading === 0) {
        PLANET.main.addObjects();
    }
};

PLANET.main.addObjects = function () {
    planet = new PLANET.planet.Planet();
    scene.add(planet);
};

PLANET.main.render = function () {
    requestAnimationFrame(PLANET.main.render);
    timer += 1 / 10;
    if (timer > 1000000) timer = 0;
    if (planet) {
        planet.animate();
    }
    // PLANET.controls.update();
    renderer.render(scene, camera);
};
