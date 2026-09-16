/**
 * Ancient Shiloh 3D - Protagonist: Young Samuel (어린 사무엘)
 * Modeled according to 1 Samuel 2:18-19:
 * - White linen ephod (세마포 에봇)
 * - Little outer robe made by his mother Hannah (어머니 한나가 지어준 작은 겉옷)
 * - Handheld clay oil lamp casting warm light
 * - Interactive [G] Prayer kneeling mode with holy particle aura
 */
import * as THREE from 'three';

export class YoungSamuelAvatar {
  constructor(scene, lightingManager, audioEngine) {
    this.scene = scene;
    this.lighting = lightingManager;
    this.audio = audioEngine;
    this.group = new THREE.Group();
    this.isPraying = false;
    this.walkCycle = 0;

    this.initMeshes();
    this.scene.add(this.group);
  }

  initMeshes() {
    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfb48c, roughness: 0.65 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2e1c12, roughness: 0.85 });
    
    // Pure white linen ephod (세마포)
    this.matEphod = new THREE.MeshStandardMaterial({
      color: 0xf4eedf,
      roughness: 0.88,
      metalness: 0.02
    });

    // Mother Hannah's little blue-indigo robe (작은 겉옷)
    this.matRobe = new THREE.MeshStandardMaterial({
      color: 0x3d5269,
      roughness: 0.85,
      metalness: 0.04
    });

    const clayMat = new THREE.MeshStandardMaterial({ color: 0x8a5435, roughness: 0.8 });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xff7711,
      emissive: 0xffaa22,
      emissiveIntensity: 3.2,
      roughness: 0.1
    });

    // 1. Torso & Robe
    this.torso = new THREE.Group();
    this.torso.position.y = 0.85;

    // Inner linen tunic
    const tunicMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.28), this.matEphod);
    this.torso.add(tunicMesh);

    // Outer Robe / Ephod Vest overlay
    const robeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.45, 0.31), this.matRobe);
    robeMesh.position.y = 0.04;
    this.torso.add(robeMesh);

    // Sacred girdle / belt
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.33), new THREE.MeshStandardMaterial({ color: 0xb58b42, roughness: 0.5 }));
    belt.position.y = -0.12;
    this.torso.add(belt);

    this.group.add(this.torso);

    // 2. Head & Hair
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 1.35;

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.28), skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Gentle boyish hair
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.18, 0.31), hairMat);
    hair.position.set(0, 0.12, -0.02);
    this.headGroup.add(hair);

    this.group.add(this.headGroup);

    // 3. Arms
    const armGeom = new THREE.BoxGeometry(0.13, 0.42, 0.13);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.28, 1.1, 0);
    const lArmMesh = new THREE.Mesh(armGeom, this.matEphod);
    lArmMesh.position.y = -0.18;
    this.leftArm.add(lArmMesh);
    this.group.add(this.leftArm);

    // Right Arm (holds the oil lamp)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.28, 1.1, 0);
    const rArmMesh = new THREE.Mesh(armGeom, this.matEphod);
    rArmMesh.position.y = -0.18;
    this.rightArm.add(rArmMesh);

    // Handheld Ancient Terracotta Oil Lamp (올리브 기름 등잔)
    this.lampGroup = new THREE.Group();
    this.lampGroup.position.set(0.04, -0.4, 0.14);

    const lampBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.05, 8), clayMat);
    this.lampGroup.add(lampBowl);

    const lampNozzle = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 6), clayMat);
    lampNozzle.position.set(0, 0, 0.08);
    lampNozzle.rotation.x = Math.PI / 2.5;
    this.lampGroup.add(lampNozzle);

    // Oil Flame (High Bloom glow)
    this.flame = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), flameMat);
    this.flame.position.set(0, 0.04, 0.09);
    this.lampGroup.add(this.flame);

    // Dynamic point light from Samuel's lamp
    this.lampLight = new THREE.PointLight(0xffa844, 2.2, 14, 1.5);
    this.lampLight.position.set(0, 0.15, 0.1);
    this.lampGroup.add(this.lampLight);
    if (this.lighting) {
      this.lighting.registerFlickerLight(this.lampLight, 2.2, 0xffa844);
    }

    this.rightArm.add(this.lampGroup);
    this.group.add(this.rightArm);

    // 4. Legs
    const legGeom = new THREE.BoxGeometry(0.16, 0.52, 0.16);

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.12, 0.55, 0);
    const lLegMesh = new THREE.Mesh(legGeom, this.matEphod);
    lLegMesh.position.y = -0.24;
    lLegMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.12, 0.55, 0);
    const rLegMesh = new THREE.Mesh(legGeom, this.matEphod);
    rLegMesh.position.y = -0.24;
    rLegMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);
    this.group.add(this.rightLeg);

    // 5. Holy Prayer Particle Halo (Activated on [G])
    const auraCount = 36;
    const auraGeom = new THREE.BufferGeometry();
    const auraPos = new Float32Array(auraCount * 3);
    for (let i = 0; i < auraCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.3 + Math.random() * 0.45;
      auraPos[i * 3] = Math.cos(theta) * rad;
      auraPos[i * 3 + 1] = 0.2 + Math.random() * 1.5;
      auraPos[i * 3 + 2] = Math.sin(theta) * rad;
    }
    auraGeom.setAttribute('position', new THREE.BufferAttribute(auraPos, 3));

    this.matAura = new THREE.PointsMaterial({
      color: 0xffdf88,
      size: 0.18,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    this.auraMesh = new THREE.Points(auraGeom, this.matAura);
    this.group.add(this.auraMesh);
  }

  togglePrayerMode() {
    this.isPraying = !this.isPraying;
    if (this.isPraying && this.audio) {
      this.audio.playPrayerChime();
    }
    return this.isPraying;
  }

  updateAnimation(isMoving, isRunning, delta) {
    if (this.isPraying) {
      // Kneeling prayer posture: "말씀하옵소서 주의 종이 듣겠나이다"
      this.group.position.y = -0.22;
      this.leftLeg.rotation.x = -Math.PI / 3;
      this.rightLeg.rotation.x = -Math.PI / 3;
      this.leftArm.rotation.x = -Math.PI / 2.6;
      this.leftArm.rotation.z = -0.3;
      this.rightArm.rotation.x = -Math.PI / 2.6;
      this.rightArm.rotation.z = 0.3;
      this.headGroup.rotation.x = -0.25; // Looking upward toward heaven

      // Golden Holy Presence Aura shimmer
      this.matAura.opacity = 0.85 + Math.sin(this.walkCycle * 5) * 0.15;
      this.auraMesh.rotation.y += delta * 1.5;
      this.lampLight.intensity = 3.6 + Math.sin(this.walkCycle * 6) * 0.6;
      this.walkCycle += delta * 2.0;

    } else if (isMoving) {
      this.group.position.y = Math.abs(Math.sin(this.walkCycle * 2)) * 0.05;
      this.matAura.opacity = 0.0;
      this.headGroup.rotation.x = 0;

      const speedMult = isRunning ? 13 : 8.5;
      this.walkCycle += delta * speedMult;

      const swing = Math.sin(this.walkCycle) * 0.55;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.6;
      this.leftArm.rotation.z = 0;
      this.rightArm.rotation.x = swing * 0.25 - 0.2; // Keep lamp forward
      this.rightArm.rotation.z = 0;

    } else {
      // Gentle breathing idle
      this.walkCycle += delta * 1.8;
      this.matAura.opacity = 0.0;
      this.group.position.y = Math.sin(this.walkCycle) * 0.015;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = Math.sin(this.walkCycle) * 0.04;
      this.rightArm.rotation.x = -0.2 + Math.sin(this.walkCycle) * 0.03;
      this.headGroup.rotation.x = 0;
    }
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  setRotationY(rad) {
    this.group.rotation.y = rad;
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
