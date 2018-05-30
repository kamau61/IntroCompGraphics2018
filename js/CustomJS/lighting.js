window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};

var effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.49, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: true
};

var sunSphere;

PLANET.lighting.Lighting = function () {
    THREE.Object3D.call(this);
    this.name = "Lighting";
    this.starLight = new THREE.AmbientLight(0x7f7f7f);
    this.add(this.starLight);
    // Add Sky
    sky = new THREE.Sky();
    sky.scale.setScalar(450000); //Set sky box size
    sky.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    sky.name = "Sky";
    this.add(sky);
    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.IcosahedronBufferGeometry(500, 1),
        new THREE.MeshBasicMaterial({color: 0xffff7f})
    );
    var sunlight = new THREE.PointLight(0xffffff, 0.8);
    sunlight.castShadow = true;
    sunSphere.add(sunlight);

    sunSphere.position.y = -10000;
    sunSphere.visible = true;
    sunSphere.name = "SunSphere";
    this.add(sunSphere);
    /// GUI


    var gui = new dat.GUI();
    gui.add(effectController, "turbidity", 1.0, 20.0, 0.1).onChange(guiChanged);
    gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
    gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(guiChanged);
    gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(guiChanged);
    gui.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
    gui.add(effectController, "inclination", -1, 1, 0.0001).onChange(guiChanged);
    gui.add(effectController, "azimuth", 0, 1, 0.0001).onChange(guiChanged);
    gui.add(effectController, "sun").onChange(guiChanged);
    guiChanged();

    return this;
};

PLANET.lighting.Lighting.prototype = Object.create(THREE.Object3D.prototype);


function guiChanged() {
    var distance = 100000;

    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    var theta = Math.PI * (effectController.inclination - 0.5);
    sunSphere.position.x = distance * Math.sin(theta);
    sunSphere.position.y = 0;
    sunSphere.position.z = distance * Math.cos(theta);
    uniforms.sunPosition.value = sunSphere.position;
}


/////////////////////////////////////////////////////
// RENDER LOOP                                     //
/////////////////////////////////////////////////////

PLANET.lighting.animate = function () {
    effectController.inclination += 0.01;
    if (effectController.inclination > 1) {
        effectController.inclination = -1;
    }

    guiChanged();
};
