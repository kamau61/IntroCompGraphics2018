window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function(bufferGeometry) {
    THREE.Object3D.call(this);
    this.name = "Planet";
    simplex = new SimplexNoise();
    this.climate = PLANET.climate.Climate();
    this.ocean = PLANET.ocean.Ocean(bufferGeometry);
    this.add(this.ocean);
    this.terrain = PLANET.terrain.Terrain(bufferGeometry);
    this.terrain.generate();
    this.add(this.terrain);
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