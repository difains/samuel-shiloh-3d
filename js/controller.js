/**
 * Ancient Shiloh 3D - Camera & Player Movement Controller
 * Supports 1st/3rd person camera, collision physics, cinematic tour mode,
 * and fast-travel teleportation.
 */
import * as THREE from 'three';

export class PlayerController {
  constructor(camera, domElement, colliders) {
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;

    // Movement state
    this.position = new THREE.Vector3(0, 0, -4.5); // Start inside holy place near Samuel's bed
    this.velocity = new THREE.Vector3();
    this.speed = 4.2;
    this.sprintMultiplier = 1.7;
    this.jumpForce = 4.8;
    this.gravity = -14.0;
    this.isGrounded = true;

    // Orientation
    this.yaw = 0;
    this.pitch = 0;
    this.isPointerLocked = false;

    // Camera modes
    this.isThirdPerson = true;
    this.isCinematic = false;
    this.cinematicTime = 0;

    // Keys state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };

    this.onToggleView = null;
    this.onToggleCinematic = null;
    this.onTogglePrayer = null;
    this.onCycleTime = null;
    this.onInteract = null;
    this.onToggleMute = null;
    this.onTeleportKey = null;

    this.initEvents();
  }

  initEvents() {
    this.domElement.addEventListener('click', () => {
      if (!this.isPointerLocked && !this.isCinematic) {
        this.domElement.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
      const crosshair = document.getElementById('crosshair');
      if (crosshair) {
        if (this.isPointerLocked && !this.isThirdPerson) {
          crosshair.classList.remove('hidden');
        } else {
          crosshair.classList.add('hidden');
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked || this.isCinematic) return;
      const sensitivity = 0.0022;
      this.yaw -= e.movementX * sensitivity;
      this.pitch -= e.movementY * sensitivity;
      this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
    });

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const k = e.code;

      if (k === 'KeyW' || k === 'ArrowUp') this.keys.forward = true;
      if (k === 'KeyS' || k === 'ArrowDown') this.keys.backward = true;
      if (k === 'KeyA' || k === 'ArrowLeft') this.keys.left = true;
      if (k === 'KeyD' || k === 'ArrowRight') this.keys.right = true;
      if (k === 'ShiftLeft' || k === 'ShiftRight') this.keys.sprint = true;
      if (k === 'Space') {
        if (this.isGrounded) {
          this.velocity.y = this.jumpForce;
          this.isGrounded = false;
        }
      }

      // Action Keys
      if (k === 'KeyV') {
        this.isThirdPerson = !this.isThirdPerson;
        if (this.onToggleView) this.onToggleView(this.isThirdPerson);
      }
      if (k === 'KeyC') {
        this.isCinematic = !this.isCinematic;
        if (this.onToggleCinematic) this.onToggleCinematic(this.isCinematic);
      }
      if (k === 'KeyG') {
        if (this.onTogglePrayer) this.onTogglePrayer();
      }
      if (k === 'KeyT') {
        if (this.onCycleTime) this.onCycleTime();
      }
      if (k === 'KeyE') {
        if (this.onInteract) this.onInteract();
      }
      if (k === 'KeyM') {
        if (this.onToggleMute) this.onToggleMute();
      }

      // Fast-travel Number keys 1-6
      if (e.key >= '1' && e.key <= '6') {
        const pointId = parseInt(e.key, 10) - 1;
        if (this.onTeleportKey) this.onTeleportKey(pointId);
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.code;
      if (k === 'KeyW' || k === 'ArrowUp') this.keys.forward = false;
      if (k === 'KeyS' || k === 'ArrowDown') this.keys.backward = false;
      if (k === 'KeyA' || k === 'ArrowLeft') this.keys.left = false;
      if (k === 'KeyD' || k === 'ArrowRight') this.keys.right = false;
      if (k === 'ShiftLeft' || k === 'ShiftRight') this.keys.sprint = false;
    });
  }

  teleportTo(x, z, rotY = null) {
    this.position.x = x;
    this.position.z = z;
    this.position.y = 0;
    this.velocity.set(0, 0, 0);
    if (rotY !== null) {
      this.yaw = rotY;
    }
    // Cancel cinematic mode on teleport
    if (this.isCinematic) {
      this.isCinematic = false;
      if (this.onToggleCinematic) this.onToggleCinematic(false);
    }
  }

  checkCollision(newX, newZ, radius = 0.45) {
    for (let i = 0; i < this.colliders.length; i++) {
      const c = this.colliders[i];
      if (
        newX + radius > c.minX &&
        newX - radius < c.maxX &&
        newZ + radius > c.minZ &&
        newZ - radius < c.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  update(delta) {
    if (this.isCinematic) {
      // Cinematic Camera Glide Orbit around Tabernacle & Shiloh
      this.cinematicTime += delta * 0.28;
      const orbitR = 24.0;
      const camX = Math.sin(this.cinematicTime) * orbitR;
      const camZ = Math.cos(this.cinematicTime) * orbitR;
      const camY = 9.5 + Math.sin(this.cinematicTime * 0.7) * 2.5;

      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(0, 2.5, 0);
      return;
    }

    // Normal Movement
    const currentSpeed = (this.keys.sprint ? this.speed * this.sprintMultiplier : this.speed) * delta;
    const moveVector = new THREE.Vector3();

    if (this.keys.forward) moveVector.z -= 1;
    if (this.keys.backward) moveVector.z += 1;
    if (this.keys.left) moveVector.x -= 1;
    if (this.keys.right) moveVector.x += 1;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

      const nextX = this.position.x + moveVector.x * currentSpeed;
      const nextZ = this.position.z + moveVector.z * currentSpeed;

      // X-axis slide collision
      if (!this.checkCollision(nextX, this.position.z)) {
        this.position.x = nextX;
      }
      // Z-axis slide collision
      if (!this.checkCollision(this.position.x, nextZ)) {
        this.position.z = nextZ;
      }
    }

    // Vertical Gravity & Jump
    this.velocity.y += this.gravity * delta;
    this.position.y += this.velocity.y * delta;
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Camera Placement (1st Person vs 3rd Person)
    if (this.isThirdPerson) {
      const dist = 3.6;
      const camHeight = 1.85;
      const targetY = this.position.y + camHeight;

      // Orbit camera behind player
      const cx = this.position.x + Math.sin(this.yaw) * dist * Math.cos(this.pitch);
      const cz = this.position.z + Math.cos(this.yaw) * dist * Math.cos(this.pitch);
      const cy = targetY + Math.sin(this.pitch) * dist;

      this.camera.position.set(cx, Math.max(0.4, cy), cz);
      this.camera.lookAt(this.position.x, this.position.y + 1.25, this.position.z);

    } else {
      // 1st Person Eyes height of young Samuel (~1.3m)
      this.camera.position.set(this.position.x, this.position.y + 1.3, this.position.z);
      const euler = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ');
      this.camera.quaternion.setFromEuler(euler);
    }
  }

  isMoving() {
    return this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;
  }

  isRunning() {
    return this.isMoving() && this.keys.sprint;
  }
}
