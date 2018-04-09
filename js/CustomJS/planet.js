window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function(radius, detail) {
    THREE.Object3D.call(this);
    var geometry = new THREE.IcosahedronGeometry(radius, detail);
    var material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading
    });
    this.terrain = new THREE.Mesh(geometry, material);
    this.add(this.terrain);
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);