window.PLANET = window.PLANET || {};
PLANET.ocean = PLANET.ocean || {};

PLANET.ocean.Ocean = function (base) {
    let geometry = base.clone();
    params.WaterLevel = geometry.vertices[0].length();
    let material = new THREE.MeshStandardMaterial({
        //TODO make all these linked to param
        wireframe: params.PlanetWireframe,
        flatShading: true,
        color: new THREE.Color(colors.WaterColor),
        transparent: true,
        opacity: params.WaterOpacity
    });
    let ocean = new THREE.Mesh(geometry, material);
    ocean.castShadow = true;
    ocean.receiveShadow = true;
    ocean.name = "Ocean";
    ocean.frozen = false;
    ocean.animate = function () {
        if (params.Temperature > CONSTANTS.FREEZE_POINT) {
            this.frozen = false;
            let length;
            let step = timer * params.WaveSpeed;
            for (let vertex of geometry.vertices) {
                length = simplex.noise3d(
                    (vertex.x + step) / params.WaveLength,
                    (vertex.y + step) / params.WaveLength,
                    (vertex.z + step) / params.WaveLength
                );
                vertex.setLength(params.WaterLevel + length * params.WaveHeight);
            }
            geometry.verticesNeedUpdate = true;
        } else if (!this.frozen) {
            for (let vertex of geometry.vertices) {
                vertex.setLength(params.WaterLevel);
            }
            geometry.verticesNeedUpdate = true;
            this.frozen = true;
        }
    };
    ocean.update = function () {
        material.color.setHex(colors.WaterColor);
        material.opacity = params.WaterOpacity;
        material.needsUpdate = true;
    };
    return ocean;
};