window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function () {
    THREE.Object3D.call(this);
    simplex = new SimplexNoise();
    this.name = 'Planet';
    let baseGeometry = new THREE.IcosahedronGeometry(params.PlanetRadius, params.PlanetDetail);
    this.climate = PLANET.climate.Climate();
    this.terrain = PLANET.terrain.Terrain(baseGeometry);
    this.add(this.terrain);
    this.terrain.generate();
    this.ocean = PLANET.ocean.Ocean(baseGeometry);
    this.add(this.ocean);
    this.animate = function () {
        this.ocean.animate();
        // this.climate.animate();
    };
    this.update = function () {
        this.terrain.update();
        this.ocean.update();
    };
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);