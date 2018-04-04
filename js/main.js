window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, cube, spheres, inControl, canvas, gui;
const CUBE_ROTATION = {
    MIN: 0,
    MAX: 0.2,
    STEP: 0.01,
    DEFAULT: 0.05
}, SPHERE_ROTATION = {
    MIN: 0,
    MAX: 0.2,
    STEP: 0.01,
    DEFAULT: 0.005,
    DIRECTION: false
};
var params = {
    CameraDistance: 80,
    CubeSize: 5,
    CubeSizeMin: 1,
    CubeSizeMax: 100,
    CubeSizeStep: 1,
    CubeRotation: CUBE_ROTATION.DEFAULT,
    SphereRadius: 60,
    SphereScale: 1.2,
    SphereRotation: SPHERE_ROTATION.DEFAULT,
    SphereDirection: SPHERE_ROTATION.DIRECTION
};
// var CUBE_SIZE = 5, SPHERE_RADIUS = 60, CAMERA_DISTANCE = 80, CUBE_ROTATION = 0.05, SPHERE_ROTATION = 0.005;

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
    //init camera
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 5000);
    camera.position.set(0, 0, params.CameraDistance);
    //init light
    light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-80, 80, 80);
    scene.add(light);
    PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.main.render();
};

PLANET.main.addObjects = function() {
    cube = new PLANET.cube.Cube(params.CubeSize);
    scene.add(cube);
    spheres = [];
    scene.add(spheres[0] = new PLANET.sphere.Sphere(params.SphereRadius));
    scene.add(spheres[1] = spheres[0].clone());
    spheres[1].scale.set(params.SphereScale, params.SphereScale, params.SphereScale);
};

PLANET.main.render = function() {
    requestAnimationFrame(PLANET.main.render);

    if(!inControl) {
        cube.rotation.x += params.CubeRotation;
        cube.rotation.y += params.CubeRotation;
        spheres[0].rotation.y -= params.SphereRotation;
        spheres[1].rotation.y -= params.SphereDirection? params.SphereRotation : -params.SphereRotation;
    }

    renderer.render(scene, camera);
};