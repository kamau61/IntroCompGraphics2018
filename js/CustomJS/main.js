window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, inControl, canvas, gui;
var params = {
    PlanetRadius: 100,
    PlanetDetail: 5,
    PlanetWireframe: false,
    PlanetFlatShading: true,
    PlanetRotation: true,
    PlanetRotationY: 0.001,
    TerrainDisplacement: 0.05,
    CameraMax: 2,
    CameraDefault: 1.8
};
var planet;

PLANET.main.main = function() {
    //init scene
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = document.createElement('div');
    canvas.appendChild(renderer.domElement);
    document.body.appendChild(canvas);
    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    });
    //init light
    var distance = params.PlanetRadius * params.CameraDefault;
    light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-distance, distance, distance);
    scene.add(light);
    PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.debug.Debug();
    PLANET.main.render();
};

PLANET.main.addObjects = function() {planet = new PLANET.planet.Planet(params.PlanetRadius, params.PlanetDetail);
    scene.add(planet)
};

PLANET.main.render = function() {
    requestAnimationFrame(PLANET.main.render);

    if(!inControl) {
        if(planet) {
            if(params.PlanetRotation) {
                planet.rotation.y += params.PlanetRotationY;
            }
        }
    }

    renderer.render(scene, camera);
};