var flyControls = function ( camara ){
  camera.rotation.set(0, 0, 0);
  camera.position.set(0, 0, 0);

	var holder = new THREE.Object3D();
	holder.add( camera );

	var PI_2 = Math.PI / 2;
  var DEG1 = Math.PI/180;
  var nearGround = false;
  var flyMode = false;
  var freeControl = false;

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var moveUp = false;
  var moveDown = false;
  var headUp = false;
  var headDown = false;
  var turnLeft = false;
  var turnRight = false;
  var rollLeft = false;
  var rollRight = false;
  var cancelMode = false;
  var testMode = false;

  var prevTime = performance.now();
  var facingTo = new THREE.Vector3();
  var velocity = new THREE.Vector3();
  var currentHeight = 100;
  var height = this.minDistance;

  var facingPoint = new THREE.Vector3();
  var facingTarget = new THREE.Vector3();
  var movingTarget = new THREE.Vector3();
  var flySpeed = 10;
  var velocityNew = new THREE.Vector3();
  var tempVector = new THREE.Vector3();
  var tempObj = new THREE.Object3D();
  //var tempVector = new THREE.Vector3();

  var position0 = new THREE.Vector3();
  var rotation0 = new THREE.Vector3();

  var xRotated = 0;
  var yRotated = 0;
  var zRotated = 0;
  var tiltedAngle = 0;
  var dirLeft = new THREE.Vector3(1, 0, 0);

  this.object = holder;
  this.movSpeed = 40;
  this.rotSpeed = 1;
  this.tiltToAngle = DEG1*30;
  this.minDistance = 110;
  this.maxDistance = 400;
  this.viewChangingDist = 30;

  holder.position.set(0, 0, params.PlanetRadius * params.CameraMax);
  facingPoint.set(0, this.minDistance, 0);
  facingTarget.copy(facingPoint);
  movingTarget.copy(holder.position);

  var saveState = function (){
    position0.copy(holder.position);
    rotation0.copy(holder.rotation);
    //rotation0.set(xRotated, yRotated, zRotated);
  };

  var loadState = function (){
    holder.position.copy(position0);
    holder.rotation.copy(rotation0);
    //rotateHolder(rotation0.x-xRotated, rotation0.y-yRotated, rotation0.z-zRotated);
  };

  function directionToWorld(obj, dir){
    obj.localToWorld(dir);
    dir.sub(obj.getWorldPosition());
  }

  function tiltCamera(ang){
    camera.rotateX(ang);
    tiltedAngle += ang;
  }
  function tiltCameraTo(ang){
    tiltCamera(ang - tiltedAngle);
  }
  function rotateHolderX(x){
    holder.rotateX(x);
    xRotated += x;
  }
  function rotateHolderY(y){
    holder.rotateY(y);
    yRotated += y;
  }
  function rotateHolderZ(z){
    holder.rotateZ(z);
    zRotated += z;
  }
  function rotateHolder(x, y, z){
    rotateHolderX(x);
    rotateHolderY(y);
    rotateHolderZ(z);
  }
  function resetRotation(){
    rotateHolderX(-xRotated);
    rotateHolderY(-yRotated);
    rotateHolderZ(-zRotated);
  }

  var onKeyDown = function ( event ) {
    if (freeControl){
      switch ( event.keyCode ) {
        case 38:  moveForward = true; break;  // up
        case 40:  moveBackward = true;break;  // down
        case 37:  turnLeft = true;    break;  // left
        case 39:  turnRight = true;   break;  // right
        case 87:  moveUp = true;      break;  // w
        case 83:  moveDown = true;    break;  // s
        case 65:  moveLeft = true;    break;  // a
        case 68:  moveRight = true;   break;  // d
        case 82:  headUp = true;      break;  // R
        case 70:  headDown = true;    break;  // F
        case 81:  rollLeft = true;    break;  // Q
        case 69:  rollRight = true;   break;  // E
      }
    }
    else {
      switch ( event.keyCode ) {
        case 38:  moveForward = true;     break;  // up
        case 40:  moveBackward = true;    break;  // down
        case 37:  if (nearGround)  turnLeft = true;
                  else            moveLeft = true;
                  break;  // left
        case 39:  if (nearGround)  turnRight = true;
                  else            moveRight = true;
                  break;  // right
      }
    }
  };

  var onKeyUp = function ( event ) {
    if (freeControl){
      switch( event.keyCode ) {
        case 38:  moveForward = false; break;  // up
        case 40:  moveBackward = false;break;  // down
        case 37:  turnLeft = false;    break;  // left
        case 39:  turnRight = false;   break;  // right
        case 87:  moveUp = false;      break;  // w
        case 83:  moveDown = false;    break;  // s
        case 65:  moveLeft = false;    break;  // a
        case 68:  moveRight = false;   break;  // d
        case 82:  headUp = false;      break;  // R
        case 70:  headDown = false;    break;  // F
        case 81:  rollLeft = false;    break;  // Q
        case 69:  rollRight = false;   break;  // E
        case 27:  cancelMode = true;   break;
        case 84:  if (testMode){ testMode = false; loadState();}
                  else{ testMode = true; saveState();}
                  break;
        // case 13:  if (!floatMode){
        //   flyMode = true;   saveState();
        // }    break;
      }
    }
    else {
      switch ( event.keyCode ) {
        case 38:  moveForward = false;      break;  // up
        case 40:  moveBackward = false;    break;  // down
        case 37:  if (nearGround)  turnLeft = false;
                  else            moveLeft = false;
                  break;  // left
        case 39:  if (nearGround)  turnRight = false;
                  else            moveRight = false;
                  break;  // right
        case 27:  cancelMode = true;   break;
        //case 84:  init();             break;  //T
        case 13:  if (!flyMode){
          flyMode = true;   saveState();
        }    break;
      }
    }
  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  this.getObject = function () { return holder; };

  function orbitTo(dir){
    if (dir != 0){
      // var orgPoint = new THREE.Vector3(0, 1, 0).applyAxisAngle(dirLeft, PI_2-xRotated).multiplyScalar(height);
      // var dist = holder.position.distanceTo(orgPoint);
      // var d = height - dist*dist*0.5/height;
      tempVector.set(0, 1, 0).applyAxisAngle(dirLeft,-xRotated);
      directionToWorld(holder, tempVector);
      holder.rotateOnWorldAxis(tempVector, DEG1*dir);
      holder.position.applyAxisAngle(tempVector,DEG1*dir);
    }
  }

  this.update = function (){
    holder.getWorldDirection(facingTo);
    facingTo.negate();

    if (flyMode){
      this.fly();
      if (cancelMode){
        cancelMode = false;
        flyMode = false;
        loadState();
      }
    }else{
      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;

      velocity.multiplyScalar(0.6);
      velocity.copy(facingTo).multiplyScalar(Number(moveForward) - Number(moveBackward));
      // rotateHolderY(DEG1*this.rotSpeed*(Number(turnLeft) - Number(turnRight)));
      // rotateHolderZ(DEG1*this.rotSpeed*(Number(rollLeft) - Number(rollRight)));
      // rotateHolderX(DEG1*this.rotSpeed*(Number(headDown) - Number(headUp)));

      height = holder.position.length();
      var dest = new THREE.Vector3().copy(holder.position);
      var movement = velocity.clone().multiplyScalar(this.movSpeed*delta);
      dest.add(movement);

      if (dest.length() < this.maxDistance){
        holder.position.copy(dest);
        if (nearGround){
          holder.rotateY(DEG1*this.rotSpeed*(Number(turnLeft) - Number(turnRight)));
          currentHeight = holder.position.length();
          if (moveForward){
            holder.rotateX(-Math.tanh(movement.length()/currentHeight)*(Number(moveForward) - Number(moveBackward)));
            holder.position.setLength(height);
          }else if (moveBackward){
            nearGround = false;
            moveLeft = turnLeft;
            turnLeft = false;
            moveRight = turnRight;
            turnRight = false;
          }
        }else{
          orbitTo(Number(moveLeft)-Number(moveRight));

          if (height <= this.minDistance + this.viewChangingDist && height > this.minDistance) {
            var distPercent = (this.minDistance + this.viewChangingDist - height)/this.viewChangingDist;
            var ag = distPercent*PI_2 - xRotated;
            rotateHolderX(ag);
            var ttAngle = distPercent*this.tiltToAngle;
            tiltCameraTo(-ttAngle);
            if (facingTo.angleTo(holder.position) <= PI_2){
              nearGround = true;
              turnLeft = moveLeft;
              moveLeft = false;
              turnRight = moveRight;
              moveRight = false;
            }
          }
        }
      }

      prevTime = time;
    }
  };

  // var randomForce = function( dir, strength, force ){
  //   //var dir = forward?-1:1;
  //   var x = Math.abs(holder.position.x);
  //   var y = Math.abs(holder.position.y);
  //   var z = Math.abs(holder.position.z);
  //   var nx = (x!=0?dir*Math.random()*holder.position.x/x:dir);
  //   var ny = (y!=0?dir*Math.random()*holder.position.y/y:dir);
  //   var nz = (z!=0?dir*Math.random()*holder.position.z/z:dir);
  //
  //   force.set(nx, ny, nz).normalize().multiplyScalar(strength);
  // };
  //
  var randomDest = function( vec, min ){
    tempVector.set(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1);
    var rd = (Math.random()*0.2+1)*min;
    tempVector.cross(vec).normalize().multiplyScalar(rd);
    vec.add(tempVector).normalize().multiplyScalar((Math.random()*0.5+1)*min);
  };

  var randomPos = function( position, min ) {
    position.set(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1).normalize().multiplyScalar(min*1.1);
  }

  this.fly = function(){
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    // velocity.multiplyScalar(0.9);
    // velocityNew.copy(movingTarget.clone().sub(holder.position)).normalize().multiplyScalar(3);
    // var move = velocity.clone().multiplyScalar(flySpeed*delta).add(velocityNew.clone().multiplyScalar(flySpeed*delta));
    // move.add(holder.position);
    // if (move.length() < this.minDistance)
    //   move.normalize().multiplyScalar(this.minDistance);
    // holder.position.copy(move);
    //
    // if (holder.position.distanceTo(movingTarget)<10){
    //   movingTarget.copy(holder.position);
    //   randomDest(movingTarget, this.minDistance);
    //   //velocity.copy(velocityNew);
    // }

    facingPoint.set(0, 0, 0);
    holder.lookAt(facingPoint);

    // if (facingTarget.distanceTo(facingPoint) < 10)
    //   randomPos(facingTarget, this.minDistance);
    // else {
    //   facingPoint.add(facingTarget.clone().sub(facingPoint).normalize());
    // }

    prevTime = time;
  };
};
