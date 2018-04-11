window.PLANET = window.PLANET || {};
PLANET.debug = PLANET.debug || {};


PLANET.debug.Debug = function() {
    gui = new dat.GUI();
    var cubeControls = gui.addFolder('Cube');
    cubeControls.add(params, 'CubeRotation', CUBE_ROTATION.MIN, CUBE_ROTATION.MAX).step(CUBE_ROTATION.STEP).listen();
    var sphereControls = gui.addFolder('Sphere');
    sphereControls.add(params, 'SphereRotation', SPHERE_ROTATION.MIN, SPHERE_ROTATION.MAX).step(SPHERE_ROTATION.STEP).listen();
    sphereControls.add(params, 'SphereDirection').listen();
    gui.add(options, 'reset');

}