window.PLANET = window.PLANET || {};
PLANET.tree = PLANET.tree || {};

PLANET.tree.Tree = function () {
    //get random tree
    let style = Math.floor(Math.random() * res.TreesGeometry.length);
    let scale = params.TreeScale * (1 - Math.random());
    let geometry = res.TreesGeometry[style];
    let material = res.TreesMaterials[style];
    let tree = new THREE.Mesh(geometry, material);
    tree.castShadow = true;
    tree.receiveShadow = true;
    tree.isAlive = true;

    tree.update = function(face) {
        utils.alignOnFace(tree, face, scale);
    };

    tree.die = function () {
        tree.isAlive = false;
        tree.visible = true;

        switch (style) {
            case 2:
            case 3:
            case 5:
            case 12:
                tree.geometry = res.DeadTreesGeometry[0];
                tree.material = res.DeadTreesMaterials[0];
                break;
            case 4:
            case 9:
            case 11:
            case 14:
                tree.geometry = res.DeadTreesGeometry[1];
                tree.material = res.DeadTreesMaterials[1];
                break;
            case 0:
            case 8:
            case 10:
            case 13:
                tree.geometry = res.DeadTreesGeometry[2];
                tree.material = res.DeadTreesMaterials[2];
                break;
            default:
                tree.geometry = res.DeadTreesGeometry[3];
                tree.material = res.DeadTreesMaterials[3];
                break;
        }

        geometry.verticesNeedUpdate = true;
    };

    tree.live = function () {
        tree.isAlive = true;
        tree.visible = true;

        tree.geometry = res.TreesGeometry[style];
        tree.material = res.TreesMaterials[style];

        geometry.verticesNeedUpdate = true;
    };

    tree.remove = function () {
        tree.visible = false;
    };
    return tree;
};