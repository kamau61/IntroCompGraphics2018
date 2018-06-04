window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};

let sunLight = new THREE.DirectionalLight(0xffffff, 1);
let moonLight = new THREE.PointLight(0xeeeeff, 0.01);
let starLight = new THREE.AmbientLight(0x7f7f7f, 0.2);
let stars = [];
let clock = new THREE.Clock();
let distance = 10000;

let effectController = {
    turbidity: 1,
    rayleigh: 0,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.49, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: true
};

PLANET.lighting.update = function () {
    let uniforms = sky.material.uniforms;

    //UNUSED IN CONTROLS
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;

    //USED IN CONTROLS
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    let theta = Math.PI * (effectController.inclination - 0.5);
    sunSphere.position.x = distance * Math.sin(theta);
    sunSphere.position.y = 0;
    sunSphere.position.z = distance * Math.cos(theta);
    sunSphere.visible = effectController.sun;
    uniforms.sunPosition.value.copy(sunSphere.position);
};

sunLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(100, 1));
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.castShadow = true;

PLANET.lighting.Lighting = function () {
    THREE.Object3D.call(this);

    function initSky() {
        sky = new THREE.Sky();
        sky.scale.setScalar(distance);
        scene.add(sky);

        sunSphere = new THREE.Mesh(
            new THREE.IcosahedronBufferGeometry(500, 1),
            new THREE.MeshBasicMaterial({color: 0xffff7f})
        );

        moonSphere = new THREE.Mesh(
            new THREE.IcosahedronBufferGeometry(150, 1),
            new THREE.MeshBasicMaterial({color: 0xeeeeee})
        );

        sunSphere.add(sunLight);
        moonSphere.add(moonLight);
        scene.add(sunSphere);
        scene.add(moonSphere);
        scene.add(starLight);

    }

    function addStars() {
        let geometry = new THREE.SphereGeometry(5, 32, 32)
        for (let z = -1000; z < 1000; z += 20) {

            let material = new THREE.MeshBasicMaterial({color: Math.random() * 0xff00000 - 0xff00000});
            let star = new THREE.Mesh(geometry, material)
            star.position.x = Math.random() * 1000 - 500;
            star.position.y = Math.random() * 2000 - 1000;
            star.position.z = z;
            scene.add(star);
            stars.push(star);
        }
    }
    initSky();
    addStars();
    return this;
};

PLANET.lighting.Lighting.prototype = Object.create(THREE.Object3D.prototype);

PLANET.lighting.animate = function () {
    let r = clock.getElapsedTime() / 10;
    effectController.inclination += 0.01;
    if (effectController.inclination > 1) {
        effectController.inclination = -1;
    }

    if (sunSphere.visible === true) {
        starLight.intensity = 0.2;
    } else {
        starLight.intensity = 1;
    }

    moonSphere.position.x = -0.75 * distance * Math.sin(r);
    moonSphere.position.z = -0.75 * distance * Math.cos(r);

    for (let i = 0; i < stars.length; i++) {
        star = stars[i];
        star.position.x = distance * 10 / i * Math.sin(r + i);
        star.position.z = distance * 10 / i * Math.cos(r + i);
    }
    PLANET.lighting.update();
};
