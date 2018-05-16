window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function() {
    THREE.Object3D.call(this);
    simplex = new SimplexNoise();
    this.name = 'planet';
    this.baseGeometry = new THREE.IcosahedronGeometry(params.PlanetRadius, params.PlanetDetail);
    this.baseGeometry.needsUpdate = true;
    this.baseGeometry.verticesNeedUpdate = true;
    this.add(PLANET.terrain.Terrain(this.baseGeometry));
    this.add(PLANET.ocean.Ocean(this.baseGeometry));
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);

PLANET.planet.update = function () {
    PLANET.terrain.update();
    PLANET.ocean.update();
};

PLANET.planet.animate = function() {
    PLANET.ocean.animate();
};