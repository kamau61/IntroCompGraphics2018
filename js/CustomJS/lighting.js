window.PLANET = window.PLANET || {};
PLANET.lighting = PLANET.lighting || {};


var sunLight = new THREE.DirectionalLight(0xffffff, 1);
var moonLight = new THREE.PointLight(0xeeeeff, 0.01);
var starLight = new THREE.AmbientLight(0x7f7f7f, 0.2);
var clock = new THREE.Clock();

sunLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(100, 1));
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.castShadow = true;

PLANET.lighting.Lighting = function () {
    THREE.Object3D.call(this);

    function initSky() {
      
        sunSphere = new THREE.Mesh(
					new THREE.IcosahedronBufferGeometry( 500, 1 ),
					new THREE.MeshBasicMaterial( { color: 0xffff7f } )
				);

        var moonTexture = new THREE.TextureLoader().load('resources/img/lunar.jpg');
        moonSphere = new THREE.Mesh(
					new THREE.IcosahedronBufferGeometry( 150, 1 ),
					new THREE.MeshBasicMaterial( { map: moonTexture, color: 0xeeeeee } )
				);

        var starTexture = new THREE.TextureLoader().load('resources/img/stars.png');
        starBox = new THREE.Mesh(
					new THREE.BoxGeometry( 400, 400, 400 ),
					new THREE.MeshBasicMaterial( { map: starTexture, side: THREE.BackSide } )
				);

        sunSphere.add(sunLight);
        moonSphere.add(moonLight);
        scene.add( sunSphere );
        scene.add( moonSphere );
        scene.add( starBox );
        scene.add( starLight );

      }
    initSky();
    return this;
};

PLANET.lighting.update = function () {
  //action here
}

PLANET.lighting.Lighting.prototype = Object.create(THREE.Object3D.prototype);

PLANET.lighting.animate = function () {
  var r = clock.getElapsedTime();
  var distance = 10000;
  sunSphere.position.x = distance * Math.sin( r );
  sunSphere.position.z = distance * Math.cos( r );
  moonSphere.position.x = -0.75 * distance * Math.sin( r );
  moonSphere.position.z = -0.75 * distance * Math.cos( r );
};
