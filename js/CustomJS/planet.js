window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function(radius, detail) {
    THREE.Object3D.call(this);
    var geometry = new THREE.IcosahedronGeometry(radius, detail);
    geometry.verticesNeedUpdate = true;
    var material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading,
        castShadow: true,
        receiveShadow: true
    });
    PLANET.planet.displaceTerrain(geometry);
    this.terrain = new THREE.Mesh(geometry, material);
    this.add(this.terrain);
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);

PLANET.planet.displaceTerrain = function(geometry) {
    for(var i = 0; i < geometry.vertices.length; i++) {
        v = geometry.vertices[i];
        v.setLength(v.length() + (Math.random() * params.PlanetRadius * params.TerrainDisplacement));
    }
}