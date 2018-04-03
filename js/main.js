window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

//variables that need global access
var scene, camera, renderer, light, cube, sphere, inControl;
const CUBE_SIZE = 1, SPHERE_RADIUS = 60;

PLANET.main.main = function() {
    //init scene
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
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
    camera.position.set(0, 10, 70);
    //init light
    light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-80, 80, 80);
    scene.add(light);
    PLANET.main.addObjects();
    PLANET.controls.Controls();
    PLANET.main.render();
};

PLANET.main.addObjects = function() {
    cube = new PLANET.cube.Cube(CUBE_SIZE);
    scene.add(cube);
    sphere = new PLANET.sphere.Sphere(SPHERE_RADIUS);
    scene.add(sphere);
};

PLANET.main.render = function() {
    requestAnimationFrame(PLANET.main.render);

    if(!inControl) {
        cube.rotation.x += 0.05;
        cube.rotation.y += 0.05;
        sphere.rotation.y -= 0.005;
    }

    renderer.render(scene, camera);
};