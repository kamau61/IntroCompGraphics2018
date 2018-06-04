window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};

var sunLight = new THREE.DirectionalLight(0xffffff, 1);
var moonLight = new THREE.DirectionalLight(0xeeeeff, 0.2);
var starLight = new THREE.AmbientLight(0x7f7f7f, 0.2);
var stars = [];
var clock = new THREE.Clock();
var distance = 10000;
var starRotation = 0;

sunLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(100, 1));
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.castShadow = true;

var effectController  = {
  turbidity: 1,
	rayleigh: 0,
	mieCoefficient: 0.005,
	mieDirectionalG: 0.8,
	luminance: 1,
	inclination: 0.49,
	azimuth: 0.25,
	sun: true
};

PLANET.lighting.update = function () {
	var uniforms = sky.material.uniforms;

  //UNUSED IN CONTROLS
	uniforms.turbidity.value = effectController.turbidity;
	uniforms.rayleigh.value = effectController.rayleigh;

  //USED IN CONTROLS
	uniforms.luminance.value = effectController.luminance;
	uniforms.mieCoefficient.value = effectController.mieCoefficient;
	uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
	var theta = Math.PI * ( effectController.inclination - 0.5 );
  sunSphere.position.x = distance * Math.sin( theta );
  sunSphere.position.y = 0;
  sunSphere.position.z = distance * Math.cos( theta );
	sunSphere.visible = effectController.sun;
	uniforms.sunPosition.value.copy( sunSphere.position );
};

PLANET.lighting.Lighting = function () {
    THREE.Object3D.call(this);

    function initSky() {
      sky = new THREE.Sky();
      sky.scale.setScalar( distance );
      scene.add( sky );

      sunSphere = new THREE.Mesh(
					new THREE.IcosahedronBufferGeometry( 500, 1 ),
					new THREE.MeshBasicMaterial( { color: 0xffff7f } )
				);

        moonSphere = new THREE.Mesh(
					new THREE.IcosahedronBufferGeometry( 150, 1 ),
					new THREE.MeshBasicMaterial( { color: 0xeeeeee } )
				);

        var mergedGeometry = new THREE.Geometry();
				for ( var i = -distance*2; i < distance*2; i+=150 ) {
					var geometry = new THREE.SphereGeometry( 50, 1 );
					var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0xff00000 - 0xff00000} );
					var x = Math.random() * distance * 2 - distance;
          var y = i;
					var z = Math.random() * distance * 2 - distance;

          if (-distance < x < distance && -distance < y < distance && -distance < z < distance){
            var minVal = Math.min(Math.abs(x),Math.abs(y),Math.abs(z));
            if(Math.abs(x) === minVal){
              if(x < 0){
                x = x - distance;
              }else{
                x = x + distance;
              };
            }
            if(Math.abs(y) === minVal){
              if(y < 0){
                y = y - distance;
              }else{
                y = y + distance;
              };
            }
            if(Math.abs(z) === minVal){
              if(z < 0){
                z = z - distance;
              }else{
                z = z + distance;
              };
            }
          };

          geometry.translate(x, y, z);
					mergedGeometry.merge(geometry);
        };
        var starField = new THREE.Mesh(mergedGeometry, material);

        sunSphere.add(sunLight);
        moonSphere.add(moonLight);
        scene.add(starField);
        scene.add(sunSphere);
        scene.add(moonSphere);
        scene.add(starLight);

    };

    function addShaders(){
      var sunGlow = new THREE.Mesh(
        new THREE.IcosahedronBufferGeometry( 500, 1 ),
        new THREE.ShaderMaterial({
          uniforms:
          {
            "c":   { type: "f", value: 0.5 },
            "p":   { type: "f", value: 4.5 },
            glowColor: { type: "c", value: new THREE.Color(0xffffff) },
            viewVector: { type: "v3", value: camera.position }
          },
          vertexShader: [
            'uniform vec3 viewVector;',
            'uniform float c;',
            'uniform float p;',
            'varying float intensity;',
            'void main() ',
            '{',
              'vec3 vNormal = normalize( normalMatrix * normal );',
	            'vec3 vNormel = normalize( normalMatrix * viewVector );',
	            'intensity = pow( c - dot(vNormal, vNormel), p );',

              'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}',
          ].join('\n'),
          fragmentShader: [
            'uniform vec3 glowColor;',
            'varying float intensity;',
            'void main() ',
            '{',
	             'vec3 glow = glowColor * intensity;',
               'gl_FragColor = vec4( glow, 1.0 );',
            '}',
          ].join('\n'),
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true
        })
      )
      sunGlow.scale.multiplyScalar(1.5);
      sunSphere.add( sunGlow );
    };

    initSky();
    addShaders();
    return this;
};

PLANET.lighting.Lighting.prototype = Object.create(THREE.Object3D.prototype);

PLANET.lighting.animate = function () {
  var r = clock.getElapsedTime() / 10;
  effectController.inclination += 0.01;
  if (effectController.inclination > 1) {
    effectController.inclination = -1;
  };

  if(sunSphere.visible === true){
    starLight.intensity = 0.2;
  }else{
    starLight.intensity = 1;
  };

  moonSphere.position.x = -0.75 * distance * Math.sin( r );
  moonSphere.position.z = -0.75 * distance * Math.cos( r );

  /*for(var i=0; i<stars.length; i++) {
    star = stars[i];
    star.position.x =  distance*20/i * Math.sin( r + i );
    star.position.z =  distance*20/i * Math.cos( r + i );
  }*/
  starRotation += 1;
  //starField.rotateOnAxis(0, 0, 0, starRotation);
  PLANET.lighting.update();
};
