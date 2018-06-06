window.PLANET = window.PLANET || {};
PLANET.ocean = PLANET.ocean || {};

//Ocean - Boris
//Ocean animated by moving vertices by noise
//Not using shaders cause it needs to have shadows, out of scope to implement dynamic shadows with shaders
PLANET.ocean.Ocean = function (bufferGeometry) {
    let geometry = new THREE.Geometry();
    geometry.fromBufferGeometry(bufferGeometry);
    let material = new THREE.MeshStandardMaterial({
        flatShading: true,
        color: new THREE.Color(colors.SeaColor),
        transparent: true,
        opacity: params.WaterOpacity / 100
    });
    let ocean = new THREE.Mesh(geometry, material);
    ocean.receiveShadow = true;
    ocean.name = "Ocean";
    ocean.frozen = false; //to stop waves
    ocean.frustumCulled = false;

    //Animate ocean by moving vertices
    ocean.animate = function () {
        if (params.Temperature > CONSTANTS.FREEZE_POINT) {                  //if it should have waves
            let seaLevel = utils.getSeaLevel();
            this.frozen = false;
            let length;
            let step = timer * params.WaveSpeed;                            //step in noise
            for (let vertex of geometry.vertices) {
                length = simplex.noise3d(                                   //noise with frequency of wave length
                    (vertex.x + step) / params.WaveLength,
                    (vertex.y + step) / params.WaveLength,
                    (vertex.z + step) / params.WaveLength
                );
                vertex.setLength(seaLevel + length * params.WaveHeight);    //map noise to wave height in pixels
            }
            geometry.verticesNeedUpdate = true;
        } else if (!this.frozen) {                                          //if it shouldn't have waves but not frozen yet
            let seaLevel = utils.getSeaLevel();
            for (let vertex of geometry.vertices) {
                vertex.setLength(seaLevel);                                 //'freeze' it by moving all vertices to sea level
            }
            geometry.verticesNeedUpdate = true;
            this.frozen = true;
        }
    };

    //Update ocean after colors or opacity changes
    //Sealevel, wave params changes are covered by animate loop
    ocean.update = function () {
        material.color.setHex(colors.SeaColor);
        material.opacity = params.WaterOpacity / 100;
        material.needsUpdate = true;
        geometry.colorsNeedUpdate = true;
    };

    return ocean;
};