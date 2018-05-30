window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function(bufferGeometry) {
    THREE.Object3D.call(this);
    simplex = new SimplexNoise();
    this.add(PLANET.ocean.Ocean(bufferGeometry));
    this.add(PLANET.terrain.Terrain(bufferGeometry));
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);

PLANET.planet.update = function () {
    PLANET.terrain.update();
    PLANET.ocean.update();
};

PLANET.planet.animate = function() {
    PLANET.ocean.animate();
};