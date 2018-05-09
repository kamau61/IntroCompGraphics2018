window.PLANET = window.PLANET || {};
PLANET.ocean = PLANET.ocean || {};

PLANET.ocean.Ocean = function(bufferGeometry) {
    THREE.Object3D.call(this);
    // var geometry = new THREE.Geometry();
    // console.log(bufferGeometry);
    // geometry.fromBufferGeometry(bufferGeometry);
    // console.log(geometry);

    // geometry.scale(params.WaterLevel, params.WaterLevel, params.WaterLevel);
    bufferGeometry.scale(100,100,100);
    var material = new THREE.MeshStandardMaterial({
        //TODO make all these linked to param
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading,
        color: new THREE.Color('steelblue'),
        transparent: true,
        opacity: 0.9
    });
    this.ocean = new THREE.Mesh(bufferGeometry, material);
    this.ocean.name = "Ocean";
    return this.ocean;
};

PLANET.ocean.Ocean.prototype = Object.create(THREE.Object3D.prototype);

PLANET.ocean.update = function() {
    // this.ocean.geometry.scale(params.WaterLevel, params.WaterLevel, params.WaterLevel);
    // this.ocean.material = new THREE.MeshStandardMaterial({
    //     wireframe: params.PlanetWireframe,
    //     flatShading: params.PlanetFlatShading,
    //     color: new THREE.Color(0x44B8ED),
    //     transparent: true,
    //     opacity: 0.8
    // });
};

PLANET.ocean.animate = function() {
    var v, len, spd = timer * params.WaveSpeed;
    for(var i = 0; i < this.ocean.geometry.attributes.position.count; i += 3) {
        v = this.ocean.geometry.attributes.position.array;
        len = simplex.noise3d((v[i] + spd) / params.WaveLength, (v[i+1] + spd) / params.WaveLength, (v[i+2] + spd) / params.WaveLength);
        // v.setLength(params.WaterLevel + len * params.WaveHeight);
    }
    this.ocean.geometry.verticesNeedUpdate = true;
};