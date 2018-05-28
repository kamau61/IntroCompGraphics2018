window.PLANET = window.PLANET || {};
PLANET.tree = PLANET.tree || {};

PLANET.tree.Tree = function (face) {
    //get random tree
    let style = Math.floor(Math.random() * res.Trees.length);
    let tree = new THREE.Object3D();
    let scale = params.TreeScale * (1 - Math.random());
    tree.alive = res.Trees[style].clone();
    utils.alignOnFace(tree.alive, face, scale);
    tree.add(tree.alive);

    //get corresponding dead tree
    switch (style) {
        case 2:
        case 3:
        case 5:
        case 12:
            tree.dead = res.DeadTrees[0].clone();
            break;
        case 4:
        case 9:
        case 11:
        case 14:
            tree.dead = res.DeadTrees[1].clone();
            break;
        case 0:
        case 8:
        case 10:
        case 13:
            tree.dead = res.DeadTrees[2].clone();
            break;
        default:
            tree.dead = res.DeadTrees[3].clone();
            break;
    }
    tree.dead.visible = false;
    utils.alignOnFace(tree.dead, face, scale);
    tree.add(tree.dead);

    tree.die = function () {
        tree.dead.visible = true;
        tree.alive.visible = false;
    };

    tree.live = function () {
        tree.alive.visible = true;
        tree.dead.visible = false;
    };

    tree.remove = function () {
        tree.alive.visible = false;
        tree.dead.visible = false;
    };
    return tree;
};