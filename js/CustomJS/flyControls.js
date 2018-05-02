var flyControls = function ( camara ){
  camera.rotation.set( 0, 0, 0 );

	// var yawObject = new THREE.Object3D();
	// yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;
  var DEG1 = Math.PI/180;

  var moveForward = false;
  var moveLeft = false;
  var moveBackward = false;
  var moveRight = false;
  var moveUp = false;
  var moveDown = false;
  var headUp = false;
  var headDown = false;
  var turnLeft = false;
  var turnRight = false;
  var rollLeft = false;
  var rollRight = false;

  var prevTime = performance.now();
  var facingTo = new THREE.Vector3();
  var velocity = new THREE.Vector3();

  this.movSpeed = 40;
  this.rotSpeed = 1;
  this.minDistance = 120;
  this.maxDistance = 500;

  var onKeyDown = function ( event ) {
            switch ( event.keyCode ) {
              case 38: // up
                headUp = true;
                break;
              case 87: // w
                moveUp = true;
                break;
              case 37: // left
                turnLeft = true;
                break;
              case 65: // a
                moveLeft = true;
                break;
              case 40: // down
                headDown = true;
                break;
              case 83: // s
                moveDown = true;
                break;
              case 39: // right
                turnRight = true;
                break;
              case 68: // d
                moveRight = true;
                break;
              case 81: // q
                moveForward = true;
                break;
              case 90: // z
                moveBackward = true;
                break;
              case 69: // e
                rollLeft = true;
                break;
              case 82: // r
                rollRight = true;
                break;
            }
          };

  var onKeyUp = function ( event ) {
            switch( event.keyCode ) {
              case 38: // up
                headUp = false;
                break;
              case 87: // w
                moveUp = false;
                break;
              case 37: // left
                turnLeft = false;
                break;
              case 65: // a
                moveLeft = false;
                break;
              case 40: // down
                headDown = false;
                break;
              case 83: // s
                moveDown = false;
                break;
              case 39: // right
                turnRight = false;
                break;
              case 68: // d
                moveRight = false;
                break;
              case 81: // q
                moveForward = false;
                break;
              case 90: // z
                moveBackward = false;
                break;
              case 69: // e
                rollLeft = false;
                break;
              case 82: // r
                rollRight = false;
                break;
            }
          };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

//  this.getObject = function () { return yawObject; };

  this.saveState = function (){

  };

  this.update = function (){
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    var direction = new THREE.Vector3(0, 0, 0);

    camera.getWorldDirection(facingTo);
    velocity.multiplyScalar(0.6);

    if (moveForward) {
      velocity.copy(facingTo);
    }
    else if (moveBackward) {
      velocity.copy(facingTo).multiplyScalar(-1);
    }

    if (turnLeft) {
      camera.rotateY(DEG1*this.rotSpeed);
    }else if (turnRight) {
      camera.rotateY(-DEG1*this.rotSpeed);
    }

    if (rollLeft) {
      camera.rotateZ(DEG1*this.rotSpeed);
    }else if (rollRight) {
      camera.rotateZ(-DEG1*this.rotSpeed);
    }

    if (headUp) {
      camera.rotateX(DEG1*this.rotSpeed);
    }else if (headDown) {
      camera.rotateX(-DEG1*this.rotSpeed);
    }

    velocity.add(direction);
    var dest = new THREE.Vector3().copy(camera.position);
    dest.add(velocity.clone().multiplyScalar(this.movSpeed*delta));
    if (dest.length() > this.minDistance && dest.length() < this.maxDistance){
      camera.position.copy(dest);
    }

    prevTime = time;
  };

};
