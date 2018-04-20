window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, inControl, canvas, gui, simplex, timer;
var params = {
    PlanetRadius: 100,
    PlanetDetail: 7,
    PlanetWireframe: false,
    PlanetFlatShading: true,
    PlanetRotationY: 0,
    TerrainDisplacement: 0.1,
    TerrainDensity: 0.1,
    TerrainDetail: 9,
    WaterLevel: 100,
    WaveSpeed: 0.25,
    WaveLength: 1,
    WaveHeight: 0.05,
    CameraMax: 2,
    CameraDefault: 1.8,
    MoonDistance: 200,
    MoonSize: 30,
    SunDistance: 500,
    SunSize: 200
};
var planet;

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
    light = new PLANET.lighting.Lighting();

    PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.debug.Debug();
    console.log(scene);
    PLANET.main.render();
};

PLANET.main.addObjects = function () {
    planet = new PLANET.planet.Planet(params.PlanetRadius, params.PlanetDetail);
    scene.add(planet)
};

PLANET.main.render = function () {
    requestAnimationFrame(PLANET.main.render);
    timer += 1 / 10;
    if(timer > 1000000) timer = 0;
    if (!inControl) {
        if (planet) {
            planet.rotation.y += params.PlanetRotationY;
            PLANET.planet.animate();
        }
    }
    PLANET.lighting.animate();

    renderer.render(scene, camera);
};