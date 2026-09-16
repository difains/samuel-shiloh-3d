/**
 * Ancient Shiloh 3D - Sacred Architecture & Tabernacle Builder
 * Reconstructs the biblical House of the Lord at Shiloh (1 Samuel 1-4, Exodus 25-27):
 * - The Tabernacle (성막): Linen court curtain, Ark of the Covenant, 7-branched Menorah, Incense Altar
 * - The Courtyard: Bronze Altar of Burnt Offering & Bronze Laver
 * - Eli the High Priest's Chamber (엘리의 침소)
 * - Hannah's Prayer Pillar (한나의 서원 기도 터)
 * - Shiloh City Gate & Watchtower (실로 성문과 망루)
 */
import * as THREE from 'three';

export class SanctuaryBuilder {
  constructor(scene, lightingManager) {
    this.scene = scene;
    this.lighting = lightingManager;
    this.colliders = [];
    this.animatedObjects = [];
    this.textureLoader = new THREE.TextureLoader();

    this.initMaterials();
    this.buildAllLandmarks();
  }

  initMaterials() {
    const loadTex = (path, rx = 2, ry = 2) => {
      const t = this.textureLoader.load(path);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx, ry);
      return t;
    };

    // PBR Textures
    const stoneDiff = loadTex('assets/limestone_diffuse.jpg', 3, 3);
    const stoneNorm = loadTex('assets/limestone_normal.jpg', 3, 3);
    const stoneRough = loadTex('assets/limestone_roughness.jpg', 3, 3);

    const woodDiff = loadTex('assets/wood_diffuse.jpg', 2, 2);
    const woodNorm = loadTex('assets/wood_normal.jpg', 2, 2);
    const woodRough = loadTex('assets/wood_roughness.jpg', 2, 2);

    const fabricDiff = loadTex('assets/tabernacle_fabric_diffuse.jpg', 2, 2);
    const fabricNorm = loadTex('assets/tabernacle_fabric_normal.jpg', 2, 2);
    const fabricRough = loadTex('assets/tabernacle_fabric_roughness.jpg', 2, 2);

    // 1. Ancient Limestone Masonry
    this.matLimestone = new THREE.MeshStandardMaterial({
      map: stoneDiff,
      normalMap: stoneNorm,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: stoneRough,
      roughness: 0.82,
      metalness: 0.05,
      color: 0xded2be
    });

    this.matLimestoneDark = new THREE.MeshStandardMaterial({
      map: stoneDiff,
      normalMap: stoneNorm,
      normalScale: new THREE.Vector2(1.3, 1.3),
      roughnessMap: stoneRough,
      roughness: 0.88,
      metalness: 0.08,
      color: 0x9a8e7e
    });

    // 2. Acacia Wood (조각목 / 싯딤나무)
    this.matAcacia = new THREE.MeshStandardMaterial({
      map: woodDiff,
      normalMap: woodNorm,
      normalScale: new THREE.Vector2(1.0, 1.0),
      roughnessMap: woodRough,
      roughness: 0.72,
      metalness: 0.06,
      color: 0x6e4526
    });

    // 3. Sacred Woven Tabernacle Linen & Veil (청색, 자색, 홍색 실과 가는 베 실)
    this.matSacredFabric = new THREE.MeshStandardMaterial({
      map: fabricDiff,
      normalMap: fabricNorm,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughnessMap: fabricRough,
      roughness: 0.85,
      metalness: 0.02
    });

