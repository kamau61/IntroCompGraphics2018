window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function (base) {
    THREE.Object3D.call(this);
    var geometry = base.clone();
    var material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading,
        vertexColors: THREE.FaceColors
    });
    PLANET.terrain.displaceTerrain(geometry);
    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.castShadow = true;
    this.terrain.receiveShadow = true;
    this.terrain.name = "Terrain";
    return this.terrain;
};

PLANET.terrain.Terrain.prototype = Object.create(THREE.Object3D.prototype);

PLANET.terrain.displaceTerrain = function (geometry) {
    // 3d simplex noise leveled
    var v, len, offset = params.TerrainDensity;
    var max = params.PlanetRadius * params.TerrainDisplacement;
    for(var i = 0; i < geometry.vertices.length; i++) {
        v = geometry.vertices[i];
        len = 0;
        for(var j = 1; j <= params.TerrainDetail; j++) {
            offset = params.TerrainDensity * params.TerrainDisplacement * Math.pow(2, j);
            len += (simplex.noise3d(v.x * offset, v.y * offset, v.z * offset) * max) / Math.pow(2, j);
        }
        v.setLength(params.PlanetRadius + len);
    }
    geometry.elementsNeedUpdate = true;
    geometry.computeVertexNormals();
    PLANET.terrain.colorTerrain(geometry);
};

PLANET.terrain.colorTerrain = function(geometry) {
    var f, v = [3], vi = ['a', 'b', 'c'],
        pos = new THREE.Vector3();
    for(var i = 0; i < geometry.faces.length; i++) {
        f = geometry.faces[i];
        pos.set(0, 0, 0);
        for(var j = 0; j < vi.length; j++) {
            v[j] = geometry.vertices[f[vi[j]]];
            pos.x += v[j].x;
            pos.y += v[j].y;
            pos.z += v[j].z;
        }
        pos.x /= vi.length;
        pos.y /= vi.length;
        pos.z /= vi.length;
        if(pos.length() > params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel))) {
            f.color.setHex(params.SnowColor);
        } else if(pos.length() > params.WaterLevel + params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius) {
            f.color.setHex(params.TerrainColor);
        } else if(pos.length() > params.WaterLevel - params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius) {
            f.color.setHex(params.BeachColor);
        } else {
            f.color.setHex(params.CoralColor);
        }
    }
};

PLANET.terrain.update = function () {
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
    this.terrain.geometry.elementsNeedUpdate = true;
    this.terrain.geometry.computeVertexNormals();
};