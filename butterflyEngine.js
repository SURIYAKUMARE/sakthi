/**
 * ============================================================
 * REALISTIC 3D BUTTERFLY FLIGHT ENGINE
 * Procedural flight paths, authentic wing flapping cycles
 * (burst flapping + gliding), banking physics, and golden
 * sparkle particle dust trails.
 * ============================================================
 */

export class ButterflyEngine {
  constructor(containerId = 'butterflyContainer') {
    this.container = null;
    this.containerId = containerId;
    this.butterflies = [];
    this.sparkles = [];
    this.rafId = null;
    this.lastTime = 0;
    this.mouse = { x: -1000, y: -1000, active: false };

    // Beautiful butterfly species palette tailored for deep crimson background
    this.species = [
      {
        id: 'gold-swallowtail',
        name: 'Golden Monarch',
        size: 46,
        baseColor: '#ffd56b',
        accentColor: '#e08b1f',
        edgeColor: '#450912',
        glow: 'rgba(255, 215, 120, 0.65)',
        flapSpeed: 18,
        glideChance: 0.35,
      },
      {
        id: 'rose-peony',
        name: 'Blush Rose Morpho',
        size: 38,
        baseColor: '#ffb3c6',
        accentColor: '#fb6f92',
        edgeColor: '#590d22',
        glow: 'rgba(255, 180, 200, 0.6)',
        flapSpeed: 22,
        glideChance: 0.25,
      },
      {
        id: 'pearl-celestial',
        name: 'Pearl Swallowtail',
        size: 42,
        baseColor: '#ffffff',
        accentColor: '#fed9b7',
        edgeColor: '#800f2f',
        glow: 'rgba(255, 255, 255, 0.75)',
        flapSpeed: 20,
        glideChance: 0.4,
      },
      {
        id: 'amber-sunset',
        name: 'Amber Sprite',
        size: 34,
        baseColor: '#ffbe0b',
        accentColor: '#fb5607',
        edgeColor: '#3a0208',
        glow: 'rgba(255, 190, 50, 0.6)',
        flapSpeed: 24,
        glideChance: 0.2,
      },
    ];
  }

  init(parentEl) {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = this.containerId;
    this.container.className = 'butterfly-container';
    this.container.setAttribute('aria-hidden', 'true');

    if (parentEl) {
      parentEl.appendChild(this.container);
    } else {
      document.body.appendChild(this.container);
    }

    // Spawn 4 unique butterflies
    this.species.forEach((spec, index) => {
      this.spawnButterfly(spec, index);
    });

    // Track mouse for gentle interactive hovering
    window.addEventListener('pointermove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('pointerleave', () => {
      this.mouse.active = false;
    });

