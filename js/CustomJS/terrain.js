window.PLANET = window.PLANET || {};
PLANET.terrain = PLANET.terrain || {};

PLANET.terrain.Terrain = function (base) {
    THREE.Object3D.call(this);
    let geometry = base.clone();
    let material = new THREE.MeshPhongMaterial({
        wireframe: params.PlanetWireframe,
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

    terrain.generate = function () {

        //shapes terrain
        let length, offset;
        let max = params.PlanetRadius * params.TerrainDisplacement;
        for (let vertex of geometry.vertices) {
            length = 0;
            for (let j = 1; j <= params.TerrainDetail; j++) {
                offset = params.TerrainDensity * params.TerrainDisplacement * Math.pow(2, j);
                length += (simplex.noise3d(vertex.x * offset, vertex.y * offset, vertex.z * offset) * max) / Math.pow(2, j);
            }
            vertex.setLength(params.PlanetRadius + length);
        }
        geometry.verticesNeedUpdate = true;
        console.log("before");

        //colors terrain and adds trees
        let position = new THREE.Vector3();
        let verticesIndex = ['a', 'b', 'c'];
        let vertex, lengthSq;
        let normal = new THREE.Vector3();
        let axis = new THREE.Vector3(0, 0, 1);
        let snowLevel = Math.pow(params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel)), 2);
        let beachLevel = Math.pow(params.WaterLevel + params.BeachLevel * params.TerrainDisplacement * params.PlanetRadius, 2);
        let seabedLevel = Math.pow(params.WaterLevel - params.WaveHeight * 10, 2);
        for (let face of geometry.faces) {
            //gets center from vertices
            position.set(0, 0, 0);
            for (let i of verticesIndex) {
                vertex = geometry.vertices[face[i]];
                position.x += vertex.x;
                position.y += vertex.y;
                position.z += vertex.z;
            }
            position.x /= verticesIndex.length;
            position.y /= verticesIndex.length;
            position.z /= verticesIndex.length;
            face.position = position.clone();
            lengthSq = position.lengthSq();
            face.lengthSq = lengthSq;

            //colors face
            if (lengthSq > snowLevel) {
                face.color.setHex(params.SnowColor);
            } else if (lengthSq > beachLevel) {
                // creates tree
                let forest = simplex.noise3d(
                    face.position.x * params.ForestDensity,
                    face.position.y * params.ForestDensity,
                    face.position.z * params.ForestDensity);
                if (forest > params.ForestTree) {
                    let tree = res.Trees[Math.floor(Math.random() * res.Trees.length)].clone();
                    normal.subVectors(face.position, new THREE.Vector3(0, 0, 0)).normalize();
                    tree.quaternion.setFromUnitVectors(axis, face.position.clone().normalize());
                    tree.position.set(face.position.x, face.position.y, face.position.z);
                    tree.face = geometry.faces.indexOf(face);
                    terrain.trees.add(tree);
                    face.tree = terrain.trees.children.indexOf(tree);
                    face.color.setHex(params.ForestColor);
                } else if (forest > params.ForestGrass) {
                    face.color.setHex(params.GrassColor);
                } else {
                    face.color.setHex(params.SoilColor);
                }
            } else if (lengthSq > seabedLevel) {
                face.color.setHex(params.SandColor);
            } else {
                face.color.setHex(params.SeabedColor);
            }
        }
        geometry.colorsNeedUpdate = true;
        scene.add(terrain.trees);
        console.log("after");

    };

    terrain.update = function () {

    };

    return terrain;
};

PLANET.terrain.Terrain.prototype = Object.create(THREE.Object3D.prototype);

PLANET.terrain.update = function () {
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
    this.terrain.geometry.elementsNeedUpdate = true;
    this.terrain.geometry.computeVertexNormals();
};