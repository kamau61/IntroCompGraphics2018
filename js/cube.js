window.PLANET = window.PLANET || {};
PLANET.cube = PLANET.cube || {};

PLANET.cube.Cube = function(size) {
    THREE.Object3D.call(this);
    this.geometry = new THREE.BoxGeometry(size, size, size);
    this.material = new THREE.MeshNormalMaterial();
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.add(this.cube);
};

PLANET.cube.Cube.prototype = Object.create(THREE.Object3D.prototype);