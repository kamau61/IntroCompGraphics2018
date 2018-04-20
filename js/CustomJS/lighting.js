window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};

PLANET.lighting.Lighting = function () {
    this.starLight = new THREE.AmbientLight(0x25105c);
    scene.add(this.starLight);

    this.sunLight = new THREE.PointLight(0xffffff, 0.5, 1000);
    this.moonLight = new THREE.PointLight(0xeeeeff, 0.01);
    scene.add(this.sunLight);
    scene.add(this.moonLight);

    var sunObj = new THREE.SphereGeometry(100, 8, 8);
    var moonObj = new THREE.SphereGeometry(100, 8, 8);
    var materialLightSun = new THREE.MeshBasicMaterial({color: 0xffaa00});
    var materialLightMoon = new THREE.MeshBasicMaterial({color: 0xeeeeee});
    this.sun = new THREE.Mesh(sunObj, materialLightSun);
    this.moon = new THREE.Mesh(moonObj, materialLightMoon);
    this.sun.scale.set(0.1, 0.1, 0.1);
    this.moon.scale.set(0.01, 0.01, 0.01);
    this.sunLight.add(this.sun);
    this.moonLight.add(this.moon);
};

PLANET.lighting.animate = function () {
    // Rotation of sun and moon
    var r = this.clock.getElapsedTime() / 5;
    this.sunLight.position.x = 200 * Math.cos(r);
    this.sunLight.position.z = 200 * Math.sin(r);
    this.moonLight.position.x = 50 * -Math.cos(r);
    this.moonLight.position.z = 50 * -Math.sin(r);

    var sunDistance = Math.sqrt(
        Math.pow(camera.position.x - this.sun.position.x, 2) +
        Math.pow(camera.position.y - this.sun.position.y, 2) +
        Math.pow(camera.position.z - this.sun.position.z, 2)
    );

    if (sunDistance > 59) {
        phase = 'day';
    } else if (sunDistance > 39) {
        phase = 'twilight';
    } else if (sunDistance > 29) {
        phase = 'dark';
    } else {
        phase = 'night';
    }
};