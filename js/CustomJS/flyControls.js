var flyControls = function (camara) {
    camera.rotation.set(0, Math.PI, 0);
    camera.position.set(0, 0, 0);

    var holder = new THREE.Object3D();
    holder.add(camera);
    //var holder = camera;
    //holder.rotation.set(0, 0, 0);
    holder.position.set(0, 0, params.PlanetRadius * params.CameraMax);
    //camera.lookAt(0, 0, 1);
    holder.lookAt(0, 0, 0);

    // function init(){
    //   console.log("camera up");
    //   console.log(camera.up);
    //   console.log(dirToWorld(camera, camera.up));
    //   console.log("holder up");
    //   console.log(holder.up);
    //   console.log(dirToWorld(holder, holder.up));
    // }

    function dirToWorld(obj, dir) {
        var origin = new THREE.Vector3(0, 0, 0);
        var direction = dir.clone();
        obj.localToWorld(dir);
        obj.localToWorld(origin);
        return dir.sub(origin);
    }

    var PI_2 = Math.PI / 2;
    var DEG1 = Math.PI / 180;
    var floatMode = false;
    var flyMode = false;
    var freeControl = false;
    var isTransfering = false;

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

    var prevTime = performance.now();
    var facingTo = new THREE.Vector3();
    var velocity = new THREE.Vector3();
    var currentHeight = 100;

    var facingTarget = new THREE.Vector3();
    var facingPoint = new THREE.Vector3();
    var movingTarget = holder.position.clone();
    var flySpeed = 10;
    var velocityNew = new THREE.Vector3();
    var tempVector = new THREE.Vector3();

    var position0 = new THREE.Vector3();
    var rotation0 = new THREE.Vector3();

    this.object = holder;
    this.movSpeed = 40;
    this.rotSpeed = 1;
    this.minDistance = 110;
    this.maxDistance = 500;
    this.angle = 0;
    this.transferSpeed = 3;
    this.tiltToAngle = DEG1 * 30;
    this.tiltedAngle = 0;
    this.upInWorld = function () {
        var up = holder.up.clone();
        holder.localToWorld(up);
        return up.sub(holder.position);
    };

    var saveState = function () {
        position0.copy(holder.position);
        rotation0.copy(holder.rotation);
    }

    var loadState = function () {
        holder.position.copy(position0);
        holder.rotation.copy(rotation0);
        holder.lookAt(0, 0, 0);
    }

    var onKeyDown = function (event) {
        if (freeControl) {
            switch (event.keyCode) {
                case 38:
                    moveForward = true;
                    break;  // up
                case 40:
                    moveBackward = true;
                    break;  // down
                case 37:
                    turnLeft = true;
                    break;  // left
                case 39:
                    turnRight = true;
                    break;  // right
                case 87:
                    moveUp = true;
                    break;  // w
                case 83:
                    moveDown = true;
                    break;  // s
                case 65:
                    moveLeft = true;
                    break;  // a
                case 68:
                    moveRight = true;
                    break;  // d
                case 82:
                    headUp = true;
                    break;  // R
                case 70:
                    headDown = true;
                    break;  // F
                case 81:
                    rollLeft = true;
                    break;  // Q
                case 69:
                    rollRight = true;
                    break;  // E
            }
        }
        else {
            switch (event.keyCode) {
                case 38:
                    moveForward = true;
                    break;  // up
                case 40:
                    moveBackward = true;
                    break;  // down
                case 37:
                    if (floatMode) turnLeft = true;
                    else moveLeft = true;
                    break;  // left
                case 39:
                    if (floatMode) turnRight = true;
                    else moveRight = true;
                    break;  // right
            }
        }
    };

    var onKeyUp = function (event) {
        if (freeControl) {
            switch (event.keyCode) {
                case 38:
                    moveForward = false;
                    break;  // up
                case 40:
                    moveBackward = false;
                    break;  // down
                case 37:
                    turnLeft = false;
                    break;  // left
                case 39:
                    turnRight = false;
                    break;  // right
                case 87:
                    moveUp = false;
                    break;  // w
                case 83:
                    moveDown = false;
                    break;  // s
                case 65:
                    moveLeft = false;
                    break;  // a
                case 68:
                    moveRight = false;
                    break;  // d
                case 82:
                    headUp = false;
                    break;  // R
                case 70:
                    headDown = false;
                    break;  // F
                case 81:
                    rollLeft = false;
                    break;  // Q
                case 69:
                    rollRight = false;
                    break;  // E
                case 27:
                    cancelMode = true;
                    break;
                case 13:
                    if (!floatMode) {
                        flyMode = true;
                        saveState();
                    }
                    break;
            }
        }
        else {
            switch (event.keyCode) {
                case 38:
                    moveForward = false;
                    break;  // up
                case 40:
                    moveBackward = false;
                    break;  // down
                case 37:
                    if (floatMode) turnLeft = false;
                    else moveLeft = false;
                    break;  // left
                case 39:
                    if (floatMode) turnRight = false;
                    else moveRight = false;
                    break;  // right
                case 27:
                    cancelMode = true;
                    break;
                case 84:
                    init();
                    break;
                case 13:
                    if (!floatMode) {
                        flyMode = true;
                        saveState();
                    }
                    break;
            }
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    this.getObject = function () {
        return holder;
    };

    this.update = function () {

        holder.getWorldDirection(facingTo);
        // console.log("facingTo");
        // console.log(facingTo);
        //facingTo.negate();

        if (flyMode) {
            this.fly();

            if (cancelMode) {
                cancelMode = false;
                flyMode = false;
                loadState();
            }
        } else {
            if (isTransfering) {
                var ang;
                var transferedDeg = DEG1 * this.transferSpeed;
                var ttAngle = transferedDeg * this.tiltToAngle / PI_2;
                if (floatMode) {
                    holder.rotateX(-transferedDeg);
                    camera.rotateX(-ttAngle);
                    this.tiltedAngle -= ttAngle;
                    holder.position.multiplyScalar(.998);
                    ang = facingTo.angleTo(holder.position);
                    if (ang - PI_2 < transferedDeg && ang - PI_2 > -transferedDeg) {
                        holder.rotateX(PI_2 - ang);
                        currentHeight = holder.position.length();
                        isTransfering = false;
                    }
                } else {
                    holder.rotateX(transferedDeg);
                    camera.rotateX(ttAngle);
                    this.tiltedAngle += ttAngle;
                    holder.position.multiplyScalar(1.01);
                    ang = facingTo.angleTo(holder.position);
                    if (Math.PI - ang < transferedDeg * 2) {
                        holder.rotateX(Math.PI - ang);
                        camera.rotateX(-this.tiltedAngle);
                        this.tiltedAngle = 0;
                        isTransfering = false;
                    }
                }
            }
            else {
                var time = performance.now();
                var delta = (time - prevTime) / 1000;
                //var direction = new THREE.Vector3(0, 0, 0);

                velocity.multiplyScalar(0.6);
                velocity.copy(facingTo).multiplyScalar(Number(moveForward) - Number(moveBackward));
                // holder.rotateY(DEG1*this.rotSpeed*(Number(turnLeft) - Number(turnRight)));
                // holder.rotateZ(DEG1*this.rotSpeed*(Number(rollLeft) - Number(rollRight)));
                // holder.rotateX(DEG1*this.rotSpeed*(Number(headDown) - Number(headUp)));

                if (floatMode) {
                    holder.rotateY(DEG1 * this.rotSpeed * (Number(turnLeft) - Number(turnRight)));
                    if (cancelMode) {
                        isTransfering = true;
                        floatMode = false;
                        cancelMode = false;
                    }
                } else {
                    var orbit = Number(moveLeft) - Number(moveRight);
                    if (orbit != 0) {
                        var up = holder.up.clone();
                        holder.localToWorld(up);
                        up.sub(holder.position);
                        tempVector.crossVectors(holder.position, up).normalize().multiplyScalar(orbit);
                        var h = holder.position.length();
                        holder.position.add(tempVector).multiplyScalar(h / holder.position.length());
                        holder.rotateY(-orbit * (Math.tanh(1 / h)));
                    }
                }
                //velocity.add(direction);
                var dest = new THREE.Vector3().copy(holder.position);
                var movement = velocity.clone().multiplyScalar(this.movSpeed * delta);
                dest.add(movement);
                //if (dest.length() > this.minDistance && dest.length() < this.maxDistance){
                holder.position.copy(dest);
                if (floatMode) {
                    var height = holder.position.length();
                    holder.rotateX(Math.tanh(movement.length() / height) * (Number(moveForward) - Number(moveBackward)));
                    holder.position.multiplyScalar(currentHeight / height);
                }
                //}else{
                if (holder.position.length() < this.minDistance * 1.1 && !floatMode && !isTransfering) {
                    isTransfering = true;
                    floatMode = true;
                    cancelMode = false;
                }
                this.angle = facingTo.angleTo(holder.position);
                prevTime = time;
            }
        }
    };

    var randomForce = function (dir, strength, force) {
        //var dir = forward?-1:1;
        var x = Math.abs(holder.position.x);
        var y = Math.abs(holder.position.y);
        var z = Math.abs(holder.position.z);
        var nx = (x != 0 ? dir * Math.random() * holder.position.x / x : dir);
        var ny = (y != 0 ? dir * Math.random() * holder.position.y / y : dir);
        var nz = (z != 0 ? dir * Math.random() * holder.position.z / z : dir);

        force.set(nx, ny, nz).normalize().multiplyScalar(strength);
    };

    var randomDest = function (vec, min) {
        tempVector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        var rd = (Math.random() * 0.2 + 1) * min;
        tempVector.cross(vec).normalize().multiplyScalar(rd);
        vec.add(tempVector).normalize().multiplyScalar((Math.random() * 0.5 + 1) * min);
    };

    var randomPos = function (position, min) {
        position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(min * 1.1);
    }

    this.fly = function () {
        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.multiplyScalar(0.9);
        velocityNew.copy(movingTarget.clone().sub(holder.position)).normalize().multiplyScalar(3);
        var move = velocity.clone().multiplyScalar(flySpeed * delta).add(velocityNew.clone().multiplyScalar(flySpeed * delta));
        move.add(holder.position);
        if (move.length() < this.minDistance)
            move.normalize().multiplyScalar(this.minDistance);
        holder.position.copy(move);

        if (holder.position.distanceTo(movingTarget) < 10) {
            movingTarget.copy(holder.position);
            randomDest(movingTarget, this.minDistance);
            // console.log("randomDest");
            // console.log(movingTarget);
            //velocity.copy(velocityNew);
        }

        holder.lookAt(facingPoint);

        if (facingTarget.distanceTo(facingPoint) < 10)
            randomPos(facingTarget, this.minDistance);
        else {
            facingPoint.add(facingTarget.clone().sub(facingPoint).normalize());
        }

        prevTime = time;
    };
};