    // 4. White Court Curtain Linen (세마포 포장)
    this.matCourtLinen = new THREE.MeshStandardMaterial({
      color: 0xede6d8,
      roughness: 0.9,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    // 5. Gold (Pure Gold Overlay for Ark & Menorah)
    this.matGold = new THREE.MeshStandardMaterial({
      color: 0xffc433,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x3d2805,
      emissiveIntensity: 0.2
    });

    // 6. Bronze (놋 제단 및 기둥 받침)
    this.matBronze = new THREE.MeshStandardMaterial({
      color: 0x9a5e2f,
      metalness: 0.8,
      roughness: 0.4
    });

    // 7. Emissive Holy Light (Menorah Flames & Shekinah Glow)
    this.matHolyFlame = new THREE.MeshStandardMaterial({
      color: 0xffd666,
      emissive: 0xffaa22,
      emissiveIntensity: 3.8, // UnrealBloomPass Bloom
      roughness: 0.1
    });

    // 8. Water for Bronze Laver
    this.matWater = new THREE.MeshStandardMaterial({
      color: 0x1d4454,
      roughness: 0.08,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });
  }

  addCollider(x, z, w, d, name = 'Structure') {
    this.colliders.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2,
      name
    });
  }

  buildAllLandmarks() {
    this.buildTabernacleCourtyard();
    this.buildTabernacleTent();
    this.buildBronzeAltarAndLaver();
    this.buildEliChamber();
    this.buildHannahPrayerPillar();
    this.buildCityGateAndWatchtower();
    this.buildOliveGroveAndWell();
  }

  // =========================================================================
  // 1. Tabernacle Courtyard (성막 뜰: 출 27:9-19)
  // =========================================================================
  buildTabernacleCourtyard() {
    // 100 x 50 cubits (approx 46m x 23m)
    const cL = 46, cW = 23, cH = 2.4;
    const postMat = this.matBronze;
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xd8d8e0, metalness: 0.85, roughness: 0.25 });

    // Perimeter pillars and white linen hangings
    const numL = 20, numW = 10;
    const spacingX = cW / numW;
    const spacingZ = cL / numL;

    // North & South Linen walls
    [-cW / 2, cW / 2].forEach(px => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(cL, cH), this.matCourtLinen);
      wall.position.set(px, cH / 2, 0);
      wall.rotation.y = Math.PI / 2;
      this.scene.add(wall);
    });

    // West Linen wall
    const westWall = new THREE.Mesh(new THREE.PlaneGeometry(cW, cH), this.matCourtLinen);
    westWall.position.set(0, cH / 2, -cL / 2);
    this.scene.add(westWall);

    // East Gate with embroidered colorful screen (20 cubits / 9.2m wide)
    const gateW = 9.2;
    const sideW = (cW - gateW) / 2;
    // Left & right white portions
    [-cW / 2 + sideW / 2, cW / 2 - sideW / 2].forEach(ex => {
      const side = new THREE.Mesh(new THREE.PlaneGeometry(sideW, cH), this.matCourtLinen);
      side.position.set(ex, cH / 2, cL / 2);
      this.scene.add(side);
    });

    // Colorful Gate Screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(gateW, cH), this.matSacredFabric);
    screen.position.set(0, cH / 2, cL / 2);
    this.scene.add(screen);

    // Pillars with silver caps & bronze bases
    const addPillar = (x, z) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, cH, 8), postMat);
      p.position.set(x, cH / 2, z);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.15, 8), silverMat);
      cap.position.set(x, cH + 0.05, z);
      this.scene.add(p);
      this.scene.add(cap);
    };

    for (let i = 0; i <= numL; i++) {
      const z = -cL / 2 + i * spacingZ;
      addPillar(-cW / 2, z);
      addPillar(cW / 2, z);
    }

    // Add Colliders for Court boundaries
    this.addCollider(-cW / 2, 0, 1.0, cL, 'Court North Wall');
    this.addCollider(cW / 2, 0, 1.0, cL, 'Court South Wall');
    this.addCollider(0, -cL / 2, cW, 1.0, 'Court West Wall');
    this.addCollider(-cW / 2 + sideW / 2, cL / 2, sideW, 1.0, 'Court East Gate Left');
    this.addCollider(cW / 2 - sideW / 2, cL / 2, sideW, 1.0, 'Court East Gate Right');
  }

  // =========================================================================
  // 2. The Tabernacle Building (성막 본전: 지성소 & 성소, 출 26장, 삼상 3장)
  // =========================================================================
  buildTabernacleTent() {
    const group = new THREE.Group();
    group.position.set(0, 0, -8); // Situated in the western half of courtyard

    const tL = 14.0, tW = 5.0, tH = 4.6;

    // 1. Gold-overlaid Acacia Wall Planks (30 cubits x 10 cubits)
    const wallGeom = new THREE.BoxGeometry(0.3, tH, tL);
    [-tW / 2, tW / 2].forEach(wx => {
      const wall = new THREE.Mesh(wallGeom, this.matGold);
      wall.position.set(wx, tH / 2, 0);
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);
    });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(tW, tH, 0.3), this.matGold);
    backWall.position.set(0, tH / 2, -tL / 2);
    backWall.castShadow = true;
    group.add(backWall);

    // 2. Multi-Layered Roof Covering
    // Inner fine twined linen embroidered ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(tW, tL), this.matSacredFabric);
    ceiling.position.set(0, tH, 0);
    ceiling.rotation.x = Math.PI / 2;
    group.add(ceiling);

    // Tent Peak & Red-Dyed Ram Skin Roof
    const roofGeom = new THREE.BoxGeometry(tW + 1.2, 0.3, tL + 0.8);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x5a2318, roughness: 0.9 }); // Red dyed ram skins
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, tH + 0.15, 0);
    roof.castShadow = true;
    group.add(roof);

    // 3. The Holy Veil (휘장: 성소와 지성소를 나누는 휘장)
    // Most Holy Place is 5m x 5m at the back (z = -2 to -7)
    const veil = new THREE.Mesh(new THREE.PlaneGeometry(tW - 0.2, tH - 0.2), this.matSacredFabric);
    veil.position.set(0, tH / 2, -2.0);
    group.add(veil);

    // 4. Most Holy Place: The Ark of the Covenant (지성소 언약궤: 출 25:10-22)
    const arkGroup = new THREE.Group();
    arkGroup.position.set(0, 0, -5.2);

    // Ark Chest (2.5 x 1.5 x 1.5 cubits -> approx 1.15m x 0.7m x 0.7m)
    const chestGeom = new THREE.BoxGeometry(1.2, 0.7, 0.75);
    const chest = new THREE.Mesh(chestGeom, this.matGold);
    chest.position.y = 0.45;
    chest.castShadow = true;
    arkGroup.add(chest);

    // Mercy Seat (속죄소 / 시은좌)
    const mercySeat = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.12, 0.8), this.matGold);
    mercySeat.position.y = 0.85;
    arkGroup.add(mercySeat);

    // Two Golden Cherubim (두 그룹) with outspread wings facing each other
    [-0.45, 0.45].forEach(cx => {
      const cherub = new THREE.Group();
      cherub.position.set(cx, 0.9, 0);

      // Body & Head
      const cBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.38, 8), this.matGold);
      cherub.add(cBody);
      const cHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), this.matGold);
      cHead.position.y = 0.25;
      cherub.add(cHead);

      // Outspread Wing overshadowing mercy seat
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.42), this.matGold);
      wing.position.set(-cx * 0.25, 0.32, 0);
      wing.rotation.z = (cx > 0) ? -Math.PI / 5 : Math.PI / 5;
      cherub.add(wing);

      arkGroup.add(cherub);
    });

    // Shekinah Presence Glow Light (하나님의 영광의 빛)
    const arkLight = new THREE.PointLight(0xffdd66, 3.8, 12, 1.8);
    arkLight.position.set(0, 1.4, 0);
    arkGroup.add(arkLight);
    if (this.lighting) {
      this.lighting.registerFlickerLight(arkLight, 3.8, 0xffdd66);
    }

    group.add(arkGroup);

    // 5. Holy Place: The 7-Branched Golden Menorah (일곱 금 등잔대: 출 25:31-40)
    const menorahGroup = new THREE.Group();
    menorahGroup.position.set(-1.6, 0, 1.5);

    // Menorah Base & Central Shaft
    const mBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.12, 12), this.matGold);
    mBase.position.y = 0.06;
    menorahGroup.add(mBase);

    const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.5, 8), this.matGold);
    mShaft.position.y = 0.8;
    menorahGroup.add(mShaft);

    // 6 Curved Branch Arms (3 pairs)
    const armRadii = [0.28, 0.52, 0.75];
    armRadii.forEach(r => {
      [-1, 1].forEach(dir => {
        const arm = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 16, Math.PI / 2), this.matGold);
        arm.position.set(0, 0.85, 0);
        arm.rotation.y = (dir > 0) ? 0 : Math.PI;
        arm.rotation.z = -Math.PI / 2;
        menorahGroup.add(arm);
      });
    });

    // 7 Golden Lamp Cups with Burning Olive Oil Flames
    const lampPositions = [-0.75, -0.52, -0.28, 0, 0.28, 0.52, 0.75];
    lampPositions.forEach((lx, idx) => {
      const cup = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 8), this.matGold);
      cup.position.set(lx, 1.55, 0);
      menorahGroup.add(cup);

      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), this.matHolyFlame);
      flame.position.set(lx, 1.63, 0);
      menorahGroup.add(flame);
    });

    // Menorah Point Light (Warm sacred room fill)
    const menorahLight = new THREE.PointLight(0xffa834, 4.2, 16, 1.4);
    menorahLight.position.set(0, 1.8, 0);
    menorahGroup.add(menorahLight);
    if (this.lighting) {
      this.lighting.registerFlickerLight(menorahLight, 4.2, 0xffa834);
    }

    group.add(menorahGroup);

    // 6. Golden Altar of Incense (분향단: 출 30:1-6)
    const incenseAltar = new THREE.Group();
    incenseAltar.position.set(0, 0, -1.2);
    const iBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.7), this.matGold);
    iBox.position.y = 0.55;
    iBox.castShadow = true;
    incenseAltar.add(iBox);

    // Incense smoke embers
    const iFire = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), this.matHolyFlame);
    iFire.position.y = 1.15;
    incenseAltar.add(iFire);
    group.add(incenseAltar);

    // 7. Table of Showbread (진설병 상: 출 25:23-30)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(1.6, 0, 1.5);
    const tTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.7), this.matGold);
    tTop.position.y = 0.75;
    tableGroup.add(tTop);
    [-0.5, 0.5].forEach(tx => {
      [-0.25, 0.25].forEach(tz => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 6), this.matGold);
        leg.position.set(tx, 0.375, tz);
        tableGroup.add(leg);
      });
    });
    group.add(tableGroup);

    // 8. Young Samuel's Sleeping Pallet (사무엘이 누웠던 자리: 삼상 3:3)
    const bedGroup = new THREE.Group();
    bedGroup.position.set(1.4, 0.05, -3.8); // Beside the inner sanctuary
    const mat = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 1.8), new THREE.MeshStandardMaterial({ color: 0x8a7662, roughness: 0.9 }));
    bedGroup.add(mat);
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 1.1), new THREE.MeshStandardMaterial({ color: 0x3d4e60, roughness: 0.85 }));
    blanket.position.set(0, 0.08, 0.2);
    bedGroup.add(blanket);
    group.add(bedGroup);

    this.scene.add(group);

    // Add Colliders for Tabernacle Walls
    this.addCollider(-tW / 2, -8, 0.6, tL, 'Tabernacle North Wall');
    this.addCollider(tW / 2, -8, 0.6, tL, 'Tabernacle South Wall');
    this.addCollider(0, -8 - tL / 2, tW, 0.6, 'Tabernacle West Wall');
  }

  // =========================================================================
  // 3. Bronze Altar & Laver (놋 번제단과 물두멍: 출 27:1-8, 30:17-21)
  // =========================================================================
  buildBronzeAltarAndLaver() {
    // 1. Bronze Altar of Burnt Offering (5x5 cubits / approx 2.3m x 2.3m x 1.4m)
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 0, 8.5);

    const baseBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.35, 2.6), this.matBronze);
    baseBox.position.y = 0.675;
    baseBox.castShadow = true;
    baseBox.receiveShadow = true;
    altarGroup.add(baseBox);

    // Four Horns on corners (네 뿔)
    [-1.2, 1.2].forEach(hx => {
      [-1.2, 1.2].forEach(hz => {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 6), this.matBronze);
        horn.position.set(hx, 1.45, hz);
        altarGroup.add(horn);
      });
    });

    // Grating & Glowing Charcoal Embers
    const coals = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.15, 2.1),
      new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff4400,
        emissiveIntensity: 3.5,
        roughness: 0.2
      })
    );
    coals.position.y = 1.38;
    altarGroup.add(coals);

    // Altar fire light
    const altarLight = new THREE.PointLight(0xff7722, 4.5, 22, 1.3);
    altarLight.position.set(0, 2.4, 0);
    altarGroup.add(altarLight);
    if (this.lighting) {
      this.lighting.registerFlickerLight(altarLight, 4.5, 0xff7722);
    }

    this.scene.add(altarGroup);
    this.addCollider(0, 8.5, 3.2, 3.2, 'Bronze Altar');

    // 2. Bronze Laver (물두멍: 번제단과 성막 사이)
    const laverGroup = new THREE.Group();
    laverGroup.position.set(0, 0, 2.0);

    const basePillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.55, 0.65, 12), this.matBronze);
    basePillar.position.y = 0.325;
    laverGroup.add(basePillar);

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.45, 0.6, 16), this.matBronze);
    bowl.position.y = 0.85;
    laverGroup.add(bowl);

    const water = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.05, 16), this.matWater);
    water.position.y = 1.05;
    laverGroup.add(water);

    this.scene.add(laverGroup);
    this.addCollider(0, 2.0, 2.4, 2.4, 'Bronze Laver');
  }

  // =========================================================================
  // 4. High Priest Eli's Chamber (대제사장 엘리의 방: 삼상 3:2, 4:18)
  // =========================================================================
  buildEliChamber() {
    const group = new THREE.Group();
    group.position.set(-18.5, 0, 14.0); // South-west of the tabernacle court gate

    const rW = 7.0, rL = 8.5, rH = 3.6;

    // Stone walls
    const wallMat = this.matLimestone;
    const room = new THREE.Mesh(new THREE.BoxGeometry(rW, rH, rL), wallMat);
    room.position.y = rH / 2;
    room.castShadow = true;
    room.receiveShadow = true;
    group.add(room);

    // Flat roof with clay plaster terrace
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(rW + 0.4, 0.3, rL + 0.4), this.matLimestoneDark);
    terrace.position.y = rH + 0.15;
    group.add(terrace);

    // Doorway opening (cutout visual)
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.3), this.matAcacia);
    doorFrame.position.set(0, 1.2, rL / 2 + 0.05);
    group.add(doorFrame);

    // Old Eli's Wooden Bed / Couch inside
    const couch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 2.6), this.matAcacia);
    couch.position.set(1.8, 0.25, 0);
    group.add(couch);

    // High Seat of Judgment (엘리가 앉았던 의자: 삼상 4:18)
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.8), this.matAcacia);
    chair.position.set(-1.8, 0.6, -1.8);
    group.add(chair);

    // Chamber Lamp (Warm bedside bloom light)
    const chamberLight = new THREE.PointLight(0xff9944, 2.4, 12, 1.5);
    chamberLight.position.set(0, 2.2, 0);
    group.add(chamberLight);
    if (this.lighting) {
      this.lighting.registerFlickerLight(chamberLight, 2.4, 0xff9944);
    }

    this.scene.add(group);
    this.addCollider(-18.5, 14.0, rW + 0.5, rL + 0.5, "Eli's Chamber");
  }

  // =========================================================================
  // 5. Hannah's Prayer Pillar (한나의 서원 기도 터: 삼상 1:9-11)
  // =========================================================================
  buildHannahPrayerPillar() {
    const group = new THREE.Group();
    group.position.set(6.0, 0, 22.5); // Beside the court entrance doorpost

    // Commemorative polished limestone pillar base
    const pBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 1.4), this.matLimestoneDark);
    pBase.position.y = 0.2;
    group.add(pBase);

    // Doorpost pillar where Eli observed Hannah's lips moving without sound
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 3.2, 10), this.matLimestone);
    pillar.position.y = 1.8;
    pillar.castShadow = true;
    group.add(pillar);

    // Olive oil memorial lamp on pillar
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.12, 8), this.matBronze);
    lamp.position.y = 3.45;
    group.add(lamp);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), this.matHolyFlame);
    flame.position.y = 3.55;
    group.add(flame);

    const pLight = new THREE.PointLight(0xffa855, 2.2, 12, 1.4);
    pLight.position.set(0, 3.7, 0);
    group.add(pLight);
    if (this.lighting) {
      this.lighting.registerFlickerLight(pLight, 2.2, 0xffa855);
    }

    this.scene.add(group);
    this.addCollider(6.0, 22.5, 1.8, 1.8, "Hannah's Prayer Pillar");
  }

  // =========================================================================
  // 6. Shiloh City Gate & Watchtower (실로 성문과 망루: 삼상 3:19-21, 4:13)
  // =========================================================================
  buildCityGateAndWatchtower() {
    const group = new THREE.Group();
    group.position.set(0, 0, 38.0); // South entrance to the town from Bethel road

    const gateW = 16.0, gateH = 5.2, gateD = 4.2;

    // Twin Fortified Gate Towers
    [-5.5, 5.5].forEach(tx => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.8, 4.2), this.matLimestone);
      tower.position.set(tx, 3.4, 0);
      tower.castShadow = true;
      tower.receiveShadow = true;
      group.add(tower);

      // Battlements
      const roof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.8, 4.6), this.matLimestoneDark);
      roof.position.set(tx, 7.1, 0);
      group.add(roof);
    });

    // Central Archway Header
    const arch = new THREE.Mesh(new THREE.BoxGeometry(7.0, 1.8, 3.8), this.matLimestone);
    arch.position.set(0, 4.3, 0);
    arch.castShadow = true;
    group.add(arch);

    // Heavy Wooden Double Gate
    [-1.6, 1.6].forEach(gx => {
      const door = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.4, 0.25), this.matAcacia);
      door.position.set(gx, 1.7, 0);
      group.add(door);
    });

    // Wall torch lanterns on gate towers
    [-3.2, 3.2].forEach(lx => {
      const torchLight = new THREE.PointLight(0xff9433, 2.8, 14, 1.4);
      torchLight.position.set(lx, 3.6, 2.3);
      group.add(torchLight);
      if (this.lighting) {
        this.lighting.registerFlickerLight(torchLight, 2.8, 0xff9433);
      }
    });

    this.scene.add(group);
    this.addCollider(-5.5, 38.0, 4.8, 4.8, 'West Gate Tower');
    this.addCollider(5.5, 38.0, 4.8, 4.8, 'East Gate Tower');
  }

  // =========================================================================
  // 7. North Olive Grove & Ancient Well (실로 북쪽 올리브 과원: 삿 21:19)
  // =========================================================================
  buildOliveGroveAndWell() {
    const group = new THREE.Group();
    group.position.set(22.0, 0, -26.0); // Hilltop olive terrace north of tabernacle

    // Ancient Stone Water Well Curb
    const wellBase = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.2, 0.9, 16), this.matLimestone);
    wellBase.position.y = 0.45;
    wellBase.castShadow = true;
    group.add(wellBase);

    const wellWater = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.1, 16), this.matWater);
    wellWater.position.y = 0.65;
    group.add(wellWater);

    // Stone watering troughs for sheep and donkeys
    [-2.5, 2.5].forEach(tx => {
      const trough = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.7), this.matLimestoneDark);
      trough.position.set(tx, 0.225, 0);
      group.add(trough);
    });

    this.scene.add(group);
    this.addCollider(22.0, -26.0, 3.6, 3.6, 'Olive Grove Well');
  }
}
