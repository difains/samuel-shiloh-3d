/**
 * Ancient Shiloh 3D - Radar Minimap & Fast-Travel Teleport System
 * Renders circular radar canvas with player heading frustum, 6 biblical landmark pins,
 * and handles click-to-teleport via minimap and HUD fast-travel buttons.
 */

export class MinimapManager {
  constructor(canvas, controller, player, loreManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.controller = controller;
    this.player = player;
    this.lore = loreManager;

    this.worldScale = 0.95; // World units to radar pixels ratio
    this.radarRadius = this.canvas.width / 2;

    this.initClickEvents();
    this.initDockButtons();
  }

  initClickEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left - this.radarRadius;
      const clickY = e.clientY - rect.top - this.radarRadius;
      const distFromCenter = Math.sqrt(clickX * clickX + clickY * clickY);

      if (distFromCenter <= this.radarRadius) {
        // Map radar offset to world coordinates relative to current player or origin
        // We use absolute world mapping centered on Tabernacle (0, 0)
        const targetWorldX = clickX / (this.radarRadius / 75);
        const targetWorldZ = clickY / (this.radarRadius / 75);

        // Find nearest landmark to snap cleanly
        let nearest = null;
        let minD = 22; // snap threshold
        for (let i = 0; i < this.lore.landmarks.length; i++) {
          const lm = this.lore.landmarks[i];
          const d = Math.hypot(lm.x - targetWorldX, lm.z - targetWorldZ);
          if (d < minD) {
            nearest = lm;
            minD = d;
          }
        }

        if (nearest) {
          this.teleportToLandmark(nearest.id);
        } else {
          this.controller.teleportTo(targetWorldX, targetWorldZ);
        }
      }
    });
  }

  initDockButtons() {
    const pills = document.querySelectorAll('.teleport-btn');
    pills.forEach(btn => {
      btn.addEventListener('click', () => {
        const pointId = parseInt(btn.getAttribute('data-point'), 10);
        this.teleportToLandmark(pointId);
      });
    });
  }

  teleportToLandmark(pointId) {
    if (pointId < 0 || pointId >= this.lore.landmarks.length) return;
    const lm = this.lore.landmarks[pointId];

    // Smoothly teleport controller to landmark position
    this.controller.teleportTo(lm.x, lm.z + 1.8);
    this.lore.update();

    // Update active pill styling
    const pills = document.querySelectorAll('.teleport-btn');
    pills.forEach((p, idx) => {
      if (idx === pointId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  update() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Save for radar rotation or static north
    ctx.save();

    // 1. Radar Grid & Range Rings
    ctx.strokeStyle = 'rgba(212, 168, 98, 0.18)';
    ctx.lineWidth = 1;
    [0.35, 0.65, 0.95].forEach(rRatio => {
      ctx.beginPath();
      ctx.arc(cx, cy, cx * rRatio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10);
    ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy);
    ctx.stroke();

    // 2. Draw Tabernacle Courtyard Outline (Center landmark)
    // Court is 46 x 23 oriented Z-wise
    const courtW = 23 * (cx / 75);
    const courtL = 46 * (cy / 75);
    ctx.strokeStyle = 'rgba(235, 210, 165, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - courtW / 2, cy - courtL / 2, courtW, courtL);

    // Tent building inside
    const tentW = 5 * (cx / 75);
    const tentL = 14 * (cy / 75);
    ctx.fillStyle = 'rgba(212, 168, 98, 0.35)';
    ctx.fillRect(cx - tentW / 2, cy - 8 * (cy / 75) - tentL / 2, tentW, tentL);

    // 3. Draw 6 Landmark Pins with Golden Badges
    this.lore.landmarks.forEach((lm, idx) => {
      const pinX = cx + lm.x * (cx / 75);
      const pinY = cy + lm.z * (cy / 75);

      const isActive = this.lore.activeLandmark && this.lore.activeLandmark.id === lm.id;

      // Glow circle
      ctx.beginPath();
      ctx.arc(pinX, pinY, isActive ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#ffcc44' : '#d4a862';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Number badge text
      ctx.fillStyle = '#140f0c';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((idx + 1).toString(), pinX, pinY);
    });

    // 4. Draw Player Position & View Frustum
    const px = this.controller.position.x;
    const pz = this.controller.position.z;
    const radX = cx + px * (cx / 75);
    const radY = cy + pz * (cy / 75);
    const yaw = this.controller.yaw;

    // View field triangle
    const viewLen = 14;
    const fovHalf = 0.55; // approx 60 deg cone
    ctx.beginPath();
    ctx.moveTo(radX, radY);
    ctx.lineTo(
      radX - Math.sin(yaw - fovHalf) * viewLen,
      radY - Math.cos(yaw - fovHalf) * viewLen
    );
    ctx.lineTo(
      radX - Math.sin(yaw + fovHalf) * viewLen,
      radY - Math.cos(yaw + fovHalf) * viewLen
    );
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 235, 180, 0.35)';
    ctx.fill();

    // Player marker dot (Samuel)
    ctx.beginPath();
    ctx.arc(radX, radY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4422';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}
