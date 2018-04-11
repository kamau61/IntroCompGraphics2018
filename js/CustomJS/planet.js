window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function() {
    THREE.Object3D.call(this);
    this.add(PLANET.terrain.Terrain());
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);

PLANET.planet.update = function () {
    PLANET.terrain.update();
}