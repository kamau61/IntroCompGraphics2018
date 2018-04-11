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

    //perlin noise
    // var max = params.PlanetRadius * params.TerrainDisplacement;
    // for(var i = 0; i < geometry.vertices.length; i++) {
    //     v = geometry.vertices[i];
    //     v.setLength(v.length() + (noise.perlin3(v.x/params.NoiseOffset, v.y/params.NoiseOffset, v.z/params.NoiseOffset) * max));
    // }

    //3d simplex noise leveled
    // var max = (params.PlanetRadius * params.TerrainDisplacement) / params.NoiseLevel;
    // for(var level = 0; level < params.NoiseLevel; level++) {
    //     var gen = new SimplexNoise();
    //     for(var i = 0; i < geometry.vertices.length; i++) {
    //         v = geometry.vertices[i];
    //         v.setLength(v.length() + (gen.noise3D(v.x / params.NoiseOffset, v.y / params.NoiseOffset, v.z / params.NoiseOffset) * max));
    //     }
    // }

    //3d simplex noise level 1 seeded
    var gen = new SimplexNoise(params.NoiseSeed);
    for(var i = 0; i < geometry.vertices.length; i++) {
        v = geometry.vertices[i];
        v.setLength(v.length() + (gen.noise3D(v.x * params.NoiseOffset, v.y * params.NoiseOffset, v.z * params.NoiseOffset) * params.PlanetRadius * params.TerrainDisplacement));
    }

    //white noise
    // for(var i = 0; i < geometry.vertices.length; i++) {
    //     v = geometry.vertices[i];
    //     v.setLength(v.length() + (Math.random() * params.PlanetRadius * params.TerrainDisplacement));
    // }
};

PLANET.planet.colorTerrain = function() {

}