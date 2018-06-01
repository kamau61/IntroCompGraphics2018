window.PLANET = window.PLANET || {};
PLANET.flyControls = PLANET.flyControls || {};

PLANET.flyControls.FlyControls = function (camara) {
    camera.rotation.set(0, 0, 0);
    camera.position.set(0, 0, 0);
    //camera.lookAt(0, 0, 0);

  	var holder = new THREE.Object3D();
  	holder.add( camera );

    //Some preset values;
  	var PI_2 = Math.PI / 2;
    var DEG1 = Math.PI/180;
    var dirLeft = new THREE.Vector3(1, 0, 0);
    var dirUp = new THREE.Vector3(0, 1, 0);
    var dirFront = new THREE.Vector3(0, 0, -1);

    var nearGround = false;   //If it's on minimum distance, which is
    var flyMode = false;      //If it's on self control mode.
    var freeControl = false;  //If it's on free control mode.

    //All different direction controls
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

    // var prevTime = performance.now();
    var facingTo = new THREE.Vector3();
    var velocity = new THREE.Vector3();

    //Some variables for flymode.
    var facingPoint = new THREE.Vector3();
    var facingTarget = new THREE.Vector3();
    var movingTarget = new THREE.Vector3();
    var flySpeed = 10;
    var velocityNew = new THREE.Vector3();
    var currentHeight = 100;
    var height = this.minDistance;

    //Some temporary variables to be reuse.
    var tempVector = new THREE.Vector3();
    var tempVector2 = new THREE.Vector3();
    var tempObj = new THREE.Object3D();

    //For save and load position and rotation.
    var position0 = new THREE.Vector3();
    var rotation0 = new THREE.Vector3();

    var tiltedAngle = 0;

    this.object = holder;             //The object that hold the camera.
    this.position = holder.position;  //Holder's position.
    this.movingSpeed = 1;            //Camera Moving speed.
    this.rotatingSpeed = 1;           //Camera rotating speed.
    this.tiltToAngle = DEG1*30;       //The angle that camera need to tilt when it's on ground.
    this.minDistance = params.PlanetRadius*(1.1 + params.TerrainDisplacement/100);  //The minimum distance of Camera to central of the planet.
    this.maxDistance = params.PlanetRadius*4;     //The maximum distance of camera to central of the planet.
    this.viewChangingDist = params.PlanetRadius*0.3;  //The distance that camera starts to change the angle when close to planet.

    holder.position.set(0, 0, params.PlanetRadius * params.CameraMax);
    facingPoint.set(0, this.minDistance, 0);
    facingTarget.copy(facingPoint);
    movingTarget.copy(holder.position);

    //Save the position and rotation.
    var saveState = function (){
      position0.copy(holder.position);
      rotation0.copy(holder.rotation);
      //rotation0.set(xRotated, yRotated, zRotated);
    };

    //Load the position and rotation.
    var loadState = function (){
      holder.position.copy(position0);
      holder.rotation.copy(rotation0);
      //rotateHolder(rotation0.x-xRotated, rotation0.y-yRotated, rotation0.z-zRotated);
    };

    //Get the direction in world coordinate.
    function directionToWorld(obj, dir){
      obj.localToWorld(dir);
      dir.sub(obj.getWorldPosition(dir.clone()));
    }

    //Tilt the camera.
    function tiltCamera(ang){
      camera.rotateX(ang);
      tiltedAngle += ang;
    }
    function tiltCameraTo(ang){
      tiltCamera(ang - tiltedAngle);
    }

    // function resetCamera(){
    //   camera.rotation.set(0, 0, 0);
    // }

    function rotateHolderXTo(x){
      holder.getWorldDirection(tempVector);
      var ang = holder.position.angleTo(tempVector);
      var myLeft = dirLeft.clone();
      directionToWorld(holder, myLeft);
      // var worldLeft = myLeft.clone();
      // if (ang != 0){
      //   worldLeft.crossVectors(holder.position, tempVector).normalize();
      // }
      holder.rotateOnWorldAxis(myLeft, x-ang);
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
        }
      }
      else {
        switch ( event.keyCode ) {
          case 38:  moveForward = false;     break;  // up
          case 40:  moveBackward = false;    break;  // down
          case 37:  if (nearGround)  turnLeft = false;
                    else            moveLeft = false;
                    break;  // left
          case 39:  if (nearGround)  turnRight = false;
                    else            moveRight = false;
                    break;  // right
          case 27:  cancelMode = true;   break;
          case 13:  if (!flyMode){
            flyMode = true;   saveState();
          }    break;
        }
      }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.getObject = function () { return holder; };

    //dirX for left or right, dirY for forward or backward.
    function orbitTo(dirX, dirY, speed){
      if (dirX == 0 && dirY == 0) return;

      var obLeft = dirLeft.clone();
      directionToWorld(holder, obLeft);
      var obUp = holder.position.clone().normalize();
      var obFront = new THREE.Vector3().crossVectors(obLeft, obUp).normalize();

      if (dirX != 0){
        tempVector.copy(obFront);
        holder.rotateOnWorldAxis(tempVector, speed*DEG1*dirX);
        holder.position.applyAxisAngle(tempVector,speed*DEG1*dirX);
      }

      if (dirY != 0){
        tempVector.copy(obLeft);
        holder.rotateOnWorldAxis(tempVector, -speed*DEG1*dirY);
        holder.position.applyAxisAngle(tempVector,-speed*DEG1*dirY);
      }
    }

    this.update = function() {
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
        holder.rotateY(DEG1*this.rotatingSpeed*(Number(turnLeft) - Number(turnRight)));
        holder.rotateZ(DEG1*this.rotatingSpeed*(Number(rollLeft) - Number(rollRight)));
        holder.rotateX(DEG1*this.rotatingSpeed*(Number(headDown) - Number(headUp)));

        if (nearGround){
          holder.rotateY(DEG1*this.rotatingSpeed*(Number(turnLeft) - Number(turnRight)));
          if (moveBackward){
            nearGround = false;
            moveLeft = turnLeft;  turnLeft = false;
            moveRight = turnRight;turnRight = false;
          }else {
            orbitTo(0, Number(moveForward)-Number(moveBackward), this.rotatingSpeed);
          }
        }else{
          orbitTo(Number(moveLeft)-Number(moveRight), 0, this.rotatingSpeed);

          currentHeight = holder.position.length();
          if (currentHeight <= this.minDistance + this.viewChangingDist && currentHeight > this.minDistance){
            var movement = facingTo.clone().setLength(this.movingSpeed);
            holder.position.add(movement.multiplyScalar(Number(moveForward) - Number(moveBackward)));

            var distPercent = (this.minDistance + this.viewChangingDist - currentHeight)/this.viewChangingDist;
            var ag = distPercent*PI_2;
            rotateHolderXTo(ag);
            var ttAngle = distPercent*this.tiltToAngle;
            tiltCameraTo(-ttAngle);
            if (facingTo.angleTo(holder.position) <= PI_2){
              nearGround = true;
              turnLeft = moveLeft;  moveLeft = false;
              turnRight = moveRight;moveRight = false;
            }
          }else{
            let length = holder.position.length() - (Number(moveForward) - Number(moveBackward))*this.movingSpeed;
            length = length < this.maxDistance ? length : this.maxDistance;
            holder.position.setLength(length);
          }
        }
      }
    };

    // function rotateToDirection(obj, from, to, isLocal){
    //   var ang = from.angleTo(to);
    //   if (ang != 0){
    //     var axis = new THREE.Vector3().crossVectors(from, to).normalize();
    //     if (isLocal) obj.rotateOnAxis(axis, -ang);
    //     else obj.rotateOnWorldAxis(axis, -ang);
    //   }
    // }

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
    };

    this.fly = function(){
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

    };
    //return holder;
  };
