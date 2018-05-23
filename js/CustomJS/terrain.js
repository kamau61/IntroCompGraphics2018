window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function (bufferGeometry) {
    THREE.Object3D.call(this);
    var geometry = new THREE.Geometry();
    geometry.fromBufferGeometry(bufferGeometry);

    this.min = 20000;
    this.max = 0;

    this.trees = [];
    PLANET.terrain.loadTrees(geometry);

    var material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
        flatShading: params.PlanetFlatShading,
        vertexColors: THREE.FaceColors
    });
    PLANET.terrain.displaceTerrain(geometry);
    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.castShadow = true;
    this.terrain.receiveShadow = true;
    this.terrain.name = "Terrain";

    console.log(this.min);
    console.log(this.max);

    return this.terrain;
};

PLANET.terrain.Terrain.prototype = Object.create(THREE.Object3D.prototype);

PLANET.terrain.displaceTerrain = function (geometry) {
    // 3d simplex noise leveled
    var vertex, length, offset = params.TerrainDensity;
    var max = params.PlanetRadius * params.TerrainDisplacement;
    for (var i = 0; i < geometry.vertices.length; i++) {
        vertex = geometry.vertices[i];
        length = 0;
        for (var j = 1; j <= params.TerrainDetail; j++) {
            offset = params.TerrainDensity * params.TerrainDisplacement * Math.pow(2, j);
            length += (simplex.noise3d(vertex.x * offset, vertex.y * offset, vertex.z * offset) * max) / Math.pow(2, j);
        }
        vertex.setLength(params.PlanetRadius + length);
    }
    geometry.elementsNeedUpdate = true;
    geometry.computeVertexNormals();

    for (var i = 0; i < geometry.faces.length; i++) {
        PLANET.terrain.computeFaceDetails(geometry.faces[i], geometry);
    }
};

PLANET.terrain.computeFaceDetails = function (face, geometry) {


    var getAveragePos = function (face) {
        var midPoint = new THREE.Vector3();
        midPoint.x = (
            geometry.vertices[face.a].x +
            geometry.vertices[face.b].x +
            geometry.vertices[face.c].x) / 3;
        midPoint.y = (
            geometry.vertices[face.a].y +
            geometry.vertices[face.b].y +
            geometry.vertices[face.c].y) / 3;
        midPoint.z = (
            geometry.vertices[face.a].z +
            geometry.vertices[face.b].z +
            geometry.vertices[face.c].z) / 3;
        return midPoint;
    };

    face.position = getAveragePos(face);
    face.offset = Math.sqrt(face.position.lengthSq()) - params.PlanetRadius;
    if (face.offset > this.max) {
        this.max = face.offset;
    }
    if (face.offset < this.min) {
        this.min = face.offset;
    }

    PLANET.terrain.colorTerrain(face);
};

PLANET.terrain.colorTerrain = function (face) {
    // if (face.position > Math.pow(params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel)), 2)) {
    //     face.color.setHex(params.SnowColor);
    // } else if (face.position > Math.pow(params.WaterLevel + params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius, 2)) {
    //     face.color.setHex(params.TerrainColor);
    // } else if (face.position > Math.pow(params.WaterLevel - params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius, 2)) {
    //     face.color.setHex(params.BeachColor);
    // } else {
    //     face.color.setHex(params.CoralColor);
    // }

    if (face.offset > params.SnowLevel) {
        face.color.setHex(params.SnowColor);
    } else if (face.offset > params.MountainLevel) {
        face.color.setHex(params.MountainColor);
    } else if (face.offset > params.BeachLevel) {
        if (Math.random() > 0.05) {
            face.color.setHex(params.TerrainColor);
        } else {
            face.color.setHex(params.ForrestColor);
        }
    } else if (face.offset > 0) {
        face.color.setHex(params.BeachColor)
    } else {
        face.color.setHex(params.WaterColor);
    }

    if (face.hasTree) {
        this.trees[face.treeID].visible = face.offset > params.BeachLevel && face.offset < params.SnowLevel;
        PLANET.terrain.updateTrees(face);
    }
};

PLANET.terrain.loadTrees = function (geometry) {
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i];
        if (Math.random() > 0.99) {
            face.hasTree = true;
            geometry.elementsNeedUpdate = true;

            var tree = baseTrees[1].clone();

            tree.visible = false;

            this.trees.push(tree);
            face.treeID = this.trees.length - 1;

            scene.add(tree);
            geometry.elementsNeedUpdate = true;
        }
    }
};

PLANET.terrain.updateTrees = function (face) {
    var tree = this.trees[face.treeID];
    var axis = new THREE.Vector3(0, 0, 1);
    tree.quaternion.setFromUnitVectors(axis, face.position.clone().normalize());

    tree.position.x = face.position.x;
    tree.position.y = face.position.y;
    tree.position.z = face.position.z;
};

PLANET.terrain.addTree = function (face) {
    var tree = baseTrees[1].clone();

    var axis = new THREE.Vector3(0, 0, 1);
    tree.quaternion.setFromUnitVectors(axis, face.position.clone().normalize());

    tree.position.x = face.position.x;
    tree.position.y = face.position.y;
    tree.position.z = face.position.z;

    tree.name = "tree";

    scene.add(tree);
};

PLANET.terrain.update = function () {
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
    this.terrain.geometry.elementsNeedUpdate = true;
    this.terrain.geometry.computeVertexNormals();
};