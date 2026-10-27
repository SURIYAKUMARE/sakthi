/**
 * ============================================================
 * DREAMY MOONLIGHT & SHOOTING STAR ENGINE 🌙✨
 * Natural, realistic, and deeply attractive night sky:
 * - Sweeping Milky Way cosmic dust band
 * - Hundreds of organic twinkling stars with authentic scintillation
 * - Rare delicate starlight diffraction flares
 * - Hyper-realistic, graceful shooting stars with incandescent
 *   ablation light curves, tapered ion trails, and lingering
 *   stardust ionization vapor trains
 * ============================================================
 */

export class MoonlightEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.shootingStars = [];
    this.ionTrain = [];
    this.terminalSparks = [];
    this.rafId = null;
    this.lastTime = 0;
    this.autoTimer = null;
    this.dpr = 1;
  }

  init() {
    this.canvas = document.getElementById('moonStarCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.initStars();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.initStars();
    });

    this.bindEvents();
    this.startLoop();
    this.scheduleAutoShootingStar();
  }

  resizeCanvas() {
    if (!this.canvas || !this.ctx) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;

    this.canvas.width = Math.floor(W * this.dpr);
    this.canvas.height = Math.floor(H * this.dpr);
    this.canvas.style.width = `${W}px`;
    this.canvas.style.height = `${H}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  initStars() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    // 550 to 800 stars with natural galactic density variation
    const count = Math.min(800, Math.max(520, Math.floor((W * H) / 2000)));
    this.stars = [];

    // Authentic astronomical stellar spectrum (O, B, A, F, G, K, M)
    const starColors = [
      '#ffffff', // Vega / Sirius (Diamond White)
      '#ffffff',
      '#f8fafc', // Soft Pearl
      '#e2ecfd', // Rigel (Ice Blue)
      '#dbeafe', // Faint Celestial Blue
      '#fef9c3', // Capella (Warm Solar Ivory)
      '#fef08a', // Pale Golden Amber
      '#fed7aa', // Faint Warm Topaz
    ];

    let flareCount = 0;

    for (let i = 0; i < count; i++) {
      let x, y;

      // 45% of stars cluster naturally along an organic diagonal Milky Way galactic band
      if (Math.random() < 0.45) {
        const t = Math.random();
        // Diagonal band running from upper-right towards lower-left
        const baseX = W * (1 - t * 0.95);
        const baseY = H * (t * 0.9 + 0.05);
        // Gaussian-like scatter around the band axis
        const spread = (Math.random() + Math.random() - 1) * Math.min(W, H) * 0.28;
        x = baseX + spread;
        y = baseY + spread * 0.4;
      } else {
        // Natural distribution across deep space
        x = Math.random() * W;
        y = Math.random() * H;
      }

      // Natural sizing: predominantly pinpoint distant stars with a few close brilliant jewels
      const roll = Math.random();
      let radius, baseAlpha, isSpecial = false;

      if (roll < 0.72) {
        // Deep field micro-stars (pinpoints)
        radius = Math.random() * 0.5 + 0.4; // 0.4 - 0.9px
        baseAlpha = Math.random() * 0.45 + 0.25;
      } else if (roll < 0.96) {
        // Mid-field luminous stars
        radius = Math.random() * 0.6 + 0.95; // 0.95 - 1.55px
        baseAlpha = Math.random() * 0.35 + 0.55;
      } else {
        // Prominent brilliant stars
        radius = Math.random() * 0.7 + 1.6; // 1.6 - 2.3px
        baseAlpha = Math.random() * 0.2 + 0.8;
        isSpecial = flareCount < 3; // Limit to only 3 navigation stars with subtle diffraction flares
        if (isSpecial) flareCount++;
      }

      this.stars.push({
        x: (x + W) % W,
        y: (y + H) % H,
        radius,
        baseAlpha,
        // Two independent frequencies for realistic atmospheric turbulence micro-scintillation
        speed1: Math.random() * 0.04 + 0.015,
        speed2: Math.random() * 0.07 + 0.03,
        phase1: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        twinkleDepth: Math.random() * 0.28 + 0.14,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        hasFlare: isSpecial,
        flareLength: radius * (Math.random() * 3.5 + 4.5),
      });
    }
  }

  startLoop() {
    this.lastTime = performance.now();
    const render = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.08);
      this.lastTime = now;

      this.drawSky(now);
      this.updateShootingStars(dt);
      this.updateIonTrain(dt);
      this.updateTerminalSparks(dt);

      this.rafId = requestAnimationFrame(render);
    };

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(render);
    }
  }

  drawSky(now) {
    if (!this.ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;

    this.ctx.clearRect(0, 0, W, H);

    // 1. Natural Cosmic Nebulae Dust (Faint, painterly Milky Way band)
    const mwGrad = this.ctx.createLinearGradient(W * 0.85, 0, W * 0.15, H);
    mwGrad.addColorStop(0, 'rgba(20, 32, 60, 0.045)');
    mwGrad.addColorStop(0.35, 'rgba(45, 65, 110, 0.035)');
    mwGrad.addColorStop(0.65, 'rgba(30, 48, 85, 0.025)');
    mwGrad.addColorStop(1, 'rgba(10, 18, 35, 0.015)');
    this.ctx.fillStyle = mwGrad;
    this.ctx.fillRect(0, 0, W, H);

    // 2. Soft atmospheric moonlight diffusion centered on the moon
    const moonCenterX = W * 0.5;
    const moonCenterY = Math.min(H * 0.38, 260);
    const moonAura = this.ctx.createRadialGradient(
      moonCenterX,
      moonCenterY,
      80,
      moonCenterX,
      moonCenterY,
      Math.max(W, H) * 0.65
    );
    moonAura.addColorStop(0, 'rgba(245, 250, 255, 0.065)');
    moonAura.addColorStop(0.25, 'rgba(220, 235, 255, 0.03)');
    moonAura.addColorStop(0.6, 'rgba(180, 210, 250, 0.01)');
    moonAura.addColorStop(1, 'transparent');
    this.ctx.fillStyle = moonAura;
    this.ctx.fillRect(0, 0, W, H);

    // 3. Render all organic stars
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      // Organic multi-wave turbulence scintillation (air turbulence twinkling)
      const f1 = Math.sin(now * star.speed1 * 0.09 + star.phase1);
      const f2 = Math.sin(now * star.speed2 * 0.09 + star.phase2);
      const flicker = f1 * 0.65 + f2 * 0.35;
      const alpha = Math.max(0.12, Math.min(1, star.baseAlpha + flicker * star.twinkleDepth));

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      // Soft halo & whisper-thin diffraction spikes on the 3 navigation stars
      if (star.hasFlare) {
        // Soft round starlight halo
        const halo = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3.5);
        halo.addColorStop(0, star.color);
        halo.addColorStop(0.5, 'rgba(225, 238, 255, 0.35)');
        halo.addColorStop(1, 'transparent');
        this.ctx.fillStyle = halo;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Delicate, razor-thin 4-point cross diffraction flare
        const flare = star.flareLength * (1 + flicker * 0.15);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        this.ctx.lineWidth = 0.6;
        this.ctx.beginPath();
        this.ctx.moveTo(star.x - flare, star.y);
        this.ctx.lineTo(star.x + flare, star.y);
        this.ctx.moveTo(star.x, star.y - flare);
        this.ctx.lineTo(star.x, star.y + flare);
        this.ctx.stroke();
      }

      // Star point core
      this.ctx.fillStyle = star.color;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  /**
   * Launch an authentic, natural meteor across the night sky
   * @param {number|null} targetX Click / tap position X
   * @param {number|null} targetY Click / tap position Y
   */
  triggerShootingStar(targetX = null, targetY = null) {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Natural radiant origin: meteors streak diagonally down-left (~132° to 142°)
    const angle = Math.PI * 0.74 + (Math.random() - 0.5) * 0.14;
    // Swift, realistic meteor velocity (1200 - 1800 px/sec) — crosses screen in 0.45s to 0.7s!
    const speed = Math.random() * 550 + 1250;
    const duration = Math.random() * 0.22 + 0.48; // 0.48s - 0.70s

    let sx, sy;
    if (targetX !== null && targetY !== null) {
      // If user tapped a specific spot, originate slightly up-right so it passes gracefully near tap
      const backDist = Math.random() * 140 + 120;
      sx = targetX - Math.cos(angle) * backDist;
      sy = targetY - Math.sin(angle) * backDist;
    } else {
      // Natural entry from upper-right quadrant
      sx = Math.random() * (W * 0.55) + W * 0.35;
      sy = Math.random() * (H * 0.28) - 20;
    }

    this.shootingStars.push({
      x: sx,
      y: sy,
      startX: sx,
      startY: sy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      duration,
      elapsed: 0,
      length: Math.random() * 120 + 200, // 200px - 320px tapered ion tail
      width: Math.random() * 0.8 + 1.4, // razor-sharp incandescent needle
    });
  }

  updateShootingStars(dt) {
    if (!this.ctx) return;

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.elapsed += dt;
      const progress = s.elapsed / s.duration;

      if (progress >= 1.0) {
        // Natural terminal micro-burst (small puff of stardust)
        this.spawnTerminalBurst(s.x, s.y);
        this.shootingStars.splice(i, 1);
        continue;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      // Authentic Atmospheric Light Curve (Ablation heating & incandescence)
      // 0% -> 25%: entry heating up
      // 25% -> 70%: peak brilliance
      // 70% -> 100%: rapid fade/burnout
      let brightness;
      if (progress < 0.25) {
        brightness = progress / 0.25;
      } else if (progress < 0.72) {
        brightness = 1.0;
      } else {
        brightness = Math.max(0, (1.0 - progress) / 0.28);
      }

      // Deposit lingering ionization smoke train nodes (natural glowing persistent train)
      if (Math.random() < 0.65) {
        this.ionTrain.push({
          x: s.x + (Math.random() - 0.5) * 2,
          y: s.y + (Math.random() - 0.5) * 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          alpha: brightness * 0.55,
          decay: Math.random() * 1.4 + 1.2,
          radius: Math.random() * 1.2 + 0.8,
        });
      }

      // Vector pointing back along trajectory
      const vMag = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const dirX = s.vx / vMag;
      const dirY = s.vy / vMag;
      // Tail grows naturally during entry, reaches full length at peak, and thins out at finish
      const curLength = s.length * Math.min(1.0, progress * 2.2);
      const tailX = s.x - dirX * curLength;
      const tailY = s.y - dirY * curLength;

      this.ctx.save();

      // Outer soft ionization glow trail
      const outerGrad = this.ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      outerGrad.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.95})`);
      outerGrad.addColorStop(0.18, `rgba(240, 248, 255, ${brightness * 0.75})`);
      outerGrad.addColorStop(0.55, `rgba(200, 225, 255, ${brightness * 0.35})`);
      outerGrad.addColorStop(1, 'transparent');

      this.ctx.lineWidth = s.width * 2.2;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = outerGrad;
      this.ctx.shadowColor = '#dbeafe';
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();

      // Blinding incandescent white core
      const coreGrad = this.ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
      coreGrad.addColorStop(0.35, `rgba(255, 252, 245, ${brightness * 0.85})`);
      coreGrad.addColorStop(1, 'transparent');

      this.ctx.lineWidth = s.width;
      this.ctx.strokeStyle = coreGrad;
      this.ctx.shadowBlur = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();

      // Sharp incandescent head
      const headAura = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.width * 3.2);
      headAura.addColorStop(0, '#ffffff');
      headAura.addColorStop(0.4, `rgba(255, 250, 240, ${brightness * 0.85})`);
      headAura.addColorStop(1, 'transparent');
      this.ctx.fillStyle = headAura;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.width * 3.2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  spawnTerminalBurst(x, y) {
    // Subtle, natural terminal stardust specks (4-6 specks)
    const count = 6;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 35 + 15;
      this.terminalSparks.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        alpha: 0.8,
        decay: Math.random() * 2.8 + 2.2, // ~0.35s
        size: Math.random() * 1.2 + 0.6,
      });
    }
  }

  updateIonTrain(dt) {
    if (!this.ctx || this.ionTrain.length === 0) return;

    for (let i = this.ionTrain.length - 1; i >= 0; i--) {
      const p = this.ionTrain[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;
      p.radius += dt * 0.8; // subtle vapor expansion

      if (p.alpha <= 0) {
        this.ionTrain.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = '#e2ecfd';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  updateTerminalSparks(dt) {
    if (!this.ctx || this.terminalSparks.length === 0) return;

    for (let i = this.terminalSparks.length - 1; i >= 0; i--) {
      const sp = this.terminalSparks[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.alpha -= sp.decay * dt;

      if (sp.alpha <= 0) {
        this.terminalSparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, sp.alpha);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  scheduleAutoShootingStar() {
    // Natural, peaceful pacing: every 4.5 to 7.5 seconds
    const nextInterval = Math.random() * 3000 + 4500;
    this.autoTimer = setTimeout(() => {
      const screen = document.getElementById('screen-moon');
      if (screen && screen.classList.contains('is-active')) {
        this.triggerShootingStar();
      }
      this.scheduleAutoShootingStar();
    }, nextInterval);
  }

  bindEvents() {
    // 1. "Make a Wish ✦" Button
    const makeWishBtn = document.getElementById('moonMakeWishBtn');
    if (makeWishBtn) {
      makeWishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerShootingStar();
      });
    }

    // 2. Tap anywhere on the night sky
    const screenMoon = document.getElementById('screen-moon');
    if (screenMoon) {
      screenMoon.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('nav')) return;
        this.triggerShootingStar(e.clientX, e.clientY);
      });
    }

    // 3. Tap on the Moon itself
    const moonShowcase = document.getElementById('moonShowcase');
    if (moonShowcase) {
      moonShowcase.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerShootingStar();
      });
    }
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }
}

export const moonlightEngine = new MoonlightEngine();
