window.PLANET = window.PLANET || {};
PLANET.planet = PLANET.planet || {};

PLANET.planet.Planet = function () {
    THREE.Object3D.call(this);
    // simplex = new SimplexNoise();
    this.baseGeometry = new THREE.IcosahedronGeometry(params.PlanetRadius, params.PlanetDetail);
    // this.baseGeometry.needsUpdate = true;
    // this.baseGeometry.verticesNeedUpdate = true;
    // this.add(PLANET.terrain.Terrain(this.baseGeometry.clone()));
    // this.add(PLANET.ocean.Ocean(this.baseGeometry.clone()));
    PLANET.planet.createClouds();
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);

PLANET.planet.update = function () {
    // PLANET.terrain.update();
    // PLANET.ocean.update();
    for (var i = 0; i < this.clouds.length; i++) {
        this.clouds[i].update();
    }
};

PLANET.planet.animate = function () {
    // PLANET.ocean.animate();
};

PLANET.planet.createClouds = function () {
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('Resources/models/');

    this.cloudModels = [];

    var loadClouds = function () {
        var index = 0;
        var objFiles = ['Cloud_1.obj', 'Cloud_2.obj', 'Cloud_3.obj', 'Cloud_4.obj'];

        function loadNextFile() {
            objLoader.load(objFiles[index], function (geometry) {
                this.PLANET.planet.cloudModels.push(geometry);
                index++;
                loadNextFile();
            });

        }
        for (index = 0; index < objFiles.length; index++) {
            loadNextFile();
        }
    };

    loadClouds();

    this.clouds = [];
    for (var i = 0; i < params.CloudCount; i++) {
        var geometry = this.cloudModels[0];
        var cloud = new PLANET.cloud.Cloud(geometry);
        this.clouds.push(cloud);
        this.add(cloud);
    }
}