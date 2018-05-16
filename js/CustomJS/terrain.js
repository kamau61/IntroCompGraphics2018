window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function (base) {
    THREE.Object3D.call(this);
    var geometry = base.clone();
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
    PLANET.terrain.colorTerrain(geometry);
};

PLANET.terrain.colorTerrain = function (geometry) {
    var face, vertex, verticesIndex = ['a', 'b', 'c'],
        position = new THREE.Vector3();
    for (var i = 0; i < geometry.faces.length; i++) {
        face = geometry.faces[i];
        position.set(0, 0, 0);
        for (var j = 0; j < verticesIndex.length; j++) {
            vertex = geometry.vertices[face[verticesIndex[j]]];
            position.x += vertex.x;
            position.y += vertex.y;
            position.z += vertex.z;
        }
        position.x /= verticesIndex.length;
        position.y /= verticesIndex.length;
        position.z /= verticesIndex.length;
        face.position = position;
        if (position.lengthSq() > Math.pow(params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel)), 2)) {
            face.color.setHex(params.SnowColor);
        } else if (position.lengthSq() > Math.pow(params.WaterLevel + params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius, 2)) {
            face.color.setHex(params.TerrainColor);
        } else if (position.lengthSq() > Math.pow(params.WaterLevel - params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius, 2)) {
            face.color.setHex(params.BeachColor);
        } else {
            face.color.setHex(params.CoralColor);
        }
    }
    PLANET.terrain.loadTrees(geometry);
};

PLANET.terrain.loadTrees = function (geometry) {
    var loader = new THREE.FBXLoader();
    loader.load('trees.fbx', function (object) {
        var baseTrees = [];
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.scale.set(0.02, 0.02, 0.02);
                // child.scale.set(0.05, 0.05, 0.05);
                child.position.set(0, 0, 0);
                baseTrees.push(child);
            }
        });
        console.log("before");
        for (var i = 0; i < geometry.faces.length; i++) {
            // position = geometry.faces[i].position;
            // if(position.lengthSq() < Math.pow(params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel)), 2) &&
            //     position.lengthSq() > Math.pow(params.WaterLevel + params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius, 2)) {
            if (Math.random() > 0.99) {
                var face = geometry.faces[i];
                face.color.setHex(0x0b44545);
                geometry.elementsNeedUpdate = true;
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

                var averagePos = getAveragePos(face);
                var normal = new THREE.Vector3();
                normal.sub(averagePos, new THREE.Vector3(0, 0, 0)).normalize();
                var up = new THREE.Vector3(0, 1, 0);
                var tree = baseTrees[7].clone();
                var axis = new THREE.Vector3(0, 0, 1);
                tree.quaternion.setFromUnitVectors(axis, averagePos.clone().normalize());
                tree.position.set(averagePos.x, averagePos.y, averagePos.z);
                scene.add(tree);
            }
        }
        geometry.elementsNeedUpdate = true;
        console.log("after");
        console.log(scene);
    });
};

PLANET.terrain.update = function () {
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
    this.terrain.geometry.elementsNeedUpdate = true;
    this.terrain.geometry.computeVertexNormals();
};