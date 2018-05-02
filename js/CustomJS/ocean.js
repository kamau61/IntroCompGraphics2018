window.PLANET = window.PLANET || {};
PLANET.ocean = PLANET.ocean || {};

PLANET.ocean.Ocean = function(base) {
    THREE.Object3D.call(this);
    var geometry = base.clone();
    params.WaterLevel = geometry.vertices[0].length();
    var material = new THREE.MeshStandardMaterial({
        //TODO make all these linked to param
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading,
        color: new THREE.Color('steelblue'),
        transparent: true,
        opacity: 0.8
    });
    this.ocean = new THREE.Mesh(geometry, material);
    this.ocean.castShadow = true;
    this.ocean.receiveShadow = true;
    this.ocean.name = "Ocean";
    return this.ocean;
};

PLANET.ocean.Ocean.prototype = Object.create(THREE.Object3D.prototype);

PLANET.ocean.update = function() {
    // this.ocean.geometry = planet.baseGeometry.clone();
    // this.ocean.geometry.scale(params.WaterLevel, params.WaterLevel, params.WaterLevel);
    // this.ocean.material = new THREE.MeshStandardMaterial({
    //     wireframe: params.PlanetWireframe,
    //     flatShading: params.PlanetFlatShading,
    //     caseShadow: true,
    //     receiveShadow: true,
    //     color: new THREE.Color(0x44B8ED),
    //     transparent: true,
    //     opacity: 0.8
    // });
};

PLANET.ocean.animate = function() {
    var v, len, spd = timer * params.WaveSpeed;
    for(var i = 0; i < this.ocean.geometry.vertices.length; i++) {
        v = this.ocean.geometry.vertices[i];
        len = simplex.noise3d((v.x + spd) / params.WaveLength, (v.y + spd) / params.WaveLength, (v.z + spd) / params.WaveLength);
        v.setLength(params.WaterLevel + len * params.WaveHeight);
    }
    this.ocean.geometry.verticesNeedUpdate = true;
    this.ocean.geometry.computeVertexNormals();
};