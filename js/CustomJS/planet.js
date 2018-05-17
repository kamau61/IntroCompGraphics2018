window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function () {
    THREE.Object3D.call(this);
    simplex = new SimplexNoise();
    this.name = 'Planet';
    let baseGeometry = new THREE.IcosahedronGeometry(params.PlanetRadius, params.PlanetDetail);
    let terrain = PLANET.terrain.Terrain(baseGeometry);
    this.add(terrain);
    terrain.generate();
    let ocean = PLANET.ocean.Ocean(baseGeometry);
    this.add(ocean);
    this.animate = function () {
        ocean.animate();
    };
    this.update = function () {
        terrain.update();
        ocean.update();
    };
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);

PLANET.planet.update = function () {
    PLANET.terrain.update();
    PLANET.ocean.update();
};