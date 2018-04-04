window.PLANET = window.PLANET || {};
PLANET.sphere = PLANET.sphere || {};

PLANET.sphere.Sphere = function(radius) {
    THREE.Object3D.call(this);
    this.geometry = new THREE.SphereGeometry(radius, 24, 16);
    this.material = new THREE.MeshToonMaterial({
        color: new THREE.Color('rgb(102, 255, 255)'),
        wireframe: true
    });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
    this.add(this.sphere);
};

PLANET.sphere.Sphere.prototype = Object.create(THREE.Object3D.prototype);