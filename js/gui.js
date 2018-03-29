//  initialize
var gui = new dat.GUI();

//  Camera parameters
var pc = camera.position;
var fc = gui.addFolder('Camera');
  fc.add(pc, 'x').listen();
  fc.add(pc, 'y').listen();
  fc.add(pc, 'z').listen();
  fc.open();
