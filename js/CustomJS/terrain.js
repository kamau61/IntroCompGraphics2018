window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function (base) {
    THREE.Object3D.call(this);
    var geometry = base.clone();
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
    //     v.setLength(v.length() + (noise.perlin3(v.x/params.TerrainDensity, v.y/params.TerrainDensity, v.z/params.TerrainDensity) * max));
    // }

    // 3d simplex noise leveled
    var v, len, offset = params.TerrainDensity;
    var max = params.PlanetRadius * params.TerrainDisplacement;
    // var gen = new SimplexNoise();
    for(var i = 0; i < geometry.vertices.length; i++) {
        v = geometry.vertices[i];
        len = 0;
        for(var j = 1; j <= params.TerrainDetail; j++) {
            offset = params.TerrainDensity * params.TerrainDisplacement * Math.pow(2, j);
            len += (simplex.noise3d(v.x * offset, v.y * offset, v.z * offset) * max) / Math.pow(2, j);
        }
        v.setLength(v.length() + len);
    }

    //3d simplex noise level 1 seeded
    // var gen = new SimplexNoise(), v;
    // for(var i = 0; i < geometry.vertices.length; i++) {
    //     v = geometry.vertices[i];
    //     v.setLength(v.length() + (gen.noise3d(v.x * params.TerrainDensity, v.y * params.TerrainDensity, v.z * params.TerrainDensity) * params.PlanetRadius * params.TerrainDisplacement));
    // }

    //white noise
    // for(var i = 0; i < geometry.vertices.length; i++) {
    //     v = geometry.vertices[i];
    //     v.setLength(v.length() + (Math.random() * params.PlanetRadius * params.TerrainDisplacement));
    // }
};

PLANET.terrain.update = function () {
    this.terrain.geometry = planet.baseGeometry.clone();
    this.terrain.material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading
    });
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
}