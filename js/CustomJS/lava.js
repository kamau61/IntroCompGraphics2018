window.PLANET = window.PLANET || {};
PLANET.lava = PLANET.lava || {};

//Lava - Boris
//Lava animated by shaders
PLANET.lava.Lava = function (bufferGeometry) {
    let level = utils.getLavaLevel();
    let material = new THREE.ShaderMaterial({
        //params needed for shaders
        uniforms: {
            //timer that 'moves' the waves
            time: {
                type: 'f',
                value: 0.0
            },
            //size in pixel
            level: {
                type: 'f',
                value: level
            }
        },
        vertexShader: document.getElementById('lavaVertShader').textContent,
        fragmentShader: document.getElementById('lavaFragShader').textContent,
    });
    let lava = new THREE.Mesh(bufferGeometry, material);
    lava.receiveShadow = true;
    lava.name = "Lava";
    lava.frustumCulled = false;

    //Animate lava by changing params in shaders
    lava.animate = function () {
        if (params.LavaLevel > 0) {
            material.uniforms['level'].value = utils.getLavaLevel();
            material.uniforms['time'].value = timer * .01;
        }
    };

    //No update is needed since params are updated in animate loop
    lava.update = function () {};

    return lava;
};