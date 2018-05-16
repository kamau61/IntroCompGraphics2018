window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};

PLANET.lighting.Lighting = function () {
    //Used in StarSphere and SkySphere
    var currentPhase = 0;
    var nextPhase = 1;
    var boundary = 80;

    const phase = {
        0: {r: 130, g: 229, b: 255, pos: 360, light: new THREE.AmbientLight(0x82e5ff, 0.5)},
        1: {r: 191, g: 74, b: 177, pos: 270, light: new THREE.AmbientLight(0xbf4ab1, 0.5)},
        2: {r: 0, g: 0, b: 0, pos: 180, light: new THREE.AmbientLight(0x181d38, 0.5)},
        3: {r: 191, g: 74, b: 177, pos: 90, light: new THREE.AmbientLight(0xbf4ab1, 0.5)},
        4: {r: 130, g: 229, b: 255, pos: 0, light: new THREE.AmbientLight(0x82e5ff, 0.5)}
    };

    /////////////////////////////////////////////////////
    // LIGHTING AND MESHES                             //
    /////////////////////////////////////////////////////

    //EARTH
    var geometrySphere = new THREE.SphereGeometry(8, 100);
    var materialSphere = new THREE.MeshLambertMaterial({color: 0x7fb0ff});
    var sphere = new THREE.Mesh(geometrySphere, materialSphere);
    scene.add(sphere);

    //STARLIGHT
    //this.starLight = new THREE.AmbientLight(0x25105c);
    //scene.add(this.starLight);
    for (var i = 0; i < phase.count; i++) {
        scene.add(phase[i].light);
        phase[i].visible = false;
    }

    this.sunLight = new THREE.PointLight(0xffffff, 0.5, 1000);
    this.moonLight = new THREE.PointLight(0xeeeeff, 0.01);
    scene.add(this.sunLight);
    scene.add(this.moonLight);

    var sunObj = new THREE.SphereGeometry(100, 8, 8);
    var moonObj = new THREE.SphereGeometry(100, 8, 8);
    var materialLightSun = new THREE.MeshBasicMaterial({color: 0xffaa00});
    var materialLightMoon = new THREE.MeshBasicMaterial({color: 0xeeeeee});
    this.sun = new THREE.Mesh(sunObj, materialLightSun);
    this.moon = new THREE.Mesh(moonObj, materialLightMoon);
    this.sun.scale.set(0.1, 0.1, 0.1);
    this.moon.scale.set(0.01, 0.01, 0.01);
    this.sunLight.add(this.sun);
    this.moonLight.add(this.moon);

    /////////////////////////////////////////////////////
    // SKYSPHERE					                             //
    /////////////////////////////////////////////////////

    CreateSky = function () {
        var geometry = new THREE.SphereGeometry(300, 32, 15);

        // GLSL CODE FOR SHADERS
        var shader = {
            //Uniforms: Parameters that can be passed into the program
            uniforms: {
                skyColor: {type: "c", value: new THREE.Color()},
            },
            //Can add vertexShader here if added later
            fragmentShader: [
                'uniform vec3 skyColor;',
                'void main() {',
                //gl_fragColor = vec4( Red, Green, Blue, Alpha)
                '	gl_FragColor = vec4(skyColor, 1.0 );',
                '}',
            ].join('\n'),
        };

        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        var material = new THREE.ShaderMaterial({
            //Colour the skybox
            fragmentShader: shader.fragmentShader,
            //Parameters that are passed into the shader program
            uniforms: uniforms,
            //Render the colour of the inside of the sky sphere
            side: THREE.BackSide
        });

        var skySphere = new THREE.Mesh(geometry, material);
        this.object3d = skySphere;
        scene.add(skySphere);

        var startValue;
        var endValue;
        var stepNum;
        var lastStep;

        function interpolate(startValue, endValue, stepNum, lastStep) {
            return (endValue - startValue) * stepNum / lastStep + startValue;
        }

        var LightsOff = function () {
            for (var i = 0; i < phase.count; i++) {
                phase[i].visible = false;
            }
        };

        CreateSky.update = function () {
            if (theta < phase[nextPhase].pos) {
                currentPhase = nextPhase;
                switch (currentPhase)
                {
                    case 0:
                        nextPhase = 1;
                        LightsOff();
                        phase[currentPhase].light.visible = true;
                        break;
                    case 1:
                        nextPhase = 2;
                        LightsOff();
                        phase[currentPhase].light.visible = true;
                        break;
                    case 2:
                        nextPhase = 3;
                        LightsOff();
                        phase[currentPhase].light.visible = true;
                        break;
                    case 3:
                        nextPhase = 4;
                        LightsOff();
                        phase[currentPhase].light.visible = true;
                        break;
                    case 4:
                        currentPhase = 0;
                        LightsOff();
                        phase[currentPhase].light.visible = true;
                        break;
                }
            }

            var r = Math.round(interpolate(phase[currentPhase].r, phase[nextPhase].r, theta, boundary));
            var g = Math.round(interpolate(phase[currentPhase].g, phase[nextPhase].g, theta, boundary));
            var b = Math.round(interpolate(phase[currentPhase].b, phase[nextPhase].b, theta, boundary));
            if (r < 0) {
                r = 0;
            }
            ;
            if (g < 0) {
                g = 0;
            }
            ;
            if (b < 0) {
                b = 0;
            }
            ;

            uniforms.skyColor.value.set("rgb(" + r + "," + g + "," + b + ")");

        };
    };

    var sky = new CreateSky();
    scene.add(sky.object3d);

    /////////////////////////////////////////////////////
    // STARFIELD				    	                         //
    /////////////////////////////////////////////////////

    CreateStarfield = function () {
        var texture = new THREE.TextureLoader().load('resources/img/stars.png')
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            color: 0x808080,
        });

        var geometry = new THREE.SphereGeometry(290, 32, 32);
        var starSphere = new THREE.Mesh(geometry, material);
        this.object3d = starSphere;
        scene.add(starSphere);

        CreateStarfield.update = function () {
            if (currentPhase != 0) {
                starSphere.visible = false;
            } else {
                starSphere.visible = true;
            }
            ;

        };
    };

    var stars = new CreateStarfield();
    scene.add(stars.object3d);

    var clock = new THREE.Clock();
    var sunRadius = 75;
    var moonRadius = 60;
    var theta = 0;
};


/////////////////////////////////////////////////////
// RENDER LOOP                                     //
/////////////////////////////////////////////////////

PLANET.lighting.animate = function () {
  // Rotation of sun and moon
  var r = clock.getElapsedTime() * 0.5;
  sunLight.position.x = sunRadius * Math.cos(r);
  sunLight.position.z = sunRadius * Math.sin(r);
  moonLight.position.x = moonRadius * -Math.cos(r);
  moonLight.position.z = moonRadius * -Math.sin(r);

   theta = ((Math.atan2(camera.position.x - sunLight.position.x, camera.position.z - sunLight.position.z) * 180 / Math.PI) + 180)%360;
  //theta = ((Math.atan2(camera.position.z, camera.position.x) - Math.atan2(sunLight.position.z, sunLight.position.x)) + 2 * Math.PI % (2 * Math.PI))/Math.PI * 180;
  //console.log(theta);

  CreateSky.update();
  CreateStarfield.update();
};
