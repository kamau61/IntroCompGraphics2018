window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function(bufferGeometry) {
    THREE.Object3D.call(this);
    this.name = "Planet";
    simplex = new SimplexNoise();
    this.ocean = PLANET.ocean.Ocean(bufferGeometry);
    this.add(this.ocean);
    this.terrain = PLANET.terrain.Terrain(bufferGeometry);
    this.add(this.terrain);

    this.climate = PLANET.climate.Climate();
    this.animate = function () {
        this.terrain.animate();
        this.ocean.animate();
    };
    this.update = function () {
        this.terrain.update();
        this.ocean.update();
    };
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);