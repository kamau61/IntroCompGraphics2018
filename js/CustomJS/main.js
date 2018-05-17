window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, canvas, gui, simplex, timer;
var params = {
    PlanetRadius: 100,
    PlanetDetail: 7,
    // PlanetDetail: 5, //for testing
    PlanetWireframe: false,
    PlanetRotationY: 0,
    TerrainDisplacement: 0.1,
    TerrainDensity: 0.1,
    TerrainDetail: 9,
    SnowColor: 0xFFFAFA, //snow
    TrunkColor: 0x907350,
    LeafColor: 0x233e23,
    ForestColor: 0x136d15,
    GrassColor: 0x558822,
    SoilColor: 0x778811,
    SandColor: 0x998800,
    SeabedColor: 0x1c3047,
    SnowLevel: 0.5,
    BeachLevel: 0.1,
    TreeScale: 0.005, //TODO bind this with planet detail
    ForestTree: 0.6, //less the number, wider each forest
    ForestGrass: 0.3, //less the number, wider each grassland
    ForestDensity: 0.2, //more the number, more forests
    WaterColor: 0x1b8594, //0x4682B4, //steelblue
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
var res = {
    Types: {
        fbx: 0
    },
    Trees: [],
    DeadTrees: [],
    Loading: 0
};
var planet;
var axis = new THREE.Vector3(1, 0, 0);

PLANET.main.main = function () {
    timer = 0;
    //init scene
    scene = new THREE.Scene();
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
    var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
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
                child.scale.set(params.TreeScale, params.TreeScale, params.TreeScale);
                child.position.set(0, 0, 0);
                for (let material of child.material) {
                    material.flatShading = true;
                    if (material.name === "Trunk") {
                        material.color.setHex(params.TrunkColor);
                    } else {
                        material.color.setHex(params.LeafColor);
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
        planet.rotation.y += params.PlanetRotationY;
        planet.animate();
    }
    // PLANET.controls.update();
    renderer.render(scene, camera);
};
