window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, canvas, gui, simplex, timer;
var params = {
    PlanetRadius: 100,
    // PlanetDetail: 7,
    PlanetDetail:6, //for testing
    PlanetWireframe: false,
    PlanetFlatShading: true,
    PlanetRotationY: 0,
    TerrainDisplacement: 0.1,
    TerrainDensity: 0.1,
    TerrainDetail: 9,
    SnowLevel: 0.5,
    BeachLevel: 0.1,
    WaterLevel: 100,
    WaveSpeed: 0.25,
    WaveLength: 1,
    WaveHeight: 0.05,
    CameraMax: 2,
    AutoRotate: false,
    AutoRotateSpeed: 2, // 30 seconds per round when fps is 60
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
    PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.debug.Debug();
    console.log(scene);
    PLANET.main.render();
};

PLANET.main.addObjects = function () {
    planet = new PLANET.planet.Planet();
    scene.add(planet);
};

PLANET.main.render = function () {
    requestAnimationFrame(PLANET.main.render);
    timer += 1 / 10;
    if(timer > 1000000) timer = 0;
    if (planet) {
        planet.rotation.y += params.PlanetRotationY;
        PLANET.planet.animate();
    }
<<<<<<< HEAD
<<<<<<< HEAD

    PLANET.controls.update();
=======
>>>>>>> b2a56284eec4cb23c3889f0af910446b1e52979f
=======
    if (params.AutoRotate) {
        controls.update();
    }
>>>>>>> 15711b1a4a2b629e9263a048c107e1a4332efda6
    renderer.render(scene, camera);
};
