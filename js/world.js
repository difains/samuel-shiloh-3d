/**
 * Ancient Shiloh 3D - Environment, Terrain & World Systems
 * Implements Ephraim hill terrain, ancient olive orchards, date palms,
 * holy fire embers, and the enclosing Canaan mountain valley panorama.
 */
import * as THREE from 'three';

export class WorldManager {
  constructor(scene, colliders) {
    this.scene = scene;
    this.colliders = colliders;
    this.particles = [];
    this.textureLoader = new THREE.TextureLoader();

    this.initTerrain();
    this.initPathways();
    this.initMountainBackdrop();
    this.initTreesAndVegetation();
    this.initParticles();
  }

  initTerrain() {
    const size = 170;
    const geom = new THREE.PlaneGeometry(size, size, 48, 48);
    geom.rotateX(-Math.PI / 2);

    // Sculpt gentle rolling hills of Ephraim
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      // Terraced hill slopes rising outward
      if (dist > 18) {
        const hill = Math.sin(x * 0.07) * Math.cos(z * 0.07) * 1.2 + Math.sin(x * 0.12) * 0.4;
        pos.setY(i, Math.max(0, hill * Math.min(1.0, (dist - 18) / 35)));
      }
    }
    geom.computeVertexNormals();

    const earthDiff = this.textureLoader.load('assets/desert_earth_diffuse.jpg');
    earthDiff.wrapS = earthDiff.wrapT = THREE.RepeatWrapping;
    earthDiff.repeat.set(20, 20);

    const earthNorm = this.textureLoader.load('assets/desert_earth_normal.jpg');
    earthNorm.wrapS = earthNorm.wrapT = THREE.RepeatWrapping;
    earthNorm.repeat.set(20, 20);

    const earthRough = this.textureLoader.load('assets/desert_earth_roughness.jpg');
    earthRough.wrapS = earthRough.wrapT = THREE.RepeatWrapping;
    earthRough.repeat.set(20, 20);

    const groundMat = new THREE.MeshStandardMaterial({
      map: earthDiff,
      normalMap: earthNorm,
      normalScale: new THREE.Vector2(1.3, 1.3),
      roughnessMap: earthRough,
      roughness: 0.88,
      metalness: 0.04,
      color: 0xc89e74 // Warm terracotta soil of Canaan
    });

    const ground = new THREE.Mesh(geom, groundMat);
    ground.receiveShadow = true;
    ground.position.y = -0.05;
    this.scene.add(ground);