    // Sparkle canvas for dust trails
    this.sparkleCanvas = document.createElement('canvas');
    this.sparkleCanvas.className = 'bf-sparkle-canvas';
    this.container.appendChild(this.sparkleCanvas);
    this.sparkleCtx = this.sparkleCanvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.rafId = requestAnimationFrame(this.loop);
  }

  resizeCanvas() {
    if (!this.sparkleCanvas) return;
    this.sparkleCanvas.width = window.innerWidth;
    this.sparkleCanvas.height = window.innerHeight;
  }

  spawnButterfly(spec, index) {
    const el = document.createElement('div');
    el.className = `bf-unit species-${spec.id}`;
    el.style.width = `${spec.size}px`;
    el.style.height = `${spec.size * 0.78}px`;

    // SVG Forewing and Hindwing design with realistic scalloped contours and veins
    const wingSVG = (isLeft) => `
      <svg class="bf-wing-svg" viewBox="0 0 100 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bfGrad-${spec.id}-${isLeft ? 'l' : 'r'}" x1="${isLeft ? '100%' : '0%'}" y1="50%" x2="${isLeft ? '0%' : '100%'}" y2="50%">
            <stop offset="0%" stop-color="${spec.accentColor}" />
            <stop offset="45%" stop-color="${spec.baseColor}" />
            <stop offset="85%" stop-color="${spec.baseColor}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${spec.edgeColor}" />
          </linearGradient>
          <filter id="bfGlow-${spec.id}">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="${spec.glow}" flood-opacity="0.8"/>
          </filter>
        </defs>

        <!-- Forewing (Upper large wing) -->
        <path d="${isLeft
          ? 'M95,65 C90,40 75,10 40,2 C15,0 0,18 2,38 C4,55 25,65 55,70 C78,74 92,70 95,65 Z'
          : 'M5,65 C10,40 25,10 60,2 C85,0 100,18 98,38 C96,55 75,65 45,70 C22,74 8,70 5,65 Z'}"
          fill="url(#bfGrad-${spec.id}-${isLeft ? 'l' : 'r'})"
          stroke="${spec.edgeColor}" stroke-width="2.2"
          filter="url(#bfGlow-${spec.id})"
        />

        <!-- Wing Vein delicate details -->
        <path d="${isLeft
          ? 'M95,65 Q60,40 30,25 M95,65 Q55,52 18,48 M95,65 Q65,62 35,66'
          : 'M5,65 Q40,40 70,25 M5,65 Q45,52 82,48 M5,65 Q35,62 65,66'}"
          fill="none" stroke="${spec.edgeColor}" stroke-width="1.2" opacity="0.65"
        />

        <!-- Hindwing (Lower delicate scalloped wing) -->
        <path d="${isLeft
          ? 'M90,68 C78,66 50,70 38,82 C24,96 32,114 48,118 C64,121 78,105 85,92 C90,82 92,72 90,68 Z'
          : 'M10,68 C22,66 50,70 62,82 C76,96 68,114 52,118 C36,121 22,105 15,92 C10,82 8,72 10,68 Z'}"
          fill="url(#bfGrad-${spec.id}-${isLeft ? 'l' : 'r'})"
          stroke="${spec.edgeColor}" stroke-width="2"
        />

        <!-- Scalloped edge white accent dots -->
        <circle cx="${isLeft ? '12' : '88'}" cy="28" r="1.8" fill="#fff" opacity="0.9" />
        <circle cx="${isLeft ? '8' : '92'}" cy="38" r="1.8" fill="#fff" opacity="0.9" />
        <circle cx="${isLeft ? '38' : '62'}" cy="112" r="1.6" fill="#fff" opacity="0.85" />
      </svg>
    `;

    el.innerHTML = `
      <div class="bf-rig">
        <div class="bf-body-wrap">
          <div class="bf-antennae"></div>
          <div class="bf-torso"></div>
        </div>
        <div class="bf-wing bf-wing-l">
          ${wingSVG(true)}
        </div>
        <div class="bf-wing bf-wing-r">
          ${wingSVG(false)}
        </div>
      </div>
    `;

    this.container.appendChild(el);

    // Initial randomized flight position & velocity
    const W = window.innerWidth;
    const H = window.innerHeight;

    const bf = {
      el,
      spec,
      x: Math.random() * (W * 0.8) + W * 0.1,
      y: Math.random() * (H * 0.7) + H * 0.15,
      z: (Math.random() * 0.4 + 0.8), // scale depth
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      heading: Math.random() * Math.PI * 2,
      targetHeading: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 1.8,
      flapPhase: Math.random() * Math.PI * 2,
      flapSpeed: spec.flapSpeed,
      isGliding: false,
      glideTimer: Math.random() * 2 + 1,
      burstTimer: Math.random() * 3 + 2,
      altitudeOffset: Math.random() * 100,
      wingLeft: el.querySelector('.bf-wing-l'),
      wingRight: el.querySelector('.bf-wing-r'),
      rig: el.querySelector('.bf-rig'),
    };

    this.butterflies.push(bf);
  }

  loop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.08);
    this.lastTime = now;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Center area (Envelope & Title) as gentle attraction waypoint
    const centerX = W * 0.5;
    const centerY = H * 0.48;

    this.butterflies.forEach((bf, idx) => {
      // 1. Behavior State: Flapping Burst vs Soft Gliding
      if (bf.isGliding) {
        bf.glideTimer -= dt;
        if (bf.glideTimer <= 0) {
          bf.isGliding = false;
          bf.burstTimer = Math.random() * 2.5 + 1.5;
        }
      } else {
        bf.burstTimer -= dt;
        if (bf.burstTimer <= 0 && Math.random() < bf.spec.glideChance) {
          bf.isGliding = true;
          bf.glideTimer = Math.random() * 1.2 + 0.6;
        }
      }

      // 2. Flight Path Physics & Waypoint Wandering
      // Change target direction periodically
      if (Math.random() < 0.02) {
        // Bias towards center screen with playful excursions
        const toCenterX = centerX - bf.x;
        const toCenterY = centerY - bf.y;
        const distToCenter = Math.hypot(toCenterX, toCenterY);

        if (distToCenter > W * 0.42) {
          // Steer back towards center if drifting too far off screen
          bf.targetHeading = Math.atan2(toCenterY, toCenterX) + (Math.random() - 0.5) * 0.8;
        } else {
          // Wander naturally in organic curves
          bf.targetHeading += (Math.random() - 0.5) * 1.6;
        }
      }

      // Smooth heading steering with banking
      let diff = bf.targetHeading - bf.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      bf.heading += diff * 2.2 * dt;

      // Gentle repulsion from viewport edges
      const edgePad = 80;
      if (bf.x < edgePad) bf.heading = 0 + (Math.random() - 0.5);
      if (bf.x > W - edgePad) bf.heading = Math.PI + (Math.random() - 0.5);
      if (bf.y < edgePad) bf.heading = Math.PI * 0.5 + (Math.random() - 0.5);
      if (bf.y > H - edgePad) bf.heading = -Math.PI * 0.5 + (Math.random() - 0.5);

      // Micro-flutter undulation (authentic butterfly erratic bobbing)
      const flutterWave = Math.sin(now * 0.012 + bf.altitudeOffset) * 1.8;
      const targetVx = Math.cos(bf.heading) * bf.speed;
      const targetVy = Math.sin(bf.heading) * bf.speed + flutterWave * 0.4;

      bf.vx += (targetVx - bf.vx) * 3 * dt;
      bf.vy += (targetVy - bf.vy) * 3 * dt;

      bf.x += bf.vx * 60 * dt;
      bf.y += bf.vy * 60 * dt;

      // 3. 3D Wing Flapping Animation
      let wingAngle = 0;
      let bodyBob = 0;

      if (bf.isGliding) {
        // Held open in a delicate V-glide (~18 degrees)
        wingAngle = 18 + Math.sin(now * 0.005) * 4;
        bodyBob = Math.sin(now * 0.006) * 1.5;
      } else {
        // Rapid rhythmic flapping cycle
        bf.flapPhase += bf.flapSpeed * dt;
        const rawSin = Math.sin(bf.flapPhase);
        // Wings flap from -65deg (upward close) to +30deg (downward push)
        wingAngle = rawSin * 55 - 10;
        // Body dips slightly when wings push up
        bodyBob = -rawSin * 3;
      }

      // Left wing: rotateY(angle); Right wing: rotateY(-angle)
      bf.wingLeft.style.transform = `rotateY(${wingAngle}deg)`;
      bf.wingRight.style.transform = `rotateY(${-wingAngle}deg)`;

      // 4. Banking & Orientation
      // Calculate flight angle in degrees
      const travelAngleDeg = (Math.atan2(bf.vy, bf.vx) * 180) / Math.PI + 90;
      // Banking tilt based on turn rate
      const bankingAngle = Math.max(-35, Math.min(35, diff * 28));

      // Apply 3D transform to unit
      bf.el.style.transform = `translate3d(${bf.x}px, ${bf.y + bodyBob}px, 0) scale(${bf.z})`;
      bf.rig.style.transform = `rotateZ(${travelAngleDeg}deg) rotateX(${bankingAngle}deg)`;

      // 5. Emit golden fairy dust sparkles occasionally
      if (Math.random() < 0.28) {
        this.sparkles.push({
          x: bf.x,
          y: bf.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 0.8 + 0.4, // float down gently
          size: Math.random() * 2.6 + 1.2,
          color: bf.spec.baseColor,
          glow: bf.spec.glow,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015,
        });
      }
    });

    // Render Sparkles
    this.renderSparkles();

    this.rafId = requestAnimationFrame(this.loop);
  }

  renderSparkles() {
    if (!this.sparkleCtx) return;
    this.sparkleCtx.clearRect(0, 0, this.sparkleCanvas.width, this.sparkleCanvas.height);

    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      this.sparkleCtx.save();
      this.sparkleCtx.globalAlpha = s.life * 0.85;
      this.sparkleCtx.shadowColor = s.glow;
      this.sparkleCtx.shadowBlur = 6;
      this.sparkleCtx.fillStyle = s.color;
      this.sparkleCtx.beginPath();
      this.sparkleCtx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      this.sparkleCtx.fill();
      this.sparkleCtx.restore();
    }
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
    this.butterflies = [];
    this.sparkles = [];
  }
}

export const butterflyEngine = new ButterflyEngine();
