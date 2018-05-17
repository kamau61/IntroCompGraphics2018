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
        let snowLevel = Math.pow(params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel)), 2);
        let beachLevel = Math.pow(params.WaterLevel + params.SandLevel * params.TerrainDisplacement * params.PlanetRadius, 2);
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
                face.color.setHex(colors.SnowColor);
            } else if (lengthSq > beachLevel) {
                // creates tree
                let forest = simplex.noise3d(
                    face.position.x * params.ForestDensity,
                    face.position.y * params.ForestDensity,
                    face.position.z * params.ForestDensity);
                if (forest > params.TreeSpread) {
                    let tree = PLANET.tree.Tree(face);
                    terrain.trees.add(tree);
                    face.tree = terrain.trees.children.indexOf(tree);
                    face.color.setHex(colors.ForestColor);
                } else if (forest > params.GrassSpread) {
                    face.color.setHex(colors.GrassColor);
                } else {
                    face.color.setHex(colors.SoilColor);
                }
            } else if (lengthSq > seabedLevel) {
                face.color.setHex(colors.SandColor);
            } else {
                face.color.setHex(colors.SeabedColor);
            }
        }
        geometry.colorsNeedUpdate = true;
        scene.add(terrain.trees);
        console.log("after");

    };

    terrain.update = function () {
        //support update of levels and colors
        let snowLevel = Math.pow(params.PlanetRadius * (1 + params.TerrainDisplacement * (1 - params.SnowLevel)), 2);
        let sandLevel = Math.pow(params.WaterLevel + params.SandLevel * params.TerrainDisplacement * params.PlanetRadius, 2);
        let seabedLevel = Math.pow(params.WaterLevel - params.WaveHeight * 10, 2);
        for (let face of geometry.faces) {
            if (face.lengthSq > snowLevel) {
                face.color.setHex(colors.SnowColor);
                if (face.tree) {
                    this.trees.children[face.tree].die();
                }
            } else if (face.lengthSq > sandLevel) {
                // creates tree
                let forest = simplex.noise3d(
                    face.position.x * params.ForestDensity,
                    face.position.y * params.ForestDensity,
                    face.position.z * params.ForestDensity);
                if (forest > params.TreeSpread) {
                    face.color.setHex(colors.ForestColor);
                } else if (forest > params.GrassSpread) {
                    face.color.setHex(colors.GrassColor);
                } else {
                    face.color.setHex(colors.SoilColor);
                }
                if (face.tree) {
                    this.trees.children[face.tree].live();
                }
            } else if (face.lengthSq > seabedLevel) {
                face.color.setHex(colors.SandColor);
                if (face.tree) {
                    this.trees.children[face.tree].die();
                }
            } else {
                face.color.setHex(colors.SeabedColor);
            }
        }
        geometry.colorsNeedUpdate = true;
        for (let tree of this.trees.children) {
            for (let stage of tree.children) {
                for (let material of stage.material) {
                    if (material.name === "Trunk") {
                        material.color.setHex(colors.TrunkColor);
                    } else {
                        material.color.setHex(colors.LeafColor);
                    }
                }
            }
        }
    };

    return terrain;
};

PLANET.terrain.Terrain.prototype = Object.create(THREE.Object3D.prototype);

PLANET.terrain.update = function () {
    PLANET.terrain.displaceTerrain(this.terrain.geometry);
    this.terrain.geometry.elementsNeedUpdate = true;
    this.terrain.geometry.computeVertexNormals();
};