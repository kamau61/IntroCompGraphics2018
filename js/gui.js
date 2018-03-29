var params = {
    CamPosX: 0,
    CamPosY: 0,
    CamPosZ: 5
};

var gui = new dat.GUI({width: 300});
var folderCamera = gui.addFolder('Camera');
folderCamera.add(params, 'CamPosX', -10, 10).step(.01).onChange(function (value) {
    camera.position.x = params.CamPosX
});
folderCamera.add(params, 'CamPosY', -10, 10).step(.01).onChange(function (value) {
    camera.position.y = params.CamPosY
});
folderCamera.add(params, 'CamPosZ', 1.5, 10).step(.01).onChange(function (value) {
    camera.position.z = params.CamPosZ
});
folderCamera.open();

