window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};

var effectController  = {
  turbidity: 10,
  rayleigh: 2,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  luminance: 1,
  inclination: 0.49, // elevation / inclination
  azimuth: 0.25, // Facing front,
  sun:  true
};

PLANET.lighting.Lighting = function () {
    THREE.Object3D.call(this);

    this.starLight = new THREE.AmbientLight(0x7f7f7f);
    scene.add(this.starLight);

    /*this.sunLight = new THREE.PointLight(0xffffff, 0.5, 1000);
    this.moonLight = new THREE.PointLight(0xeeeeff, 0.01);
    this.add(this.sunLight);
    this.add(this.moonLight);
    var sunTexture = new THREE.TextureLoader().load('resources/img/solar.jpg')
    var moonTexture = new THREE.TextureLoader().load('resources/img/lunar.jpg')
    var materialLightSun = new THREE.MeshBasicMaterial({
        map: sunTexture,
        color: 0xffaa00,
    });
    var materialLightMoon = new THREE.MeshBasicMaterial({
        map: moonTexture,
        color: 0xeeeeee,
    });

    var sunObj = new THREE.SphereGeometry(5, 8, 8);
    var moonObj = new THREE.SphereGeometry(5, 8, 8);
    this.sun = new THREE.Mesh(sunObj, materialLightSun);
    this.moon = new THREE.Mesh(moonObj, materialLightMoon);
    this.sunLight.add(this.sun);
    this.moonLight.add(this.moon);
    this.sunLight.position.x = 125;
    this.sunLight.position.z = 125;
    this.moonLight.position.x = -100;
    this.moonLight.position.z = -100;

    var sunRadius = 125;
    var moonRadius = 100;

    var texture = new THREE.TextureLoader().load('resources/img/stars.png')
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        color: 0x808080,
    });

    /////////////////////////////////////////////////////
    // STARFIELD				    	                         //
    /////////////////////////////////////////////////////

    var geometry = new THREE.SphereGeometry(290, 32, 32);
    this.starSphere = new THREE.Mesh(geometry, material);
    this.add(this.starSphere);*/

    function initSky() {
				// Add Sky
				sky = new THREE.Sky();
				sky.scale.setScalar( 450000 ); //Set sky box size
				scene.add( sky );
				// Add Sun Helper
				sunSphere = new THREE.Mesh(
					new THREE.IcosahedronBufferGeometry( 500, 1 ),
					new THREE.MeshBasicMaterial( { color: 0xffff7f } )
				);
				sunSphere.position.y = - 10000;
				sunSphere.visible = true;
				scene.add( sunSphere );
				/// GUI


				var gui = new dat.GUI();
				gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
				gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
				gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
				gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
				gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
				gui.add( effectController, "inclination", -1, 1, 0.0001 ).onChange( guiChanged );
				gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
				gui.add( effectController, "sun" ).onChange( guiChanged );
				guiChanged();
			}

      initSky();

    return this;
};

PLANET.lighting.Lighting.prototype = Object.create(THREE.Object3D.prototype);


function guiChanged() {
  var distance = 10000;

  var uniforms = sky.material.uniforms;
  uniforms.turbidity.value = effectController.turbidity;
  uniforms.rayleigh.value = effectController.rayleigh;
  uniforms.luminance.value = effectController.luminance;
  uniforms.mieCoefficient.value = effectController.mieCoefficient;
  uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
  var theta = Math.PI * ( effectController.inclination - 0.5 );
  var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
  sunSphere.position.x = distance * Math.cos( phi );
  sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
  sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
  sunSphere.visible = effectController.sun;
  uniforms.sunPosition.value.copy( sunSphere.position );
  renderer.render( scene, camera );
}


/////////////////////////////////////////////////////
// RENDER LOOP                                     //
/////////////////////////////////////////////////////

PLANET.lighting.animate = function () {
  effectController.inclination += 0.01;
  if (effectController.inclination > 1) {
    effectController.inclination = -1;
  }
  guiChanged();
  //this.sunLight.position.x = sunRadius * Math.cos(timer);
  //this.sunLight.position.z = sunRadius * Math.sin(timer);
  //this.moonLight.position.x = moonRadius * -Math.cos(timer);
  //this.moonLight.position.z = moonRadius * -Math.sin(timer);

  //theta = ((Math.atan2(camera.position.x - this.sunLight.position.x, camera.position.z - this.sunLight.position.z) * 180 / Math.PI) + 180)%360;
};
