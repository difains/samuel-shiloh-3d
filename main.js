/**
 * Ancient Shiloh 3D - Main Application Entry Point
 * Orchestrates Three.js PBR rendering, UnrealBloomPass post-processing,
 * Seijaku-grade HUD, biblical audio engine, and player exploration.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { LightingManager } from './js/lighting.js';
import { WorldManager } from './js/world.js';
import { SanctuaryBuilder } from './js/sanctuary.js';
import { YoungSamuelAvatar } from './js/player.js';
import { PlayerController } from './js/controller.js';
import { LoreManager } from './js/lore.js';
import { MinimapManager } from './js/minimap.js';
import { BiblicalAudioEngine } from './js/audio.js';

class ShilohApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.colliders = [];
    this.clock = new THREE.Clock();

    this.initScene();
    this.initPostProcessing();
    this.initSystems();
    this.initHUD();
    this.animate();

    window.__shilohApp = this;
  }

  initScene() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );

    // 2. WebGL Renderer with High Dynamic Range & Film Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onResize());
  }

  initPostProcessing() {
    // UnrealBloomPass setup for sacred golden menorah & ark glows
    const renderPass = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.65,  // Strength
      0.45,  // Radius
      0.82   // Threshold (emissive objects bloom)
    );

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);
  }

  initSystems() {
    // Audio Engine
    this.audio = new BiblicalAudioEngine();

    // Lighting Manager
    this.lighting = new LightingManager(this.scene, this.renderer);

    // World & Environment
    this.world = new WorldManager(this.scene, this.colliders);

    // Sanctuary Architecture & Landmarks
    this.sanctuary = new SanctuaryBuilder(this.scene, this.lighting);
    // Merge colliders
    this.colliders.push(...this.sanctuary.colliders);

    // Young Samuel Avatar
    this.player = new YoungSamuelAvatar(this.scene, this.lighting, this.audio);

    // Controller
    this.controller = new PlayerController(this.camera, this.renderer.domElement, this.colliders);

    // Lore & Scripture Dialogues
    this.lore = new LoreManager(this.controller, this.player);

    // Radar Minimap
    const minimapCanvas = document.getElementById('minimap-canvas');
    this.minimap = new MinimapManager(minimapCanvas, this.controller, this.player, this.lore);

    // Bind Controller Callbacks
    this.controller.onToggleView = (isThirdPerson) => {
      this.player.setVisible(isThirdPerson);
    };

    this.controller.onToggleCinematic = (isCinematic) => {
      const tag = document.getElementById('tag-cinematic');
      if (tag) tag.textContent = isCinematic ? 'ON (순환)' : 'OFF';
      this.player.setVisible(!isCinematic && this.controller.isThirdPerson);
    };

    this.controller.onTogglePrayer = () => {
      this.player.togglePrayerMode();
    };

    this.controller.onCycleTime = () => {
      const mode = this.lighting.cycleMode();
      const tag = document.getElementById('tag-time');
      if (tag) {
        if (mode === 'holy_night') tag.textContent = '거룩한 성막의 밤';
        if (mode === 'dawn') tag.textContent = '여명의 아침';
        if (mode === 'noon') tag.textContent = '찬란한 한낮';
      }
    };

    this.controller.onInteract = () => {
      this.lore.interact();
    };

    this.controller.onToggleMute = () => {
      this.toggleAudio();
    };

    this.controller.onTeleportKey = (pointId) => {
      this.minimap.teleportToLandmark(pointId);
    };
  }

  initHUD() {
    // Start Overlay Screen
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    if (startBtn && startScreen) {
      startBtn.addEventListener('click', () => {
        this.audio.init();
        startScreen.classList.add('hidden');
      });
    }

    // Ambience Equalizer Toggle
    const ambienceBtn = document.getElementById('ambience-control');
    if (ambienceBtn) {
      ambienceBtn.addEventListener('click', () => this.toggleAudio());
    }

    // Interaction prompt click
    const promptEl = document.getElementById('interaction-prompt');
    if (promptEl) {
      promptEl.addEventListener('click', () => this.lore.interact());
    }
  }

  toggleAudio() {
    const isUnmuted = this.audio.toggleMute();
    const label = document.getElementById('ambience-label');
    const eq = document.getElementById('audio-eq');
    if (label) label.textContent = isUnmuted ? 'KINNOR HARP : ON' : 'KINNOR HARP : OFF';
    if (eq) {
      if (isUnmuted) eq.classList.remove('paused');
      else eq.classList.add('paused');
    }
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 1. Update Controller & Camera
    this.controller.update(delta);

    // 2. Sync Player Avatar
    if (this.controller.isThirdPerson) {
      this.player.setPosition(
        this.controller.position.x,
        this.controller.position.y,
        this.controller.position.z
      );
      this.player.setRotationY(this.controller.yaw + Math.PI);
      this.player.updateAnimation(
        this.controller.isMoving(),
        this.controller.isRunning(),
        delta
      );
    }

    // 3. Update Systems
    this.lighting.update(time);
    this.world.update(delta);
    this.lore.update();
    this.minimap.update();

    // 4. Render with UnrealBloomPass post-processing
    this.composer.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ShilohApp();
});
