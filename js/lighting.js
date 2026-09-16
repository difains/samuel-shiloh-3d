/**
 * Ancient Shiloh 3D - Sacred Biblical Lighting & Atmosphere
 * Implements PMREMGenerator IBL, dynamic moonlight/dawn/noon modes,
 * and realistic flickering oil lamps & holy altar fire.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class LightingManager {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.currentMode = 'holy_night';
    this.flickerLights = [];

    this.initEnvironmentMap();
    this.initLights();
  }

  initEnvironmentMap() {
    if (this.renderer) {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      this.scene.environment = env;
      this.scene.environmentIntensity = 0.65;
    }
  }

  initLights() {
    // 1. Key Directional Light (Moon / Sun)
    this.dirLight = new THREE.DirectionalLight(0xaad0f0, 0.85);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 220;

    const sSize = 85;
    this.dirLight.shadow.camera.left = -sSize;
    this.dirLight.shadow.camera.right = sSize;
    this.dirLight.shadow.camera.top = sSize;
    this.dirLight.shadow.camera.bottom = -sSize;
    this.dirLight.shadow.bias = -0.0003;
    this.dirLight.shadow.normalBias = 0.04;
    this.scene.add(this.dirLight);

    // 2. Hemisphere Fill Light (Sky / Earth bounce)
    this.hemiLight = new THREE.HemisphereLight(0x223355, 0x140e0a, 0.45);
    this.scene.add(this.hemiLight);

    // 3. Subtle Rim Light
    this.rimLight = new THREE.DirectionalLight(0xffddaa, 0.4);
    this.scene.add(this.rimLight);

    // 4. Atmospheric Fog
    this.fog = new THREE.FogExp2(0x0e1320, 0.011);
    this.scene.fog = this.fog;

    this.applyMode('holy_night');
  }

  registerFlickerLight(light, baseIntensity = 2.4, color = 0xffa044) {
    this.flickerLights.push({
      light,
      baseIntensity,
      color,
      seed: Math.random() * 100
    });
  }

  applyMode(mode) {
    this.currentMode = mode;
    const dist = 90;

    if (mode === 'holy_night') {
      // Midnight in Shiloh Tabernacle (1 Samuel 3)
      this.dirLight.position.set(-35, 75, -45);
      this.dirLight.color.setHex(0x8fa8d6);
      this.dirLight.intensity = 0.75;

      this.hemiLight.color.setHex(0x18243c);
      this.hemiLight.groundColor.setHex(0x0a0806);
      this.hemiLight.intensity = 0.35;

      this.rimLight.intensity = 0.15;
      this.rimLight.color.setHex(0xffaa55);

      this.scene.background = new THREE.Color(0x090d16);
      this.fog.color.setHex(0x0c111c);
      this.fog.density = 0.012;

      if (this.scene.environmentIntensity !== undefined) {
        this.scene.environmentIntensity = 0.45;
      }

    } else if (mode === 'dawn') {
      // Golden Biblical Dawn over Ephraim Mountains
      const elevRad = THREE.MathUtils.degToRad(12);
      const azRad = THREE.MathUtils.degToRad(85); // East
      this.dirLight.position.set(
        dist * Math.cos(elevRad) * Math.sin(azRad),
        dist * Math.sin(elevRad),
        dist * Math.cos(elevRad) * Math.cos(azRad)
      );
      this.dirLight.color.setHex(0xff9e5b);
      this.dirLight.intensity = 2.8;

      this.hemiLight.color.setHex(0x73576e);
      this.hemiLight.groundColor.setHex(0x38281a);
      this.hemiLight.intensity = 0.7;

      this.rimLight.position.set(-40, 20, -30);
      this.rimLight.color.setHex(0xffcb94);
      this.rimLight.intensity = 0.85;

      this.scene.background = new THREE.Color(0x52332a);
      this.fog.color.setHex(0x5a3b32);
      this.fog.density = 0.010;

      if (this.scene.environmentIntensity !== undefined) {
        this.scene.environmentIntensity = 0.75;
      }

    } else if (mode === 'noon') {
      // High Sun over the Promised Land
      this.dirLight.position.set(20, 85, 20);
      this.dirLight.color.setHex(0xfffaec);
      this.dirLight.intensity = 3.2;

      this.hemiLight.color.setHex(0x9bc2e6);
      this.hemiLight.groundColor.setHex(0x5a4632);
      this.hemiLight.intensity = 0.9;

      this.rimLight.position.set(-45, 15, -45);
      this.rimLight.color.setHex(0xfff0d8);
      this.rimLight.intensity = 0.4;

      this.scene.background = new THREE.Color(0x8cb6d9);
      this.fog.color.setHex(0xadcce6);
      this.fog.density = 0.007;

      if (this.scene.environmentIntensity !== undefined) {
        this.scene.environmentIntensity = 0.9;
      }
    }
  }

  cycleMode() {
    const sequence = ['holy_night', 'dawn', 'noon'];
    const nextIdx = (sequence.indexOf(this.currentMode) + 1) % sequence.length;
    this.applyMode(sequence[nextIdx]);
    return this.currentMode;
  }

  update(time) {
    // Torch & Menorah lamp flame flickering
    for (let i = 0; i < this.flickerLights.length; i++) {
      const item = this.flickerLights[i];
      const noise = Math.sin(time * 7.5 + item.seed) * 0.15 + Math.sin(time * 19.3 + item.seed * 2) * 0.08;
      item.light.intensity = item.baseIntensity * (1.0 + noise);
    }
  }
}
