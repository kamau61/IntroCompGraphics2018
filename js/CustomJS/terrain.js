window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function (bufferGeometry) {
    let geometry = new THREE.Geometry();
    geometry.fromBufferGeometry(bufferGeometry);
    let material = new THREE.MeshPhongMaterial({
        flatShading: true,
        vertexColors: THREE.FaceColors
    });
    let terrain = new THREE.Mesh(geometry, material);
    terrain.name = "Terrain";
    terrain.castShadow = true;
    terrain.receiveShadow = true;
    terrain.trees = new THREE.Object3D();
    terrain.trees.name = "Trees";
    terrain.trees.castShadow = true;
    terrain.trees.receiveShadow = true;

    terrain.generateTerrain = function () {
        //shapes terrain
        let length, offset;
        let max = params.PlanetRadius * params.TerrainDisplacement / 100;
        for (let vertex of geometry.vertices) {
            if (!vertex.originalPos) {
                vertex.originalPos = new THREE.Vector3(vertex.x, vertex.y, vertex.z);
            }
            length = 0;
            for (let j = 1; j <= params.TerrainDetail; j++) {
                offset = params.TerrainDensity * params.TerrainDisplacement * 0.5 * Math.pow(2, j);
                length += (simplex.noise3d(vertex.originalPos.x * offset, vertex.originalPos.y * offset, vertex.originalPos.z * offset) * max) / Math.pow(2, j);
            }
            vertex.setLength(params.PlanetRadius + length);
        }
        geometry.verticesNeedUpdate = true;
    };

    terrain.calculateFaceValues = function (face) {
        if (!face.position) {
            face.position = new THREE.Vector3();
        }
        face.position.x = (geometry.vertices[face.a].x +
            geometry.vertices[face.b].x +
            geometry.vertices[face.c].x) / 3;
        face.position.y = (geometry.vertices[face.a].y +
            geometry.vertices[face.b].y +
            geometry.vertices[face.c].y) / 3;
        face.position.z = (geometry.vertices[face.a].z +
            geometry.vertices[face.b].z +
            geometry.vertices[face.c].z) / 3;
        face.length = face.position.length();
    };

    terrain.calculateFaceColors = function (face, snowLevel, sandLevel, seabedLevel, forest) {
        if (face.length > snowLevel) {
            face.color.setHex(colors.SnowColor);
        } else if (face.length > sandLevel) {
            if (forest > params.TreeSpread) {
                face.color.setHex(colors.ForestColor);
            } else if (forest > params.GrassSpread) {
                face.color.setHex(colors.GrassColor);
            } else {
                face.color.setHex(colors.SoilColor);
            }
        } else if (face.length > seabedLevel) {
            face.color.setHex(colors.SandColor);
        } else {
            face.color.setHex(colors.SeabedColor);
        }
    };

    terrain.addTree = function (face) {
        face.hasTree = true;
        geometry.elementsNeedUpdate = true;
        let tree = new PLANET.tree.Tree(face);
        tree.remove();
        terrain.trees.add(tree);
        face.treeIndex = terrain.trees.children.length - 1;
    };

    terrain.updateTree = function (face, snowLevel, sandLevel, seabedLevel) {
        let tree = terrain.trees.children[face.treeIndex];
        tree.update(face);
        if (face.length > snowLevel) {
            tree.die();
        } else if (face.length > sandLevel) {
            tree.live();
        } else if (face.length > seabedLevel) {
            tree.die();
        } else {
            tree.remove();
        }
    };

    terrain.generate = function () {
        terrain.generateTerrain();

        let snowLevel = utils.getSnowLevel();
        let sandLevel = utils.getSandLevel();
        let seabedLevel = utils.getSeabedLevel();

        for (let face of geometry.faces) {
            terrain.calculateFaceValues(face);
            let forest = simplex.noise3d(
                face.position.x * params.ForestDensity,
                face.position.y * params.ForestDensity,
                face.position.z * params.ForestDensity);
            if (forest > params.TreeSpread) {
                terrain.addTree(face);
            }
            terrain.calculateFaceColors(face, snowLevel, sandLevel, seabedLevel, forest);
            if (face.hasTree) {
                terrain.updateTree(face, snowLevel, sandLevel, seabedLevel);
            }
        }
        geometry.colorsNeedUpdate = true;
        this.add(terrain.trees);

    };

    terrain.update = function () {
        terrain.generateTerrain();
        //support update of levels and colors
        let snowLevel = utils.getSnowLevel();
        let sandLevel = utils.getSandLevel();
        let seabedLevel = utils.getSeabedLevel();
        for (let face of geometry.faces) {
            terrain.calculateFaceValues(face);
            let forest = simplex.noise3d(
                face.position.x * params.ForestDensity,
                face.position.y * params.ForestDensity,
                face.position.z * params.ForestDensity);
            terrain.calculateFaceColors(face, snowLevel, sandLevel, seabedLevel, forest);
            if (face.hasTree) {
                terrain.updateTree(face, snowLevel, sandLevel, seabedLevel);
            }
        }
        geometry.colorsNeedUpdate = true;

        for (let tree of this.trees.children) {
            for (let status of tree.children) {
                for (let material of status.material) {
                    if (material.name === "Trunk") {
                        material.color.setHex(colors.TrunkColor);
                    } else {
                        material.color.setHex(colors.LeafColor);
                    }
                }
            }
        }
    };
    terrain.generate();
    return terrain;
};

PLANET.terrain.modifyTerrain = function (event) {
    let mouse = new THREE.Vector2;
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects);
    if (intersects.length > 0) {
        for (let object of intersects) {
            if (object.object.name === "Terrain") {
                let terrainGeometry = object.object.geometry;
                console.log(object);
                terrainGeometry.faces[object.faceIndex].color = new THREE.Color(1, 0, 0);
            }
        }
    }
};