window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function () {
    THREE.Object3D.call(this);

    this.baseGeometry = new THREE.IcosahedronGeometry(params.PlanetRadius, params.PlanetDetail);
    var geometry = this.baseGeometry.clone();
    geometry.verticesNeedUpdate = true;
    var material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading
    });
    PLANET.terrain.displaceTerrain(geometry);
    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.name = "Terrain";
    return this.terrain;
};

PLANET.terrain.Terrain.prototype = Object.create(THREE.Object3D.prototype);

PLANET.terrain.displaceTerrain = function (geometry) {


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
    var gen = new SimplexNoise(params.NoiseSeed), v;
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

PLANET.terrain.update = function () {
    this.terrain.geometry = this.baseGeometry.clone();
    this.terrain.geometry.needsUpdate = true;
    this.terrain.material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading
    });
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
}