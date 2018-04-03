window.PLANET = window.PLANET || {};
PLANET.main = PLANET.main || {};

PLANET.main.main = function() {
    renderer = new THREE.WebGLRenderer();
    // renderer.antialias = true;
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.setClearColor(0x000000, 1);
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    // renderer.domElement.setAttribute('id', 'renderer');
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    var aspect = width / height;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 10000);
    camera.position.set(0, 0, 120);

    PLANET.main.test(scene);

    PLANET.main.render();
};

PLANET.main.render = function() {
    requestAnimationFrame(PLANET.main.render);
    renderer.render(scene, camera);
};

PLANET.main.test = function(scene) {
    cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    cubeMaterial = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
};