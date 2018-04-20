window.PLANET = window.PLANET || {};
PLANET.cloud = PLANET.cloud || {};

PLANET.cloud.Cloud = function (geometry) {
    THREE.Object3D.call(this);

    geometry.computeBoundingBox();
    var size = geometry.boundingBox.getSize();

    var sca = new THREE.Matrix4();
    var ScaleFact = 5 / size.length();
    sca.makeScale(ScaleFact, ScaleFact, ScaleFact);
    geometry.computeVertexNormals();


    // var tra = new THREE.Matrix4();
    // var center = geometry.boundingBox.getCenter();
    // var min = geometry.boundingBox.min;
    // tra.makeTranslation(-center.x, -center.y, -min.z);


    /*   var center = geometry.boundingBox.getCenter();
       var size = geometry.boundingBox.getSize();
       var min = geometry.boundingBox.min;

       var sca = new THREE.Matrix4();


       var ScaleFact=5/size.length();
       sca.makeScale(ScaleFact,ScaleFact,ScaleFact);
       //tra.makeTranslation (-center.x,-center.y,-min.z);
       tra.makeTranslation (-center.x,-center.y,-min.z);*/

    var material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0.9, 0.9, 0.9);
    material.shininess = 100;
    var mesh = new THREE.Mesh(geometry, material);

    // mesh.applyMatrix(tra);
    mesh.applyMatrix(sca);

    mesh.name = "loaded_mesh";
    this.cloud = new THREE.Mesh(geometry, material);
    this.cloud.name = "Cloud";
    this.cloud.castShadow = true;
    this.cloud.receiveShadow = true;

    return this.cloud;
};

PLANET.cloud.Cloud.prototype = Object.create(THREE.Object3D.prototype);

PLANET.cloud.update = function () {

};