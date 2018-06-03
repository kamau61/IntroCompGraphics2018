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

    let treeGeo = new THREE.InstancedBufferGeometry().copy(res.TreesGeometry[1]);
    let mcol0 = new THREE.InstancedBufferAttribute(new Float32Array(params.TreeCount * 3), 3, 1);
    let mcol1 = new THREE.InstancedBufferAttribute(new Float32Array(params.TreeCount * 3), 3, 1);
    let mcol2 = new THREE.InstancedBufferAttribute(new Float32Array(params.TreeCount * 3), 3, 1);
    let mcol3 = new THREE.InstancedBufferAttribute(new Float32Array(params.TreeCount * 3), 3, 1);
    let treeColors = new THREE.InstancedBufferAttribute(new Float32Array(params.TreeCount * 3), 3, 1);
    let treeLights = new THREE.InstancedBufferAttribute(new Float32Array(params.TreeCount * 3), 3, 1);

    let treeCount = 0;

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
        let matrix = terrain.calculateMatrix(face.position);
        let me = matrix.elements;
        mcol0.setXYZ(treeCount, me[0], me[1], me[2]);
        mcol1.setXYZ(treeCount, me[4], me[5], me[6]);
        mcol2.setXYZ(treeCount, me[8], me[9], me[10]);
        mcol3.setXYZ(treeCount, me[12], me[13], me[14]);

        let color = new THREE.Color();
        color.setHex(colorSchemes[params.Color].LeafColor);
        treeColors.setXYZ(treeCount, color.r, color.g, color.b);

        treeLights.setXYZ(treeCount, sunSphere.position.x, sunSphere.position.y, sunSphere.position.z);

        face.treeIndex = treeCount;

        treeCount++;
    };

    terrain.calculateMatrix = function (facePos) {
        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        let matrix = new THREE.Matrix4();
        position.x = facePos.x;
        position.y = facePos.y;
        position.z = facePos.z;
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), facePos.clone().normalize());

        scale.x = scale.y = scale.z = params.TreeScale * (Math.random() * (1 - 0.5 + 1) + 0.5);
        matrix.compose(position, quaternion, scale);
        return matrix;
    };

    terrain.getTreeMatrix = function (face) {
        let matrix = new THREE.Matrix4();
        matrix.set(
            treeMesh.geometry.attributes.mcol0.getX(face.treeIndex),
            treeMesh.geometry.attributes.mcol0.getY(face.treeIndex),
            treeMesh.geometry.attributes.mcol0.getZ(face.treeIndex),
            0,
            treeMesh.geometry.attributes.mcol1.getX(face.treeIndex),
            treeMesh.geometry.attributes.mcol1.getY(face.treeIndex),
            treeMesh.geometry.attributes.mcol1.getZ(face.treeIndex),
            0,
            treeMesh.geometry.attributes.mcol2.getX(face.treeIndex),
            treeMesh.geometry.attributes.mcol2.getY(face.treeIndex),
            treeMesh.geometry.attributes.mcol2.getZ(face.treeIndex),
            0,
            treeMesh.geometry.attributes.mcol3.getX(face.treeIndex),
            treeMesh.geometry.attributes.mcol3.getY(face.treeIndex),
            treeMesh.geometry.attributes.mcol3.getZ(face.treeIndex),
            0,);
        return matrix;
    };

    let mat = new THREE.RawShaderMaterial({
        uniforms: {},
        vertexShader: document.getElementById('vertInstanced').textContent,
        fragmentShader: document.getElementById('fragInstanced').textContent,
        transparent: false
    });
    treeGeo.addAttribute('mcol0', mcol0);
    treeGeo.addAttribute('mcol1', mcol1);
    treeGeo.addAttribute('mcol2', mcol2);
    treeGeo.addAttribute('mcol3', mcol3);
    treeGeo.addAttribute('color', treeColors);
    treeGeo.addAttribute('light', treeLights);
    console.log(treeGeo);
    let treeMesh = new THREE.Mesh(treeGeo, mat);
    // treeMesh.castShadow = true;
    // treeMesh.receiveShadow = true;
    terrain.add(treeMesh);

    terrain.updateTree = function (face, snowLevel, sandLevel) {
        let matrix = terrain.getTreeMatrix(face);
        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        matrix.decompose(position, quaternion, scale);
        if (face.length < snowLevel && face.length > sandLevel) {
            position = face.position;
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.position.clone().normalize());
        } else {
            position = new THREE.Vector3(0, 0, 0);
        }
        matrix.compose(position, quaternion, scale);
        let me = matrix.elements;
        treeMesh.geometry.attributes.mcol0.setXYZ(face.treeIndex, me[0], me[1], me[2]);
        treeMesh.geometry.attributes.mcol1.setXYZ(face.treeIndex, me[4], me[5], me[6]);
        treeMesh.geometry.attributes.mcol2.setXYZ(face.treeIndex, me[8], me[9], me[10]);
        treeMesh.geometry.attributes.mcol3.setXYZ(face.treeIndex, me[12], me[13], me[14]);
        treeMesh.geometry.attributes.mcol0.needsUpdate = true;
        treeMesh.geometry.attributes.mcol1.needsUpdate = true;
        treeMesh.geometry.attributes.mcol2.needsUpdate = true;
        treeMesh.geometry.attributes.mcol3.needsUpdate = true;

        // face.color.setHex(0xff0000);
    };

    terrain.generate = function () {
        terrain.generateTerrain();
        terrain.update();
        for (let i = 0; i < params.TreeCount; i++) {
            let face = geometry.faces[Math.floor(Math.random() * geometry.faces.length)];
            if (face.hasTree === true) {
                i--;
            } else {
                face.hasTree = true;
                terrain.addTree(face);
            }
        }
    };

    terrain.update = function () {
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
            if (face.hasTree === true) {
                terrain.updateTree(face, snowLevel, sandLevel);
            }
        }
        geometry.colorsNeedUpdate = true;

    };

    terrain.animate = function () {
        for (let i = 0; i < params.TreeCount; i++) {
            treeMesh.geometry.attributes.light.setXYZ(i, sunSphere.position.x, sunSphere.position.y, sunSphere.position.z);
            treeMesh.geometry.attributes.light.needsUpdate = true;
        }
    };

    terrain.modifyTerrain = function (event) {

        let mouse = new THREE.Vector2;
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            for (let object of intersects) {
                if (object.object.name === "Terrain") {
                    let terrainGeometry = object.object.geometry;
                    console.log(object);
                    let face = terrainGeometry.faces[object.faceIndex];

                    function movePoint(vertex) {
                        let direction = vertex.clone().normalize();
                        vertex.addScaledVector(direction, 0.5);
                        if (vertex.length() >= params.PlanetRadius * (1 + (params.TerrainDisplacement / 100))) {
                            vertex.setLength(params.PlanetRadius * (1 + (params.TerrainDisplacement / 100)));
                        }
                    }

                    movePoint(terrainGeometry.vertices[face.a]);
                    movePoint(terrainGeometry.vertices[face.b]);
                    movePoint(terrainGeometry.vertices[face.c]);
                    terrainGeometry.verticesNeedUpdate = true;
                    terrain.update();
                    console.log(object);
                }
            }
        }
    };

    terrain.generate();
    return terrain;
};