    const bHalf = size / 2 - 5;
    this.colliders.push({ minX: -bHalf, maxX: bHalf, minZ: -bHalf, maxZ: -bHalf + 2, name: 'North Border' });
    this.colliders.push({ minX: -bHalf, maxX: bHalf, minZ: bHalf - 2, maxZ: bHalf, name: 'South Border' });
    this.colliders.push({ minX: -bHalf, maxX: -bHalf + 2, minZ: -bHalf, maxZ: bHalf, name: 'West Border' });
    this.colliders.push({ minX: bHalf - 2, maxX: bHalf, minZ: -bHalf, maxZ: bHalf, name: 'East Border' });
  }

  initPathways() {
    // Packed Ancient Stone & Dust Roads
    const roadDiff = this.textureLoader.load('assets/desert_earth_diffuse.jpg');
    roadDiff.wrapS = roadDiff.wrapT = THREE.RepeatWrapping;
    roadDiff.repeat.set(2, 8);

    const roadMat = new THREE.MeshStandardMaterial({
      map: roadDiff,
      roughness: 0.82,
      metalness: 0.05,
      color: 0xbaa085
    });

    // Connecting roads between Gate, Sanctuary, Eli's Room, and Olive Grove
    const paths = [
      { x: 0, z: 30, w: 4.8, l: 18, rot: 0 },         // South Gate to Court Entrance
      { x: 0, z: 14, w: 4.2, l: 14, rot: 0 },         // Into the Courtyard
      { x: -9, z: 18, w: 3.6, l: 15, rot: Math.PI / 3 }, // Path to Eli's Chamber
      { x: 11, z: -14, w: 3.8, l: 28, rot: -Math.PI / 4 } // Path to North Olive Grove
    ];

    paths.forEach(p => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.l), roadMat);
      mesh.rotateX(-Math.PI / 2);
      mesh.rotateZ(p.rot);
      mesh.position.set(p.x, 0.02, p.z);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }

  initMountainBackdrop() {
    // Enclosing Panoramic Horizon Cylinder (240m height) with the generated Biblical Canaan backdrop
    const backdropTex = this.textureLoader.load('assets/canaan_backdrop.jpg');
    backdropTex.wrapS = THREE.RepeatWrapping;
    backdropTex.repeat.set(2, 1);

    const cylGeom = new THREE.CylinderGeometry(175, 175, 240, 48, 1, true);
    const cylMat = new THREE.MeshBasicMaterial({
      map: backdropTex,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false
    });

    const backdropMesh = new THREE.Mesh(cylGeom, cylMat);
    backdropMesh.position.set(0, 50, 0);
    backdropMesh.rotation.y = -Math.PI * 0.45; // Orient sunset and mountain vista
    this.scene.add(backdropMesh);
  }

  initTreesAndVegetation() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3625, roughness: 0.9 });
    const oliveMat = new THREE.MeshStandardMaterial({ color: 0x48583d, roughness: 0.82 }); // Silver-green olive leaves
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x3d6632, roughness: 0.8 });

    // 1. Ancient Gnarled Olive Trees (올리브 나무)
    const olivePositions = [
      [22, -20], [28, -24], [18, -32], [32, -30], [25, -38],
      [-26, -18], [-32, -24], [-22, -30], [-35, -12],
      [-28, 22], [-34, 28], [24, 22], [30, 28], [26, 36]
    ];

    olivePositions.forEach(([ox, oz], idx) => {
      const tree = new THREE.Group();
      // Twisted gnarled trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 3.2, 8), trunkMat);
      trunk.position.y = 1.6;
      trunk.castShadow = true;
      tree.add(trunk);

      // Multi-cluster sculpted olive canopy
      const canopy = new THREE.Group();
      canopy.position.y = 3.6;

      const clusters = [
        { x: 0, y: 0.4, z: 0, r: 2.2 },
        { x: -1.0, y: -0.2, z: 0.6, r: 1.6 },
        { x: 0.9, y: -0.1, z: -0.7, r: 1.7 },
        { x: 0.5, y: 0.3, z: 0.8, r: 1.5 },
        { x: -0.7, y: 0.1, z: -0.8, r: 1.5 }
      ];

      clusters.forEach(c => {
        const leafCluster = new THREE.Mesh(new THREE.DodecahedronGeometry(c.r, 1), oliveMat);
        leafCluster.position.set(c.x, c.y, c.z);
        leafCluster.castShadow = true;
        canopy.add(leafCluster);
      });

      tree.add(canopy);
      tree.position.set(ox, 0, oz);
      this.scene.add(tree);
      this.colliders.push({ minX: ox - 0.8, maxX: ox + 0.8, minZ: oz - 0.8, maxZ: oz + 0.8, name: 'Olive Tree' });
    });

    // 2. Tall Date Palms (종려나무)
    const palmPositions = [
      [14, 34], [-14, 34], [18, 4], [-18, -4], [35, 8], [-36, 6]
    ];

    palmPositions.forEach(([px, pz]) => {
      const palm = new THREE.Group();
      // Ringed trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 7.5, 8), trunkMat);
      trunk.position.y = 3.75;
      trunk.castShadow = true;
      palm.add(trunk);

      // Palm fronds
      for (let f = 0; f < 8; f++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3.2, 4), palmMat);
        frond.position.set(0, 7.5, 0);
        frond.rotation.z = Math.PI / 2.6;
        frond.rotation.y = (f / 8) * Math.PI * 2;
        frond.scale.set(1.0, 1.0, 0.2);
        frond.castShadow = true;
        palm.add(frond);
      }

      palm.position.set(px, 0, pz);
      this.scene.add(palm);
      this.colliders.push({ minX: px - 0.6, maxX: px + 0.6, minZ: pz - 0.6, maxZ: pz + 0.6, name: 'Palm Tree' });
    });
  }

  initParticles() {
    // 1. Bronze Altar Fire Embers & Smoke
    const emberCount = 38;
    const emberGeom = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    const emberVel = [];

    const altarCenter = { x: 0, y: 1.8, z: 8.5 };

    for (let i = 0; i < emberCount; i++) {
      emberPos[i * 3] = altarCenter.x + (Math.random() - 0.5) * 1.8;
      emberPos[i * 3 + 1] = altarCenter.y + Math.random() * 2.5;
      emberPos[i * 3 + 2] = altarCenter.z + (Math.random() - 0.5) * 1.8;
      emberVel.push({
        vy: 0.8 + Math.random() * 0.7,
        driftX: (Math.random() - 0.5) * 0.3,
        driftZ: (Math.random() - 0.5) * 0.3,
        baseY: altarCenter.y
      });
    }
    emberGeom.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));

    const emberMat = new THREE.PointsMaterial({
      color: 0xff8833,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const emberSystem = new THREE.Points(emberGeom, emberMat);
    this.scene.add(emberSystem);

    this.particles.push({
      update: (delta) => {
        for (let i = 0; i < emberCount; i++) {
          emberPos[i * 3 + 1] += emberVel[i].vy * delta;
          emberPos[i * 3] += emberVel[i].driftX * delta;
          emberPos[i * 3 + 2] += emberVel[i].driftZ * delta;

          if (emberPos[i * 3 + 1] > emberVel[i].baseY + 5.0) {
            emberPos[i * 3] = altarCenter.x + (Math.random() - 0.5) * 1.8;
            emberPos[i * 3 + 1] = emberVel[i].baseY;
            emberPos[i * 3 + 2] = altarCenter.z + (Math.random() - 0.5) * 1.8;
          }
        }
        emberGeom.attributes.position.needsUpdate = true;
      }
    });

    // 2. Soft Floating Sanctuary Glow / Night Motes
    const moteCount = 50;
    const moteGeom = new THREE.BufferGeometry();
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 45;
      motePos[i * 3 + 1] = 0.5 + Math.random() * 6.0;
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    moteGeom.setAttribute('position', new THREE.BufferAttribute(motePos, 3));

    const moteMat = new THREE.PointsMaterial({
      color: 0xffe2a4,
      size: 0.16,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const moteSystem = new THREE.Points(moteGeom, moteMat);
    this.scene.add(moteSystem);

    this.particles.push({
      update: (delta) => {
        moteSystem.rotation.y += delta * 0.04;
      }
    });
  }

  update(delta) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(delta);
    }
  }
}
