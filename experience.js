/**
 * ============================================================
 * EXPERIENCE JS — THE REFERENCE BIRTHDAY WEBSITE CONTROLLER
 * Handles Screen Transitions, 3D Envelope Opening, Interactive
 * Candle Blowing, Petal Showers, Confetti, and Vinyl Audio.
 * ============================================================
 */

import { birthdayConfig } from './birthdayConfig.js';
import { romanticAudio } from './audioEngine.js';
import { butterflyEngine } from './butterflyEngine.js';
import { moonlightEngine } from './moonlightEngine.js';

class BirthdayExperience {
  constructor() {
    this.currentScreen = 'screen-a';
    this.candlesBlown = false;
    this.isBlowingInProgress = false;
    this.isListeningForBlow = false;
    this.micStream = null;
    this.audioCtx = null;
    this.analyser = null;
    this.micRafId = null;
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.confettiParticles = [];
    this.confettiRAF = null;
    this.petalCanvas = null;
    this.petalCtx = null;
    this.petals = [];
    this.petalRAF = null;
  }

  init() {
    this.buildDOM();
    this.initConfetti();
    this.initPetals();
    this.bindEvents();
    this.initAudioSync();
    // Music starts ONLY from the Envelope screen (Screen A) onwards, never on the Heart Tree
    butterflyEngine.init(document.body);
    moonlightEngine.init();
    this.checkURLParams();
  }

  buildDOM() {
    const root = document.getElementById('experience-root');
    if (!root) return;

    root.innerHTML = `
      <div class="exp-overlay" id="expOverlay">
        <div class="exp-grain"></div>
        <div class="exp-vignette"></div>

        <!-- Twinkling Starlight Canvas for Moonlight Scene -->
        <canvas class="moon-star-canvas" id="moonStarCanvas"></canvas>

        <!-- Persistent Floating Music Pill Widget -->
        <div class="music-floating-pill" id="musicFloatingPill" title="Playing: Sidu Sidu (Romeo)">
          <span class="music-pill-wave" id="musicPillWave">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </span>
          <span class="music-pill-title">♫ Sidu Sidu (0:38)</span>
          <button class="music-pill-btn" id="musicPillPlayBtn" title="Play / Pause">▶</button>
          <button class="music-pill-btn" id="musicPillMuteBtn" title="Mute / Unmute">🔔</button>
        </div>

        <!-- Floating Glassmorphic Navigation -->
        <nav class="exp-nav" aria-label="Birthday Navigation">
          <button class="exp-nav__btn is-active" data-target="screen-a">💌 Envelope</button>
          <button class="exp-nav__btn" data-target="screen-b">✨ Greeting</button>
          <button class="exp-nav__btn" data-target="screen-moon">🌙 Moonlight</button>
          <button class="exp-nav__btn" data-target="screen-c">🎁 Gifts</button>
          <button class="exp-nav__btn" data-target="screen-d">📜 Wish Letter</button>
          <button class="exp-nav__btn" data-target="screen-e-bouquet">💐 Bouquet</button>
          <button class="exp-nav__btn" data-target="screen-e-cake">🎂 Cake</button>
          <button class="exp-nav__btn" data-target="screen-g">📸 Memories</button>
          <button class="exp-nav__btn" data-target="screen-h">🎵 Vinyl</button>
          <button class="exp-nav__close" id="expCloseBtn" title="Back to Heart Tree">✕</button>
        </nav>

        <main class="exp-viewport">

          <!-- ==========================================
               SCREEN A: ENVELOPE INTRODUCTION
               ========================================== -->
          <section class="exp-screen is-active" id="screen-a">
            <div class="env-stage">
              <div class="env-header">
                <p class="env-eyebrow">${birthdayConfig.envelopeIntro.eyebrow} ${birthdayConfig.recipient.name}</p>
                <h1 class="env-title">${birthdayConfig.envelopeIntro.title}</h1>
                <p class="env-subtitle">${birthdayConfig.envelopeIntro.subtitle}</p>
              </div>

              <div class="env-box" id="envBox" role="button" tabindex="0" aria-label="Open birthday envelope">
                <div class="env-body">
                  <div class="env-back-pocket"></div>
                  <!-- Peeking Letter -->
                  <div class="env-letter-peek">
                    <div class="env-letter-peek-heart">♥</div>
                    <div class="env-letter-peek-line"></div>
                    <div class="env-letter-peek-line"></div>
                    <p style="font-size: 13px; color: #8e1526; font-weight: 600; margin-top: 6px;">For Krithika</p>
                  </div>
                  <div class="env-pocket-left"></div>
                  <div class="env-pocket-right"></div>
                  <div class="env-pocket-bottom"></div>
                  <div class="env-flap"></div>
                </div>

                <!-- Golden Wax Seal -->
                <div class="env-seal" id="envSeal" title="Tap to open">
                  <span>K</span>
                </div>
              </div>

              <p class="env-hint">
                <span>✨</span>
                <span>${birthdayConfig.envelopeIntro.tapPrompt}</span>
                <span>✨</span>
              </p>
            </div>
          </section>

          <!-- ==========================================
               SCREEN B: CINEMATIC BIRTHDAY GREETING
               ========================================== -->
          <section class="exp-screen" id="screen-b">
            <div class="cine-card">
              <p class="cine-eyebrow">${birthdayConfig.cinematicGreeting.eyebrow}</p>
              <h1 class="cine-title">${birthdayConfig.cinematicGreeting.headline}</h1>
              <div class="cine-divider">✦ ♥ ✦</div>
              <blockquote class="cine-quote">${birthdayConfig.cinematicGreeting.quote}</blockquote>
              <p class="cine-subtext">${birthdayConfig.cinematicGreeting.subtext}</p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" id="cineContinueBtn">
                  ${birthdayConfig.cinematicGreeting.continueButton}
                </button>
                <button class="btn-primary" style="background: rgba(56, 189, 248, 0.28); color: #e0f2fe; border: 1px solid rgba(125, 211, 252, 0.45);" data-goto="screen-moon">
                  🌙 Enter Moonlight Sky
                </button>
              </div>
            </div>
          </section>

          <!-- ==========================================
               SCREEN MOON: DREAMY MOONLIGHT & SHOOTING STAR SCENE 🌙✨
               ========================================== -->
          <section class="exp-screen" id="screen-moon">
            <div class="screen-moon-container">
              <!-- Natural Luminous Moon Showcase -->
              <div class="moon-showcase" id="moonShowcase" title="Luminous Moon for Krithika (Tap to catch a shooting star ✦)">
                <div class="moon-lunar-corona" aria-hidden="true"></div>
                <img
                  src="${birthdayConfig.moonlightScene.moonImage}"
                  alt="Luminous Moon in Night Sky"
                  class="moon-img"
                />
              </div>

              <!-- Romantic Poetic Whisper (Natural & Intimate) -->
              <div class="moon-caption-wrap">
                <p class="moon-sub-verse">“Under this quiet moon, may your life always shine brighter than the stars.”</p>
                <p class="moon-name-tag">— For Krithika ♥</p>
              </div>

              <!-- Refined Starlight Action Controls -->
              <div class="moon-action-bar">
                <button class="btn-starlight" id="moonMakeWishBtn" title="Make a wish upon a shooting star">
                  Make a Wish ✦
                </button>
                <button class="btn-moon-continue" data-goto="screen-c" title="Continue to Gifts">
                  ${birthdayConfig.moonlightScene.continueButton}
                </button>
              </div>
              <p class="moon-tap-hint">Tap anywhere on the night sky to catch a shooting star ✦</p>
            </div>
          </section>

          <!-- ==========================================
               SCREEN C: "THESE ARE FOR YOU" GIFT SELECTION
               ========================================== -->
          <section class="exp-screen" id="screen-c">
            <div class="gifts-header">
              <h1 class="gifts-title">${birthdayConfig.giftSelection.title}</h1>
              <p class="gifts-subtitle">${birthdayConfig.giftSelection.subtitle}</p>
            </div>

            <div class="gifts-grid">
              <!-- Gift 1: Letter -->
              <div class="gift-card" data-goto="screen-d" role="button" tabindex="0">
                <div class="gift-icon-wrap">💌</div>
                <span class="gift-tag">${birthdayConfig.giftSelection.gifts[0].tag}</span>
                <h2 class="gift-card-title">${birthdayConfig.giftSelection.gifts[0].title}</h2>
                <p class="gift-card-desc">${birthdayConfig.giftSelection.gifts[0].description}</p>
                <span class="gift-btn">${birthdayConfig.giftSelection.gifts[0].badge}</span>
              </div>

              <!-- Gift 2: Bouquet -->
              <div class="gift-card" data-goto="screen-e-bouquet" role="button" tabindex="0">
                <div class="gift-icon-wrap">💐</div>
                <span class="gift-tag">${birthdayConfig.giftSelection.gifts[1].tag}</span>
                <h2 class="gift-card-title">${birthdayConfig.giftSelection.gifts[1].title}</h2>
                <p class="gift-card-desc">${birthdayConfig.giftSelection.gifts[1].description}</p>
                <span class="gift-btn">${birthdayConfig.giftSelection.gifts[1].badge}</span>
              </div>

              <!-- Gift 3: Cake -->
              <div class="gift-card" data-goto="screen-e-cake" role="button" tabindex="0">
                <div class="gift-icon-wrap">🎂</div>
                <span class="gift-tag">${birthdayConfig.giftSelection.gifts[2].tag}</span>
                <h2 class="gift-card-title">${birthdayConfig.giftSelection.gifts[2].title}</h2>
                <p class="gift-card-desc">${birthdayConfig.giftSelection.gifts[2].description}</p>
                <span class="gift-btn">${birthdayConfig.giftSelection.gifts[2].badge}</span>
              </div>
            </div>

            <div style="margin-top: 36px; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;">
              <button class="btn-primary" style="background: rgba(56, 189, 248, 0.25); color: #e0f2fe; border: 1px solid rgba(125, 211, 252, 0.4);" data-goto="screen-moon">
                🌙 Starlit Moonlight Sky
              </button>
              <button class="btn-primary" style="background: rgba(255,255,255,0.14); color: #fff;" data-goto="screen-g">
                📸 View Scrapbook Memories
              </button>
              <button class="btn-primary" data-goto="screen-h">
                🎵 Listen to Birthday Melody
              </button>
            </div>
          </section>

          <!-- ==========================================
               SCREEN D: PERSONAL BIRTHDAY WISH LETTER
               ========================================== -->
          <section class="exp-screen" id="screen-d">
            <div class="letter-stage">
              <div style="text-align: center; margin-bottom: 22px;">
                <h1 class="gifts-title" style="font-size: clamp(38px, 8.5vw, 62px); margin-bottom: 4px;">A Birthday Wish Letter</h1>
                <p class="gifts-subtitle">Written with heartfelt wishes for Krithika</p>
              </div>

              <div class="letter-sheet">
                <div class="letter-tape-top"></div>

                <!-- Pinned Polaroid on letter -->
                <div class="letter-photo-pin" id="letterPhotoPin">
                  <div class="letter-photo-pin-img">💖</div>
                  <p class="letter-photo-pin-caption">For Krithika ✨</p>
                </div>

                <div class="letter-date">${birthdayConfig.letter.date}</div>
                <h2 class="letter-salutation">${birthdayConfig.letter.salutation}</h2>

                <div class="letter-body">
                  ${birthdayConfig.letter.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>

                <div class="letter-closing">
                  <p class="letter-closing-text">${birthdayConfig.letter.closing}</p>
                  <p class="letter-signature">${birthdayConfig.letter.signature}</p>
                </div>

                <div class="letter-ps">
                  ${birthdayConfig.letter.postscript}
                </div>
              </div>

              <div style="display: flex; gap: 14px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
                <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" data-goto="screen-c">
                  ← Back to Gifts
                </button>
                <button class="btn-primary" data-goto="screen-e-bouquet">
                  Next: Realistic Flower Bouquet 💐 →
                </button>
              </div>
            </div>
          </section>

          <!-- ==========================================
               SCREEN E-1: REALISTIC BOUQUET SCENE
               ========================================== -->
          <section class="exp-screen" id="screen-e-bouquet">
            <div class="bouquet-card">

              <!-- "Untie & Bloom" Ceremony Button (New Feature!) -->
              <button class="bouquet-untie-btn" id="bouquetUntieBtn">
                ✨ Untie the Ribbon to Bloom the Bouquet ✨
              </button>

              <!-- Realistic Luxury Botanical Flower Bouquet -->
              <div class="bouquet-art-wrap" id="bouquetArt" title="Tap flowers to reveal blessings or tap to shower petals!">
                <div class="bouquet-photo-frame">
                  <img
                    src="/images/realistic_bouquet.jpg"
                    alt="Realistic Luxury Birthday Bouquet for Krithika"
                    class="bouquet-photo"
                    id="bouquetPhoto"
                  />
                  <!-- Dewdrop Glint & Sparkle Overlay -->
                  <div class="bouquet-dew-glint" aria-hidden="true"></div>

                  <!-- Interactive Botanical Hotspots on real petals -->
                  <div class="bouquet-hotspots-layer" aria-hidden="true">
                    <button class="flower-hotspot-zone zone-peony" data-flower="peony" title="Blush Garden Peony"></button>
                    <button class="flower-hotspot-zone zone-rose" data-flower="rose" title="Crimson Velvet Rose"></button>
                    <button class="flower-hotspot-zone zone-champagne" data-flower="champagne" title="Champagne Sunrise Rose"></button>
                    <button class="flower-hotspot-zone zone-lily" data-flower="lily" title="Stargazer Lily"></button>
                    <button class="flower-hotspot-zone zone-eucalyptus" data-flower="eucalyptus" title="Silver Dollar Eucalyptus"></button>
                  </div>
                </div>
              </div>

              <!-- Interactive Flower Wish Blessings Bar -->
              <p style="font-size: 14px; color: var(--gold-accent); margin-bottom: 6px; letter-spacing: 0.05em; font-style: italic;">
                ✨ Tap any flower below for its birthday blessing ✨
              </p>
              <div class="blessings-bar">
                ${birthdayConfig.bouquet.blessings.map(b => `
                  <button class="blessing-pill" data-flower-id="${b.id}" title="${b.flower}">
                    <span>${b.icon}</span> <span>${b.flower.split(' ')[0]}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Active Flower Blessing Card -->
              <div class="blessing-card" id="blessingCard">
                <div class="blessing-card-header">
                  <span id="blessingIcon">🌹</span> <span id="blessingTitle">Crimson Velvet Rose</span>
                </div>
                <p class="blessing-card-wish" id="blessingWish">
                  “${birthdayConfig.bouquet.blessings[0].wish}”
                </p>
              </div>

              <div class="bouquet-text">
                <h1 class="bouquet-title">${birthdayConfig.bouquet.title}</h1>
                <p class="bouquet-desc">${birthdayConfig.bouquet.message}</p>
                <p class="bouquet-hint">${birthdayConfig.bouquet.tip}</p>
              </div>

              <div style="display: flex; gap: 14px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
                <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" data-goto="screen-c">
                  ← Back to Gifts
                </button>
                <button class="btn-primary" data-goto="screen-e-cake">
                  Next: Birthday Cake 🎂 →
                </button>
              </div>
            </div>
          </section>

          <!-- ==========================================
               SCREEN E-2: BIRTHDAY CAKE SCENE
               ========================================== -->
          <section class="exp-screen" id="screen-e-cake">
            <div class="cake-card">
              <h1 class="cake-title">${birthdayConfig.cake.title}</h1>
              <p class="cake-subtitle">${birthdayConfig.cake.subtitle}</p>

              <!-- Realistic Animated 3D Artisanal Cake Stage -->
              <div class="cake-interactive-stage" id="cakeStage" role="button" tabindex="0" title="Tap the cake or candles to blow them out!">
                <svg class="cake-vector-scene" viewBox="0 0 600 620" preserveAspectRatio="xMidYMid meet" aria-label="Animated 3D Birthday Cake for Krithika">
                  <defs>
                    <!-- Soft Ground Shadows -->
                    <radialGradient id="cakeGroundShadow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="rgba(15, 1, 4, 0.75)" />
                      <stop offset="60%" stop-color="rgba(25, 2, 7, 0.4)" />
                      <stop offset="100%" stop-color="transparent" />
                    </radialGradient>
                    <radialGradient id="cakePlateOcclusion" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="rgba(45, 10, 16, 0.65)" />
                      <stop offset="70%" stop-color="rgba(45, 10, 16, 0.25)" />
                      <stop offset="100%" stop-color="transparent" />
                    </radialGradient>

                    <!-- Metallic Gold Stand Gradients -->
                    <linearGradient id="goldStandBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#b45309" />
                      <stop offset="20%" stop-color="#fef08a" />
                      <stop offset="45%" stop-color="#d97706" />
                      <stop offset="70%" stop-color="#fef9c3" />
                      <stop offset="85%" stop-color="#ca8a04" />
                      <stop offset="100%" stop-color="#78350f" />
                    </linearGradient>
                    <linearGradient id="goldStandStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#92400e" />
                      <stop offset="25%" stop-color="#fef08a" />
                      <stop offset="50%" stop-color="#d97706" />
                      <stop offset="75%" stop-color="#fef9c3" />
                      <stop offset="100%" stop-color="#78350f" />
                    </linearGradient>
                    <linearGradient id="goldStandPlateRim" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#78350f" />
                      <stop offset="15%" stop-color="#d97706" />
                      <stop offset="35%" stop-color="#fef9c3" />
                      <stop offset="60%" stop-color="#b45309" />
                      <stop offset="80%" stop-color="#fef08a" />
                      <stop offset="100%" stop-color="#78350f" />
                    </linearGradient>
                    <radialGradient id="goldStandPlateTop" cx="45%" cy="35%" r="65%">
                      <stop offset="0%" stop-color="#fef9c3" />
                      <stop offset="35%" stop-color="#fde047" />
                      <stop offset="70%" stop-color="#d97706" />
                      <stop offset="100%" stop-color="#92400e" />
                    </radialGradient>

                    <!-- Cake Cream & Buttercream Gradients -->
                    <linearGradient id="cakeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#ebd4c2" />
                      <stop offset="12%" stop-color="#f7ede4" />
                      <stop offset="35%" stop-color="#ffffff" />
                      <stop offset="65%" stop-color="#fdf8f2" />
                      <stop offset="85%" stop-color="#f1dfd0" />
                      <stop offset="100%" stop-color="#dfc5b1" />
                    </linearGradient>
                    <radialGradient id="cakeTopGrad" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="65%" stop-color="#fbf5ee" />
                      <stop offset="90%" stop-color="#f4e5d8" />
                      <stop offset="100%" stop-color="#e8d3c2" />
                    </radialGradient>
                    <radialGradient id="ambientCandleGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="rgba(254, 240, 138, 0.55)" />
                      <stop offset="45%" stop-color="rgba(245, 158, 11, 0.28)" />
                      <stop offset="80%" stop-color="rgba(234, 88, 12, 0.08)" />
                      <stop offset="100%" stop-color="transparent" />
                    </radialGradient>
                    <radialGradient id="pearlCreamShade" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="50%" stop-color="#fbf4ee" />
                      <stop offset="85%" stop-color="#e8d5c4" />
                      <stop offset="100%" stop-color="#cca892" />
                    </radialGradient>

                    <!-- Front Plaque Gradients -->
                    <linearGradient id="plaqueBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#4a0412" />
                      <stop offset="50%" stop-color="#6e0d22" />
                      <stop offset="100%" stop-color="#33020b" />
                    </linearGradient>
                    <linearGradient id="plaqueGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#b45309" />
                      <stop offset="25%" stop-color="#fef08a" />
                      <stop offset="50%" stop-color="#d97706" />
                      <stop offset="75%" stop-color="#fef9c3" />
                      <stop offset="100%" stop-color="#78350f" />
                    </linearGradient>

                    <!-- Fruit Gradients -->
                    <radialGradient id="strawberryGrad" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stop-color="#f43f5e" />
                      <stop offset="45%" stop-color="#e11d48" />
                      <stop offset="80%" stop-color="#9f1239" />
                      <stop offset="100%" stop-color="#4c0519" />
                    </radialGradient>
                    <radialGradient id="strawberrySliceInside" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="35%" stop-color="#ffe4e6" />
                      <stop offset="75%" stop-color="#f43f5e" />
                      <stop offset="100%" stop-color="#be123c" />
                    </radialGradient>
                    <radialGradient id="blueberryGrad" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stop-color="#818cf8" />
                      <stop offset="40%" stop-color="#3730a3" />
                      <stop offset="85%" stop-color="#1e1b4b" />
                      <stop offset="100%" stop-color="#0f0e26" />
                    </radialGradient>
                    <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#86efac" />
                      <stop offset="50%" stop-color="#22c55e" />
                      <stop offset="100%" stop-color="#14532d" />
                    </linearGradient>

                    <!-- Candles Gradients -->
                    <linearGradient id="candleBlush" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#fecdd3" />
                      <stop offset="40%" stop-color="#ffffff" />
                      <stop offset="70%" stop-color="#fda4af" />
                      <stop offset="100%" stop-color="#e11d48" />
                    </linearGradient>
                    <linearGradient id="candleIvory" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#fde68a" />
                      <stop offset="45%" stop-color="#ffffff" />
                      <stop offset="75%" stop-color="#fef08a" />
                      <stop offset="100%" stop-color="#d97706" />
                    </linearGradient>
                    <linearGradient id="goldSpiralRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fef08a" />
                      <stop offset="50%" stop-color="#d97706" />
                      <stop offset="100%" stop-color="#b45309" />
                    </linearGradient>

                    <!-- Candle Flames Core & Aura -->
                    <radialGradient id="flameCoreGrad" cx="50%" cy="75%" r="70%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="20%" stop-color="#fef08a" />
                      <stop offset="60%" stop-color="#f59e0b" />
                      <stop offset="90%" stop-color="#ea580c" />
                      <stop offset="100%" stop-color="#b91c1c" />
                    </radialGradient>
                    <radialGradient id="flameHaloAura" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="rgba(254, 240, 138, 0.95)" />
                      <stop offset="35%" stop-color="rgba(245, 158, 11, 0.55)" />
                      <stop offset="70%" stop-color="rgba(234, 88, 12, 0.2)" />
                      <stop offset="100%" stop-color="transparent" />
                    </radialGradient>
                    <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="40%" stop-color="#ff4500" />
                      <stop offset="85%" stop-color="#b91c1c" />
                      <stop offset="100%" stop-color="transparent" />
                    </radialGradient>

                    <!-- Drop Shadow Filter -->
                    <filter id="cakeFilterShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#140105" flood-opacity="0.6" />
                    </filter>
                    <filter id="flameGlowGlint" x="-60%" y="-60%" width="220%" height="220%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffd05a" flood-opacity="0.95"/>
                      <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#f59e0b" flood-opacity="0.6"/>
                    </filter>
                  </defs>

                  <!-- 1. Ground Drop Shadow -->
                  <ellipse cx="300" cy="570" rx="225" ry="24" fill="url(#cakeGroundShadow)" />

                  <!-- 2. Metallic Gold Cake Pedestal -->
                  <g id="cakeStandGroup">
                    <!-- Foot outer base bevel -->
                    <ellipse cx="300" cy="546" rx="142" ry="18" fill="url(#goldStandBaseGrad)" />
                    <path d="M158,546 C158,558 442,558 442,546 L442,536 C442,548 158,548 158,536 Z" fill="#78350f" opacity="0.6" />
                    <ellipse cx="300" cy="536" rx="136" ry="15" fill="url(#goldStandBaseGrad)" />
                    <!-- Hourglass pillar stem -->
                    <path d="M260,442 C260,482 238,510 238,532 L362,532 C362,510 340,482 340,442 Z" fill="url(#goldStandStemGrad)" />
                    <!-- Stem specular shine -->
                    <path d="M288,442 C288,482 282,510 282,532 L312,532 C312,510 306,482 306,442 Z" fill="#ffffff" opacity="0.45" />
                    <!-- Stand upper plate under-rim -->
                    <path d="M72,438 C72,470 528,470 528,438 L528,426 C528,458 72,458 72,426 Z" fill="url(#goldStandPlateRim)" />
                    <!-- Stand plate top bevel surface -->
                    <ellipse cx="300" cy="426" rx="228" ry="28" fill="url(#goldStandPlateTop)" />
                    <!-- Ambient occlusion shadow cast by cake onto gold plate -->
                    <ellipse cx="300" cy="422" rx="188" ry="20" fill="url(#cakePlateOcclusion)" />
                  </g>

                  <!-- 3. Cake Cylindrical Body -->
                  <g id="cakeBodyGroup" filter="url(#cakeFilterShadow)">
                    <!-- Cake Body Sides & Bottom Rounding -->
                    <path d="M122,286 L122,408 C122,466 478,466 478,408 L478,286 Z" fill="url(#cakeBodyGrad)" />
                    <!-- Buttercream Spatula Texture Waves -->
                    <path d="M122,330 Q300,366 478,330" stroke="#f6ede3" stroke-width="3.5" fill="none" opacity="0.8" />
                    <path d="M122,372 Q300,408 478,372" stroke="#ebd2bd" stroke-width="2.5" fill="none" opacity="0.65" />
                    <!-- Bottom Piped Cream Border (Pearl Rosettes along bottom curve) -->
                    <g id="bottomCreamBorder">
                      <circle cx="132" cy="410" r="13" fill="url(#pearlCreamShade)" />
                      <circle cx="151" cy="420" r="13.5" fill="url(#pearlCreamShade)" />
                      <circle cx="173" cy="429" r="14" fill="url(#pearlCreamShade)" />
                      <circle cx="196" cy="437" r="14" fill="url(#pearlCreamShade)" />
                      <circle cx="221" cy="443" r="14.5" fill="url(#pearlCreamShade)" />
                      <circle cx="247" cy="448" r="14.5" fill="url(#pearlCreamShade)" />
                      <circle cx="273" cy="451" r="15" fill="url(#pearlCreamShade)" />
                      <circle cx="300" cy="452" r="15" fill="url(#pearlCreamShade)" />
                      <circle cx="327" cy="451" r="15" fill="url(#pearlCreamShade)" />
                      <circle cx="353" cy="448" r="14.5" fill="url(#pearlCreamShade)" />
                      <circle cx="379" cy="443" r="14.5" fill="url(#pearlCreamShade)" />
                      <circle cx="404" cy="437" r="14" fill="url(#pearlCreamShade)" />
                      <circle cx="427" cy="429" r="14" fill="url(#pearlCreamShade)" />
                      <circle cx="449" cy="420" r="13.5" fill="url(#pearlCreamShade)" />
                      <circle cx="468" cy="410" r="13" fill="url(#pearlCreamShade)" />
                    </g>

                    <!-- Front Decorative Birthday Plaque -->
                    <g id="frontPlaqueGroup" transform="translate(300, 362)">
                      <ellipse cx="0" cy="0" rx="116" ry="29" fill="url(#plaqueBg)" stroke="url(#plaqueGoldRim)" stroke-width="3.5" />
                      <ellipse cx="0" cy="0" rx="108" ry="23" fill="none" stroke="rgba(254, 240, 138, 0.45)" stroke-width="1.2" stroke-dasharray="4, 3" />
                      <!-- Plaque Inscription -->
                      <text x="0" y="5" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" font-weight="700" fill="#fef08a" letter-spacing="0.04em">
                        Happy Birthday Krithika ♥
                      </text>
                    </g>
                  </g>

                  <!-- 4. Cake Top Surface & Fruit Garnishes -->
                  <g id="cakeTopGroup">
                    <!-- Top Frosting Ellipse -->
                    <ellipse cx="300" cy="286" rx="178" ry="52" fill="url(#cakeTopGrad)" />

                    <!-- Dynamic Warm Candlelight Reflection Glow on Cake Top -->
                    <ellipse cx="300" cy="275" rx="165" ry="46" fill="url(#ambientCandleGlow)" class="cake-candle-ambient-glow" id="cakeAmbientGlow" />

                    <!-- Top Perimeter Piped Whipped Cream Rosettes (14 peaks) -->
                    <g id="topCreamRosettes">
                      <!-- Back row rosettes -->
                      <ellipse cx="152" cy="265" rx="15" ry="12" fill="url(#pearlCreamShade)" />
                      <ellipse cx="195" cy="248" rx="16" ry="13" fill="url(#pearlCreamShade)" />
                      <ellipse cx="246" cy="240" rx="17" ry="13" fill="url(#pearlCreamShade)" />
                      <ellipse cx="300" cy="236" rx="18" ry="14" fill="url(#pearlCreamShade)" />
                      <ellipse cx="354" cy="240" rx="17" ry="13" fill="url(#pearlCreamShade)" />
                      <ellipse cx="405" cy="248" rx="16" ry="13" fill="url(#pearlCreamShade)" />
                      <ellipse cx="448" cy="265" rx="15" ry="12" fill="url(#pearlCreamShade)" />
                      <!-- Front row rosettes -->
                      <ellipse cx="138" cy="292" rx="16" ry="14" fill="url(#pearlCreamShade)" />
                      <ellipse cx="170" cy="316" rx="17" ry="14" fill="url(#pearlCreamShade)" />
                      <ellipse cx="218" cy="330" rx="18" ry="15" fill="url(#pearlCreamShade)" />
                      <ellipse cx="272" cy="336" rx="19" ry="15" fill="url(#pearlCreamShade)" />
                      <ellipse cx="328" cy="336" rx="19" ry="15" fill="url(#pearlCreamShade)" />
                      <ellipse cx="382" cy="330" rx="18" ry="15" fill="url(#pearlCreamShade)" />
                      <ellipse cx="430" cy="316" rx="17" ry="14" fill="url(#pearlCreamShade)" />
                      <ellipse cx="462" cy="292" rx="16" ry="14" fill="url(#pearlCreamShade)" />
                    </g>

                    <!-- Fresh Strawberries, Blueberries & Mint Leaves -->
                    <g id="fruitsLayer">
                      <!-- Mint Leaf Sprig (Left) -->
                      <path d="M208,288 C192,274 186,260 200,252 C214,258 218,272 208,288 Z" fill="url(#mintGrad)" />
                      <!-- Whole Strawberry (Center Left) -->
                      <g transform="translate(232, 278) rotate(-12)">
                        <path d="M0, -18 C15,-18 20,4 0,22 C-20,4 -15,-18 0,-18 Z" fill="url(#strawberryGrad)" />
                        <!-- Seeds -->
                        <circle cx="-5" cy="-6" r="1" fill="#fef08a" opacity="0.9" />
                        <circle cx="4" cy="-4" r="1" fill="#fef08a" opacity="0.9" />
                        <circle cx="-2" cy="4" r="1" fill="#fef08a" opacity="0.9" />
                        <circle cx="5" cy="8" r="0.9" fill="#fef08a" opacity="0.9" />
                        <!-- Specular Glint -->
                        <path d="M-8,-12 C-4,-16 2,-16 6,-14" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.65" />
                        <!-- Green Calyx -->
                        <path d="M-10,-18 L-2,-14 L0,-22 L4,-14 L12,-18 L6,-11 L-4,-11 Z" fill="#22c55e" />
                      </g>

                      <!-- Sliced Strawberry (Center Right) -->
                      <g transform="translate(362, 274) rotate(16)">
                        <path d="M0, -16 C16,-16 18,6 0,20 C-18,6 -16,-16 0,-16 Z" fill="url(#strawberryGrad)" />
                        <ellipse cx="0" cy="2" rx="12" ry="14" fill="url(#strawberrySliceInside)" />
                        <!-- Seed Ray Pattern -->
                        <path d="M0,2 L-6,-4 M0,2 L6,-4 M0,2 L-7,4 M0,2 L7,4 M0,2 L0,12" stroke="#be123c" stroke-width="1.2" opacity="0.7" />
                        <circle cx="0" cy="2" r="3" fill="#ffffff" />
                      </g>

                      <!-- Center Hero Strawberry -->
                      <g transform="translate(298, 302) rotate(4)">
                        <path d="M0, -20 C18,-20 22,6 0,24 C-22,6 -18,-20 0,-20 Z" fill="url(#strawberryGrad)" />
                        <circle cx="-7" cy="-8" r="1" fill="#fef08a" />
                        <circle cx="5" cy="-6" r="1" fill="#fef08a" />
                        <circle cx="-4" cy="2" r="1" fill="#fef08a" />
                        <circle cx="4" cy="6" r="1" fill="#fef08a" />
                        <circle cx="-1" cy="12" r="0.9" fill="#fef08a" />
                        <path d="M-10,-12 C-5,-18 4,-18 9,-14" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.75" />
                        <path d="M-12,-20 L-2,-15 L0,-24 L4,-15 L14,-20 L7,-12 L-5,-12 Z" fill="#22c55e" />
                      </g>

                      <!-- Plump Blueberries -->
                      <g transform="translate(202, 306)">
                        <circle cx="0" cy="0" r="10" fill="url(#blueberryGrad)" />
                        <circle cx="-3" cy="-3" r="2.5" fill="#ffffff" opacity="0.8" />
                        <circle cx="1" cy="1" r="3" fill="#1e1b4b" opacity="0.6" />
                      </g>
                      <g transform="translate(262, 266)">
                        <circle cx="0" cy="0" r="9" fill="url(#blueberryGrad)" />
                        <circle cx="-2.5" cy="-2.5" r="2.2" fill="#ffffff" opacity="0.85" />
                      </g>
                      <g transform="translate(332, 304)">
                        <circle cx="0" cy="0" r="10.5" fill="url(#blueberryGrad)" />
                        <circle cx="-3" cy="-3" r="2.6" fill="#ffffff" opacity="0.8" />
                      </g>
                      <g transform="translate(396, 286)">
                        <circle cx="0" cy="0" r="9.5" fill="url(#blueberryGrad)" />
                        <circle cx="-2.5" cy="-2.5" r="2.2" fill="#ffffff" opacity="0.8" />
                      </g>

                      <!-- Mint Leaf Sprig (Right) -->
                      <path d="M418,272 C434,260 442,246 428,240 C416,248 412,262 418,272 Z" fill="url(#mintGrad)" />
                    </g>
                  </g>

                  <!-- 5. Five Slender Candles with Golden Holders -->
                  <g id="cakeCandlesGroup">
                    <!-- Candle 1 (Far Left: X=176, Y=234) -->
                    <g class="candle-stick-unit c1" transform="translate(176, 234)">
                      <!-- Golden holder cup -->
                      <ellipse cx="0" cy="0" rx="9" ry="4" fill="url(#goldStandBaseGrad)" />
                      <!-- Slender candle shaft -->
                      <rect x="-5" y="-74" width="10" height="74" rx="3" fill="url(#candleBlush)" />
                      <!-- Gold spiral ribbon -->
                      <path d="M-5,-64 Q0,-61 5,-58 M-5,-46 Q0,-43 5,-40 M-5,-28 Q0,-25 5,-22 M-5,-10 Q0,-7 5,-4" stroke="url(#goldSpiralRibbon)" stroke-width="2.5" fill="none" opacity="0.9" />
                      <!-- Wax top rim & wick -->
                      <ellipse cx="0" cy="-74" rx="5" ry="2" fill="#fda4af" />
                      <path d="M0,-74 Q1,-82 0,-88" stroke="#1f2937" stroke-width="2.4" stroke-linecap="round" fill="none" />
                      <!-- Extinguished Glowing Wick Ember -->
                      <circle cx="0" cy="-88" r="2.5" fill="url(#emberGlow)" class="wick-ember" />
                    </g>

                    <!-- Candle 2 (Center Left: X=238, Y=218) -->
                    <g class="candle-stick-unit c2" transform="translate(238, 218)">
                      <ellipse cx="0" cy="0" rx="9" ry="4" fill="url(#goldStandBaseGrad)" />
                      <rect x="-5" y="-80" width="10" height="80" rx="3" fill="url(#candleIvory)" />
                      <path d="M-5,-70 Q0,-67 5,-64 M-5,-52 Q0,-49 5,-46 M-5,-34 Q0,-31 5,-28 M-5,-16 Q0,-13 5,-10" stroke="url(#goldSpiralRibbon)" stroke-width="2.5" fill="none" opacity="0.9" />
                      <ellipse cx="0" cy="-80" rx="5" ry="2" fill="#fff" />
                      <path d="M0,-80 Q1,-88 0,-94" stroke="#1f2937" stroke-width="2.4" stroke-linecap="round" fill="none" />
                      <circle cx="0" cy="-94" r="2.5" fill="url(#emberGlow)" class="wick-ember" />
                    </g>

                    <!-- Candle 3 (Center Hero: X=300, Y=208 - Tallest) -->
                    <g class="candle-stick-unit c3" transform="translate(300, 208)">
                      <ellipse cx="0" cy="0" rx="9.5" ry="4.5" fill="url(#goldStandBaseGrad)" />
                      <rect x="-5.5" y="-88" width="11" height="88" rx="3" fill="url(#candleBlush)" />
                      <path d="M-5.5,-78 Q0,-75 5.5,-72 M-5.5,-58 Q0,-55 5.5,-52 M-5.5,-38 Q0,-35 5.5,-32 M-5.5,-18 Q0,-15 5.5,-12" stroke="url(#goldSpiralRibbon)" stroke-width="2.6" fill="none" opacity="0.9" />
                      <ellipse cx="0" cy="-88" rx="5.5" ry="2.2" fill="#fda4af" />
                      <path d="M0,-88 Q1,-96 0,-102" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round" fill="none" />
                      <circle cx="0" cy="-102" r="2.6" fill="url(#emberGlow)" class="wick-ember" />
                    </g>

                    <!-- Candle 4 (Center Right: X=362, Y=218) -->
                    <g class="candle-stick-unit c4" transform="translate(362, 218)">
                      <ellipse cx="0" cy="0" rx="9" ry="4" fill="url(#goldStandBaseGrad)" />
                      <rect x="-5" y="-80" width="10" height="80" rx="3" fill="url(#candleIvory)" />
                      <path d="M-5,-70 Q0,-67 5,-64 M-5,-52 Q0,-49 5,-46 M-5,-34 Q0,-31 5,-28 M-5,-16 Q0,-13 5,-10" stroke="url(#goldSpiralRibbon)" stroke-width="2.5" fill="none" opacity="0.9" />
                      <ellipse cx="0" cy="-80" rx="5" ry="2" fill="#fff" />
                      <path d="M0,-80 Q1,-88 0,-94" stroke="#1f2937" stroke-width="2.4" stroke-linecap="round" fill="none" />
                      <circle cx="0" cy="-94" r="2.5" fill="url(#emberGlow)" class="wick-ember" />
                    </g>

                    <!-- Candle 5 (Far Right: X=424, Y=234) -->
                    <g class="candle-stick-unit c5" transform="translate(424, 234)">
                      <ellipse cx="0" cy="0" rx="9" ry="4" fill="url(#goldStandBaseGrad)" />
                      <rect x="-5" y="-74" width="10" height="74" rx="3" fill="url(#candleBlush)" />
                      <path d="M-5,-64 Q0,-61 5,-58 M-5,-46 Q0,-43 5,-40 M-5,-28 Q0,-25 5,-22 M-5,-10 Q0,-7 5,-4" stroke="url(#goldSpiralRibbon)" stroke-width="2.5" fill="none" opacity="0.9" />
                      <ellipse cx="0" cy="-74" rx="5" ry="2" fill="#fda4af" />
                      <path d="M0,-74 Q1,-82 0,-88" stroke="#1f2937" stroke-width="2.4" stroke-linecap="round" fill="none" />
                      <circle cx="0" cy="-88" r="2.5" fill="url(#emberGlow)" class="wick-ember" />
                    </g>
                  </g>

                  <!-- 6. Wind Gust Animation Stream (Appears on Blow) -->
                  <g class="cake-wind-gust" id="cakeWindGust">
                    <path d="M40,150 Q160,130 300,120 T560,110" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round" stroke-dasharray="25, 40" fill="none" />
                    <path d="M60,170 Q200,150 340,140 T540,130" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="35, 50" fill="none" />
                  </g>

                  <!-- 7. Curled Rising Smoke Wisps (Rising from 5 wicks when blown out) -->
                  <g class="cake-smoke-layer" id="cakeSmokeLayer">
                    <!-- Smoke 1 (C1: 176, 146) -->
                    <path class="candle-smoke-wisp s1" d="M176,146 Q162,110 184,80 Q160,48 174,18 Q162,-10 178,-35" stroke="#f1f5f9" stroke-width="3.5" fill="none" stroke-linecap="round" />
                    <!-- Smoke 2 (C2: 238, 124) -->
                    <path class="candle-smoke-wisp s2" d="M238,124 Q256,92 230,62 Q258,30 236,2 Q254,-24 238,-50" stroke="#f1f5f9" stroke-width="3.6" fill="none" stroke-linecap="round" />
                    <!-- Smoke 3 (C3: 300, 106) -->
                    <path class="candle-smoke-wisp s3" d="M300,106 Q282,72 312,42 Q284,12 308,-18 Q286,-46 304,-75" stroke="#f1f5f9" stroke-width="3.8" fill="none" stroke-linecap="round" />
                    <!-- Smoke 4 (C4: 362, 124) -->
                    <path class="candle-smoke-wisp s4" d="M362,124 Q344,92 370,62 Q342,30 366,2 Q346,-24 364,-50" stroke="#f1f5f9" stroke-width="3.6" fill="none" stroke-linecap="round" />
                    <!-- Smoke 5 (C5: 424, 146) -->
                    <path class="candle-smoke-wisp s5" d="M424,146 Q438,110 416,80 Q440,48 426,18 Q438,-10 422,-35" stroke="#f1f5f9" stroke-width="3.5" fill="none" stroke-linecap="round" />
                  </g>

                  <!-- 8. Five Glowing Animated Candle Flames -->
                  <g class="cake-flames-layer" id="cakeFlamesLayer">
                    <!-- Flame 1 (C1: 176, 146) -->
                    <g class="cake-flame-unit u1" transform="translate(176, 146)">
                      <circle cx="0" cy="-6" r="32" fill="url(#flameHaloAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#flameGlowGlint)">
                        <!-- Flame teardrop outer body -->
                        <path d="M0,0 C-9,-10 -11,-26 0,-40 C11,-26 9,-10 0,0 Z" fill="url(#flameCoreGrad)" />
                        <!-- Flame inner bright core -->
                        <ellipse cx="0" cy="-8" rx="3.2" ry="7" fill="#ffffff" opacity="0.95" />
                        <!-- Blue combustion root -->
                        <ellipse cx="0" cy="-2" rx="3" ry="2" fill="#38bdf8" opacity="0.8" />
                      </g>
                    </g>

                    <!-- Flame 2 (C2: 238, 124) -->
                    <g class="cake-flame-unit u2" transform="translate(238, 124)">
                      <circle cx="0" cy="-7" r="34" fill="url(#flameHaloAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#flameGlowGlint)">
                        <path d="M0,0 C-10,-12 -12,-30 0,-44 C12,-30 10,-12 0,0 Z" fill="url(#flameCoreGrad)" />
                        <ellipse cx="0" cy="-9" rx="3.6" ry="7.5" fill="#ffffff" opacity="0.95" />
                        <ellipse cx="0" cy="-2" rx="3.2" ry="2" fill="#38bdf8" opacity="0.8" />
                      </g>
                    </g>

                    <!-- Flame 3 (C3: 300, 106 - Tallest/Center) -->
                    <g class="cake-flame-unit u3" transform="translate(300, 106)">
                      <circle cx="0" cy="-8" r="36" fill="url(#flameHaloAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#flameGlowGlint)">
                        <path d="M0,0 C-11,-13 -13,-34 0,-48 C13,-34 11,-13 0,0 Z" fill="url(#flameCoreGrad)" />
                        <ellipse cx="0" cy="-10" rx="3.8" ry="8" fill="#ffffff" opacity="0.95" />
                        <ellipse cx="0" cy="-2" rx="3.5" ry="2" fill="#38bdf8" opacity="0.8" />
                      </g>
                    </g>

                    <!-- Flame 4 (C4: 362, 124) -->
                    <g class="cake-flame-unit u4" transform="translate(362, 124)">
                      <circle cx="0" cy="-7" r="34" fill="url(#flameHaloAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#flameGlowGlint)">
                        <path d="M0,0 C-10,-12 -12,-30 0,-44 C12,-30 10,-12 0,0 Z" fill="url(#flameCoreGrad)" />
                        <ellipse cx="0" cy="-9" rx="3.6" ry="7.5" fill="#ffffff" opacity="0.95" />
                        <ellipse cx="0" cy="-2" rx="3.2" ry="2" fill="#38bdf8" opacity="0.8" />
                      </g>
                    </g>

                    <!-- Flame 5 (C5: 424, 146) -->
                    <g class="cake-flame-unit u5" transform="translate(424, 146)">
                      <circle cx="0" cy="-6" r="32" fill="url(#flameHaloAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#flameGlowGlint)">
                        <path d="M0,0 C-9,-10 -11,-26 0,-40 C11,-26 9,-10 0,0 Z" fill="url(#flameCoreGrad)" />
                        <ellipse cx="0" cy="-8" rx="3.2" ry="7" fill="#ffffff" opacity="0.95" />
                        <ellipse cx="0" cy="-2" rx="3" ry="2" fill="#38bdf8" opacity="0.8" />
                      </g>
                    </g>
                  </g>

                  <!-- 9. Floating Golden Sparkle Glints -->
                  <g class="cake-sparkles-group" aria-hidden="true">
                    <text x="145" y="130" class="cake-sparkle-star s-glint1" fill="#fef08a">✦</text>
                    <text x="210" y="90" class="cake-sparkle-star s-glint2" fill="#fef08a">✦</text>
                    <text x="320" y="70" class="cake-sparkle-star s-glint3" fill="#fef08a">✦</text>
                    <text x="390" y="85" class="cake-sparkle-star s-glint4" fill="#fef08a">✦</text>
                    <text x="455" y="130" class="cake-sparkle-star s-glint5" fill="#fef08a">✦</text>
                  </g>
                </svg>
              </div>

              <!-- Interactive Cake Ceremony Controls -->
              <div class="cake-action-area">
                <div class="cake-btn-row">
                  <button class="btn-starlight btn-cake-blow" id="blowCandleBtn" title="Make a wish and blow out the candles!">
                    🕯️ Blow Out Candles & Make a Wish
                  </button>
                  <button class="btn-cake-mic" id="cakeMicBtn" type="button" title="Enable microphone breath detection to blow out the candles!">
                    <span class="mic-icon">🎤</span>
                    <span class="mic-text">Blow with Mic</span>
                  </button>
                </div>

                <div class="cake-wish-banner" id="cakeWishBanner">
                  ${birthdayConfig.cake.promptBefore}
                </div>
              </div>

              <div style="display: flex; gap: 14px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
                <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" data-goto="screen-c">
                  ← Back to Gifts
                </button>
                <button class="btn-primary" data-goto="screen-g">
                  Next: Scrapbook Memories 📸 →
                </button>
              </div>
            </div>
          </section>
                <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" data-goto="screen-c">
                  ← Back to Gifts
                </button>
                <button class="btn-primary" data-goto="screen-g">
                  Next: Scrapbook Memories 📸 →
                </button>
              </div>
            </div>
          </section>

          <!-- ==========================================
               SCREEN G: PHOTO MEMORIES (FULL-IMAGE IMMERSIVE)
               ========================================== -->
          <section class="exp-screen exp-screen--memories-immersive" id="screen-g">
            <!-- Full Ambient Image Blurred Backdrop -->
            <div class="memories-ambient-backdrop" style="background-image: url('${birthdayConfig.scrapbook.featured.src}');" aria-hidden="true"></div>

            <div class="memories-fullscreen-stage">
              <!-- Full Artwork Display - Only this photo on memories page -->
              <div class="memories-hero-card" id="memoriesPhotoCard" role="button" tabindex="0" title="Tap to view full screen">
                <img
                  src="${birthdayConfig.scrapbook.featured.src}"
                  alt="${birthdayConfig.scrapbook.featured.title}"
                  class="memories-hero-img"
                  id="memoriesMainPhoto"
                />
                <div class="memories-expand-overlay">
                  <span class="memories-expand-pill">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                    Tap to Expand Full Screen ⛶
                  </span>
                </div>
              </div>

              <!-- Dedicated Navigation Footer -->
              <div class="memories-nav-footer">
                <button class="btn-primary" style="background: rgba(30, 4, 10, 0.75); color: #ffd6df; border: 1px solid rgba(255, 215, 170, 0.4); backdrop-filter: blur(10px);" data-goto="screen-e-cake">
                  ← Back to Cake
                </button>
                <button class="btn-fullscreen-hero" id="btnMemoriesFullScreen" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                  Full Screen View ⛶
                </button>
                <button class="btn-primary" data-goto="screen-h">
                  Next: Vinyl Music Player 🎵 →
                </button>
              </div>
            </div>
          </section>

          <!-- ==========================================
               SCREEN H: VINYL RECORD MUSIC PLAYER
               ========================================== -->
          <section class="exp-screen" id="screen-h">
            <div class="vinyl-stage">
              <h1 class="vinyl-title">${birthdayConfig.vinylScene.title}</h1>
              <p class="vinyl-subtitle" id="vinylTrackSub">${birthdayConfig.vinylScene.trackTitle}</p>

              <!-- Track Switcher Tabs -->
              <div class="vinyl-track-tabs">
                <button class="vinyl-tab-btn is-active" id="tabTrackKeerthi" data-track="keerthi_song" type="button">
                  <span class="tab-star">🌟</span>
                  <span>இனிய பிறந்தநாள் கீர்த்தி</span>
                  <span class="tab-tag">Dedicated Song ♥</span>
                </button>
                <button class="vinyl-tab-btn" id="tabTrackSidu" data-track="sidu_sidu" type="button">
                  <span class="tab-note">🎶</span>
                  <span>Sidu Sidu (Romeo)</span>
                </button>
              </div>

              <!-- Vinyl Record Deck -->
              <div class="vinyl-deck" id="vinylDeck">
                <div class="vinyl-disc" id="vinylDisc" role="button" tabindex="0" title="Tap to spin & play">
                  <div class="vinyl-groove-rings"></div>
                  <div class="vinyl-label" id="vinylDiscLabel">
                    <div class="vinyl-center-hole"></div>
                    <span class="vinyl-label-title" id="vinylLabelTitle">இனிய பிறந்தநாள் கீர்த்தி</span>
                    <span class="vinyl-label-sub" id="vinylLabelSub">Sakthi Narayanan ♥</span>
                    <span class="vinyl-label-badge" id="vinylLabelBadge">Special 33⅓ RPM</span>
                  </div>
                </div>

                <div class="vinyl-tonearm" id="vinylTonearm">
                  <div class="tonearm-pivot"></div>
                  <div class="tonearm-bar"></div>
                  <div class="tonearm-head"></div>
                </div>
              </div>

              <!-- Audio Timeline & Seek Bar -->
              <div class="vinyl-timeline-bar" id="vinylTimelineWrap">
                <span class="timeline-time" id="vinylTimeCurrent">0:00</span>
                <div class="timeline-track" id="vinylTimelineTrack" role="slider" aria-label="Seek track position" tabindex="0">
                  <div class="timeline-fill" id="vinylTimelineFill"></div>
                  <div class="timeline-thumb" id="vinylTimelineThumb"></div>
                </div>
                <span class="timeline-time" id="vinylTimeTotal">3:54</span>
              </div>

              <!-- Audio Controls -->
              <div class="vinyl-controls">
                <button class="vinyl-ctrl-btn" id="audioMuteBtn" title="Mute/Unmute">
                  🔔
                </button>
                <button class="vinyl-ctrl-btn btn-play-large" id="audioPlayBtn" title="Play/Pause">
                  ▶
                </button>
                <button class="vinyl-ctrl-btn" id="audioConfettiBtn" title="Celebrate Confetti!">
                  🎉
                </button>
              </div>

              <!-- Lyrics Card Accordion -->
              <div class="vinyl-lyrics-card">
                <button class="lyrics-toggle-btn" id="lyricsToggleBtn" type="button">
                  <span class="lyrics-toggle-icon">📜</span>
                  <span>View Lyrics • பாடல் வரிகள்</span>
                  <span class="lyrics-arrow" id="lyricsArrow">▼</span>
                </button>
                <div class="lyrics-drawer" id="lyricsDrawer">
                  <div class="lyrics-content">
                    <h3 class="lyrics-title">${birthdayConfig.vinylScene.lyrics.title}</h3>
                    <p class="lyrics-author">${birthdayConfig.vinylScene.lyrics.author}</p>
                    ${birthdayConfig.vinylScene.lyrics.sections.map(sec => `
                      <div class="lyrics-section">
                        <h4 class="lyrics-sec-header">${sec.label}</h4>
                        ${sec.lines.map(line => `<p class="lyrics-line">${line}</p>`).join('')}
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div class="vinyl-closing-card">
                <blockquote style="font-style: italic; font-size: 16.5px; color: var(--gold-accent); margin-bottom: 12px;">
                  ${birthdayConfig.vinylScene.vinylQuote}
                </blockquote>
                <p class="vinyl-closing-msg">
                  ${birthdayConfig.vinylScene.closingMessage}
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                  <button class="btn-primary" id="replayAllBtn">
                    ↺ Start from Beginning
                  </button>
                  <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" id="backToTreeBtn">
                    🌲 Return to Heart Tree
                  </button>
                </div>
              </div>
            </div>
          </section>

        </main>

        <!-- Canvas for Confetti & Petals -->
        <canvas class="confetti-canvas" id="confettiCanvas"></canvas>

        <!-- Lightbox Modal -->
        <div class="exp-lightbox" id="expLightbox" role="dialog" aria-modal="true" aria-label="Photo memory details">
          <div class="lightbox-content" id="lightboxContent">
            <div class="lightbox-top-actions">
              <button class="lightbox-fs-btn" id="lightboxFullscreenBtn" title="Toggle Fullscreen (or press F)" aria-label="Toggle Fullscreen">
                <svg class="fs-icon-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
                <svg class="fs-icon-exit" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>
                </svg>
                <span class="fs-text">Full Screen</span>
              </button>
              <button class="lightbox-close" id="lightboxCloseBtn" aria-label="Close photo view">✕</button>
            </div>
            <div class="lightbox-img-wrap" id="lightboxImgWrap"></div>
            <div class="lightbox-meta-wrap">
              <h3 class="lightbox-title" id="lightboxTitle"></h3>
              <p class="lightbox-caption" id="lightboxCaption"></p>
              <p class="lightbox-date" id="lightboxDate"></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Navigation bar buttons
    document.querySelectorAll('.exp-nav__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.goToScreen(target);
      });
    });

    // In-page navigation buttons (data-goto)
    document.querySelectorAll('[data-goto]').forEach(el => {
      el.addEventListener('click', () => {
        const target = el.getAttribute('data-goto');
        this.goToScreen(target);
      });
    });

    // Screen A: Envelope Tap
    const envBox = document.getElementById('envBox');
    const envSeal = document.getElementById('envSeal');
    const openEnvelope = () => {
      if (envBox.classList.contains('is-open')) return;
      envBox.classList.add('is-open');
      romanticAudio.start(); // Start background soundtrack "Sidu Sidu" from 0:38!
      this.fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45);
      setTimeout(() => {
        this.goToScreen('screen-b');
      }, 1400);
    };

    if (envBox) envBox.addEventListener('click', openEnvelope);
    if (envSeal) envSeal.addEventListener('click', (e) => { e.stopPropagation(); openEnvelope(); });

    // Ensure soundtrack begins playing on Screen A
    const screenA = document.getElementById('screen-a');
    if (screenA) {
      screenA.addEventListener('click', () => {
        if (!romanticAudio.isPlaying) {
          romanticAudio.start();
        }
      });
    }

    // Screen B Continue Button
    const cineContinue = document.getElementById('cineContinueBtn');
    if (cineContinue) {
      cineContinue.addEventListener('click', () => this.goToScreen('screen-c'));
    }

    // Screen E-1: Bouquet Untie & Bloom Feature (New Interactive Ceremony!)
    const bouquetUntieBtn = document.getElementById('bouquetUntieBtn');
    const bouquetArt = document.getElementById('bouquetArt');
    let bouquetBloomed = false;

    if (bouquetUntieBtn) {
      bouquetUntieBtn.addEventListener('click', () => {
        bouquetBloomed = !bouquetBloomed;
        if (bouquetArt) {
          bouquetArt.classList.toggle('is-bloomed', bouquetBloomed);
        }
        if (bouquetBloomed) {
          bouquetUntieBtn.innerHTML = '🌸 Bouquet Bloomed with Love! (Tap to Re-tie)';
          const rect = bouquetArt ? bouquetArt.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight * 0.4, width: 0, height: 0 };
          this.showerPetals(rect.left + rect.width / 2, rect.top + rect.height * 0.4, 45);
          this.fireConfetti(rect.left + rect.width / 2, rect.top + rect.height * 0.35, 50);
        } else {
          bouquetUntieBtn.innerHTML = '✨ Untie the Ribbon to Bloom the Bouquet ✨';
        }
      });
    }

    // Bouquet Petal Shower on tap
    if (bouquetArt) {
      bouquetArt.addEventListener('click', (e) => {
        const rect = bouquetArt.getBoundingClientRect();
        this.showerPetals(rect.left + rect.width / 2, rect.top + rect.height / 3, 24);
      });
    }

    // Flower Hotspots & Blessing Pills
    const showFlowerBlessing = (flowerId) => {
      const b = birthdayConfig.bouquet.blessings.find(item => item.id === flowerId) || birthdayConfig.bouquet.blessings[0];
      const iconEl = document.getElementById('blessingIcon');
      const titleEl = document.getElementById('blessingTitle');
      const wishEl = document.getElementById('blessingWish');
      if (iconEl) iconEl.textContent = b.icon;
      if (titleEl) titleEl.textContent = b.flower;
      if (wishEl) wishEl.textContent = `“${b.wish}”`;

      // Update active state on blessing pills
      document.querySelectorAll('.blessing-pill').forEach(pill => {
        pill.classList.toggle('is-active', pill.getAttribute('data-flower-id') === flowerId);
      });

      // Spawn soft sparkles on tap
      if (bouquetArt) {
        const rect = bouquetArt.getBoundingClientRect();
        this.showerPetals(rect.left + rect.width / 2, rect.top + rect.height * 0.35, 18);
      }
    };

    document.querySelectorAll('.flower-hotspot, .flower-hotspot-zone').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const flowerId = el.getAttribute('data-flower');
        showFlowerBlessing(flowerId);
      });
    });

    document.querySelectorAll('.blessing-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const flowerId = pill.getAttribute('data-flower-id');
        showFlowerBlessing(flowerId);
      });
    });

    // Screen E-2: Realistic Animated Candle Ceremony
    const cakeStage = document.getElementById('cakeStage');
    const blowBtn = document.getElementById('blowCandleBtn');
    const micBtn = document.getElementById('cakeMicBtn');
    const wishBanner = document.getElementById('cakeWishBanner');

    const executeBlowSequence = () => {
      if (this.candlesBlown || this.isBlowingInProgress) return;
      this.isBlowingInProgress = true;
      this.stopBreathDetection();

      // Phase 1: Wind gust & flame bending/extinguishing
      if (cakeStage) cakeStage.classList.add('is-blowing');
      if (blowBtn) {
        blowBtn.disabled = true;
        blowBtn.innerHTML = '💨 Blowing...';
      }
      if (wishBanner) {
        wishBanner.innerHTML = `<span class="cake-wish-step blowing">${birthdayConfig.cake.promptBlowing || '💨 Making your wish...'}</span>`;
      }

      // Staggered flame extinction (over 450ms)
      setTimeout(() => {
        if (cakeStage) {
          cakeStage.classList.remove('is-blowing');
          cakeStage.classList.add('is-blown');
        }
        this.candlesBlown = true;
        this.isBlowingInProgress = false;

        // Phase 2 & 3: Smoke wisps rise, embers glow & fade
        // Phase 4: Celebration particles & 2-phase message reveal
        const rect = cakeStage ? cakeStage.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight * 0.35, width: 0, height: 0 };
        this.fireConfetti(rect.left + rect.width / 2, rect.top + 90);
        setTimeout(() => {
          this.fireConfetti(rect.left + rect.width / 2 + 60, rect.top + 70);
          this.showerPetals(rect.left + rect.width / 2, rect.top + 100, 30);
        }, 220);

        // Phase 4 - Message 1
        if (wishBanner) {
          wishBanner.innerHTML = `
            <div class="wish-reveal-step wish-p1">
              <span class="wish-icon">✨</span>
              <strong class="wish-text-main">${birthdayConfig.cake.wishMessagePhase1 || '“Your wish is now on its way to the universe. ✨”'}</strong>
            </div>
          `;
        }

        // Phase 4 - Message 2 (revealed after 1.8s)
        setTimeout(() => {
          if (this.candlesBlown && wishBanner) {
            wishBanner.innerHTML = `
              <div class="wish-reveal-step wish-p1">
                <span class="wish-icon">✨</span>
                <strong class="wish-text-main">${birthdayConfig.cake.wishMessagePhase1 || '“Your wish is now on its way to the universe. ✨”'}</strong>
              </div>
              <div class="wish-reveal-step wish-p2">
                <span class="wish-heart">❤️</span>
                <p class="wish-text-sub">${birthdayConfig.cake.wishMessagePhase2 || '“May all your beautiful dreams come true. Happy Birthday! ❤️”'}</p>
              </div>
            `;
          }
        }, 1800);

        // Update button to Relight Candles
        if (blowBtn) {
          blowBtn.disabled = false;
          blowBtn.innerHTML = '✨ Relight Candles';
          blowBtn.classList.add('btn-relight-mode');
        }
      }, 450);
    };

    const relightCandles = () => {
      if (!this.candlesBlown || this.isBlowingInProgress) return;
      this.isBlowingInProgress = true;

      // Reset blown state
      if (cakeStage) {
        cakeStage.classList.remove('is-blown');
        cakeStage.classList.add('is-relighting');
      }
      this.candlesBlown = false;

      if (blowBtn) {
        blowBtn.disabled = true;
        blowBtn.innerHTML = '✨ Igniting...';
        blowBtn.classList.remove('btn-relight-mode');
      }

      if (wishBanner) {
        wishBanner.innerHTML = `<span class="cake-wish-step relighting">✨ Igniting candles with birthday stardust...</span>`;
      }

      const rect = cakeStage ? cakeStage.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight * 0.35, width: 0 };
      this.showerPetals(rect.left + rect.width / 2, rect.top + 70, 15);

      setTimeout(() => {
        if (cakeStage) cakeStage.classList.remove('is-relighting');
        this.isBlowingInProgress = false;

        if (blowBtn) {
          blowBtn.disabled = false;
          blowBtn.innerHTML = '🕯️ Blow Out Candles & Make a Wish';
        }

        if (wishBanner) {
          wishBanner.textContent = birthdayConfig.cake.promptBefore;
        }
      }, 700);
    };

    const handleCakeCeremonyClick = () => {
      if (this.candlesBlown) {
        relightCandles();
      } else {
        executeBlowSequence();
      }
    };

    if (cakeStage) cakeStage.addEventListener('click', handleCakeCeremonyClick);
    if (blowBtn) blowBtn.addEventListener('click', handleCakeCeremonyClick);
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        this.toggleBreathDetection(executeBlowSequence);
      });
    }

    // Screen G: Polaroid Lightbox
    document.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('click', () => {
        const photoId = parseInt(card.getAttribute('data-photo-id'), 10);
        const photo = birthdayConfig.scrapbook.photos.find(p => p.id === photoId);
        if (photo) this.openLightbox(photo);
      });
    });

    const letterPin = document.getElementById('letterPhotoPin');
    if (letterPin) {
      letterPin.addEventListener('click', () => {
        this.openLightbox(birthdayConfig.scrapbook.photos[0]);
      });
    }

    // Screen G: Single Full-Image Memory
    const memoriesPhotoCard = document.getElementById('memoriesPhotoCard');
    const memoriesFsBtn = document.getElementById('btnMemoriesFullScreen');
    const openMemoriesFullscreen = (e) => {
      if (e) e.stopPropagation();
      if (birthdayConfig.scrapbook && birthdayConfig.scrapbook.featured) {
        this.openLightbox(birthdayConfig.scrapbook.featured, true);
      }
    };
    if (memoriesPhotoCard) memoriesPhotoCard.addEventListener('click', openMemoriesFullscreen);
    if (memoriesFsBtn) memoriesFsBtn.addEventListener('click', openMemoriesFullscreen);

    // Fullscreen toggle button in Lightbox
    const lbFsBtn = document.getElementById('lightboxFullscreenBtn');
    if (lbFsBtn) {
      lbFsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLightboxFullscreen();
      });
    }

    const lightboxClose = document.getElementById('lightboxCloseBtn');
    const lightbox = document.getElementById('expLightbox');
    if (lightboxClose) lightboxClose.addEventListener('click', () => this.closeLightbox());
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) this.closeLightbox();
      });
    }

    // Keyboard support: ESC to close lightbox, F to toggle fullscreen
    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('expLightbox');
      if (lb && lb.classList.contains('is-open')) {
        if (e.key === 'Escape') {
          this.closeLightbox();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleLightboxFullscreen();
        }
      }
    });

    // Screen H: Vinyl Controls & Multi-Track Manager
    const vinylDisc = document.getElementById('vinylDisc');
    const audioPlayBtn = document.getElementById('audioPlayBtn');
    const audioMuteBtn = document.getElementById('audioMuteBtn');
    const audioConfettiBtn = document.getElementById('audioConfettiBtn');
    const vinylDeck = document.getElementById('vinylDeck');
    const tabKeerthi = document.getElementById('tabTrackKeerthi');
    const tabSidu = document.getElementById('tabTrackSidu');
    const vinylLabelTitle = document.getElementById('vinylLabelTitle');
    const vinylLabelSub = document.getElementById('vinylLabelSub');
    const vinylLabelBadge = document.getElementById('vinylLabelBadge');
    const vinylTrackSub = document.getElementById('vinylTrackSub');
    const timeCur = document.getElementById('vinylTimeCurrent');
    const timeTot = document.getElementById('vinylTimeTotal');
    const timeFill = document.getElementById('vinylTimelineFill');
    const timeThumb = document.getElementById('vinylTimelineThumb');
    const timelineTrack = document.getElementById('vinylTimelineTrack');
    const lyricsToggleBtn = document.getElementById('lyricsToggleBtn');
    const lyricsDrawer = document.getElementById('lyricsDrawer');
    const lyricsArrow = document.getElementById('lyricsArrow');

    const formatSec = (sec) => {
      if (isNaN(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const updateTrackUI = (trackId) => {
      if (trackId === 'keerthi_song') {
        if (tabKeerthi) tabKeerthi.classList.add('is-active');
        if (tabSidu) tabSidu.classList.remove('is-active');
        if (vinylLabelTitle) vinylLabelTitle.textContent = 'இனிய பிறந்தநாள் கீர்த்தி';
        if (vinylLabelSub) vinylLabelSub.textContent = 'Sakthi Narayanan ♥';
        if (vinylLabelBadge) vinylLabelBadge.textContent = 'Dedicated 33⅓ RPM';
        if (vinylTrackSub) vinylTrackSub.textContent = 'இனிய பிறந்தநாள் கீர்த்தி — Sakthi Narayanan';
        const pillTitle = document.querySelector('.music-pill-title');
        if (pillTitle) pillTitle.textContent = '♫ இனிய பிறந்தநாள் கீர்த்தி';
      } else {
        if (tabKeerthi) tabKeerthi.classList.remove('is-active');
        if (tabSidu) tabSidu.classList.add('is-active');
        if (vinylLabelTitle) vinylLabelTitle.textContent = 'SIDU SIDU';
        if (vinylLabelSub) vinylLabelSub.textContent = 'Romeo (0:38)';
        if (vinylLabelBadge) vinylLabelBadge.textContent = 'Background Melody';
        if (vinylTrackSub) vinylTrackSub.textContent = 'Sidu Sidu (Romeo) — Kapil Kapilan';
        const pillTitle = document.querySelector('.music-pill-title');
        if (pillTitle) pillTitle.textContent = '♫ Sidu Sidu (Romeo)';
      }
    };

    if (tabKeerthi) {
      tabKeerthi.addEventListener('click', () => {
        romanticAudio.selectTrack('keerthi_song', true);
        updateTrackUI('keerthi_song');
        this.fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4);
      });
    }

    if (tabSidu) {
      tabSidu.addEventListener('click', () => {
        romanticAudio.selectTrack('sidu_sidu', true);
        updateTrackUI('sidu_sidu');
      });
    }

    // Toggle lyrics drawer
    if (lyricsToggleBtn && lyricsDrawer) {
      lyricsToggleBtn.addEventListener('click', () => {
        const isOpen = lyricsDrawer.classList.toggle('is-open');
        if (lyricsArrow) lyricsArrow.textContent = isOpen ? '▲' : '▼';
        lyricsToggleBtn.classList.toggle('is-active', isOpen);
      });
    }

    // Timeline seeking
    if (timelineTrack) {
      timelineTrack.addEventListener('click', (e) => {
        const rect = timelineTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (romanticAudio.activeTrack === 'keerthi_song') {
          const dur = romanticAudio.localAudio && romanticAudio.localAudio.duration ? romanticAudio.localAudio.duration : 234;
          romanticAudio.seek(ratio * dur);
        } else {
          romanticAudio.seek(38 + ratio * 200);
        }
      });
    }

    // Subscribe to time updates
    romanticAudio.onTimeUpdate(({ currentTime, duration, percent }) => {
      if (timeCur) timeCur.textContent = formatSec(currentTime);
      if (timeTot && duration > 0) timeTot.textContent = formatSec(duration);
      if (timeFill) timeFill.style.width = `${percent}%`;
      if (timeThumb) timeThumb.style.left = `${percent}%`;
    });

    romanticAudio.onTrackChange((trackId) => {
      updateTrackUI(trackId);
    });

    const togglePlayback = () => {
      const playing = romanticAudio.toggle();
      vinylDisc.classList.toggle('is-playing', playing);
      vinylDeck.classList.toggle('is-playing', playing);
      audioPlayBtn.innerHTML = playing ? '❚❚' : '▶';
      if (playing) {
        this.fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4);
      }
    };

    if (vinylDisc) vinylDisc.addEventListener('click', togglePlayback);
    if (audioPlayBtn) audioPlayBtn.addEventListener('click', togglePlayback);

    if (audioMuteBtn) {
      audioMuteBtn.addEventListener('click', () => {
        const muted = romanticAudio.toggleMute();
        audioMuteBtn.innerHTML = muted ? '🔕' : '🔔';
        if (musicPillMuteBtn) musicPillMuteBtn.innerHTML = muted ? '🔕' : '🔔';
      });
    }

    if (audioConfettiBtn) {
      audioConfettiBtn.addEventListener('click', () => {
        this.fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5);
      });
    }

    // Floating Music Pill Widget controls
    const musicPillPlayBtn = document.getElementById('musicPillPlayBtn');
    const musicPillMuteBtn = document.getElementById('musicPillMuteBtn');
    const musicFloatingPill = document.getElementById('musicFloatingPill');

    if (musicPillPlayBtn) {
      musicPillPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        romanticAudio.toggle();
      });
    }

    if (musicPillMuteBtn) {
      musicPillMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = romanticAudio.toggleMute();
        musicPillMuteBtn.innerHTML = muted ? '🔕' : '🔔';
        if (audioMuteBtn) audioMuteBtn.innerHTML = muted ? '🔕' : '🔔';
      });
    }

    if (musicFloatingPill) {
      musicFloatingPill.addEventListener('click', () => {
        romanticAudio.toggle();
      });
    }

    // Return / Replay actions
    const replayAll = document.getElementById('replayAllBtn');
    if (replayAll) {
      replayAll.addEventListener('click', () => {
        this.goToScreen('screen-a');
        const envBox = document.getElementById('envBox');
        if (envBox) envBox.classList.remove('is-open');
      });
    }

    const backToTree = document.getElementById('backToTreeBtn');
    const expCloseBtn = document.getElementById('expCloseBtn');
    const hideExperience = () => {
      const overlay = document.getElementById('expOverlay');
      if (overlay) {
        overlay.classList.remove('is-active');
        overlay.classList.remove('is-moon-mode');
      }
      romanticAudio.pause();
      if (vinylDisc) vinylDisc.classList.remove('is-playing');
      if (vinylDeck) vinylDeck.classList.remove('is-playing');
      if (audioPlayBtn) audioPlayBtn.innerHTML = '▶';
    };

    if (backToTree) backToTree.addEventListener('click', hideExperience);
    if (expCloseBtn) expCloseBtn.addEventListener('click', hideExperience);
  }

  initAudioSync() {
    romanticAudio.onStateChange((playing) => {
      const vinylDisc = document.getElementById('vinylDisc');
      const vinylDeck = document.getElementById('vinylDeck');
      const audioPlayBtn = document.getElementById('audioPlayBtn');
      const musicPillPlayBtn = document.getElementById('musicPillPlayBtn');
      const musicPillWave = document.getElementById('musicPillWave');

      if (vinylDisc) vinylDisc.classList.toggle('is-playing', playing);
      if (vinylDeck) vinylDeck.classList.toggle('is-playing', playing);
      if (audioPlayBtn) audioPlayBtn.innerHTML = playing ? '❚❚' : '▶';
      if (musicPillPlayBtn) musicPillPlayBtn.innerHTML = playing ? '❚❚' : '▶';
      if (musicPillWave) musicPillWave.classList.toggle('is-active', playing);
    });
  }

  goToScreen(screenId) {
    document.querySelectorAll('.exp-screen').forEach(s => s.classList.remove('is-active'));
    document.querySelectorAll('.exp-nav__btn').forEach(b => b.classList.remove('is-active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('is-active');
      this.currentScreen = screenId;
    }

    // Pure black background for MOON page ONLY; rich crimson for all other pages
    const overlay = document.getElementById('expOverlay');
    if (overlay) {
      overlay.classList.toggle('is-moon-mode', screenId === 'screen-moon');
    }

    const targetNav = document.querySelector(`.exp-nav__btn[data-target="${screenId}"]`);
    if (targetNav) targetNav.classList.add('is-active');

    // Scroll viewport to top on screen change
    const viewport = document.querySelector('.exp-viewport');
    if (viewport) viewport.scrollTop = 0;

    // Trigger welcome shooting star when entering moonlight scene
    if (screenId === 'screen-moon') {
      setTimeout(() => {
        moonlightEngine.triggerShootingStar();
      }, 500);
    }

    // Auto-spin vinyl on entering screen H and play dedicated song
    if (screenId === 'screen-h') {
      romanticAudio.selectTrack('keerthi_song', true);
      const vinylDisc = document.getElementById('vinylDisc');
      const vinylDeck = document.getElementById('vinylDeck');
      const audioPlayBtn = document.getElementById('audioPlayBtn');
      if (vinylDisc) vinylDisc.classList.add('is-playing');
      if (vinylDeck) vinylDeck.classList.add('is-playing');
      if (audioPlayBtn) audioPlayBtn.innerHTML = '❚❚';
    }

    // Cake scene entrance or exit cleanup
    if (screenId === 'screen-e-cake') {
      this.onEnterCakeScene();
    } else {
      this.stopBreathDetection();
    }
  }

  onEnterCakeScene() {
    const cakeStage = document.getElementById('cakeStage');
    if (cakeStage && !this.candlesBlown) {
      cakeStage.classList.add('is-entrance');
      setTimeout(() => {
        cakeStage.classList.remove('is-entrance');
      }, 1200);
    }
  }

  toggleBreathDetection(onBlowDetected) {
    const micBtn = document.getElementById('cakeMicBtn');
    if (this.isListeningForBlow) {
      this.stopBreathDetection();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (micBtn) {
        const textSpan = micBtn.querySelector('.mic-text');
        if (textSpan) textSpan.textContent = 'Mic unavailable';
      }
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.micStream = stream;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
        const source = this.audioCtx.createMediaStreamSource(stream);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        this.isListeningForBlow = true;
        if (micBtn) {
          micBtn.classList.add('is-listening');
          const textSpan = micBtn.querySelector('.mic-text');
          if (textSpan) textSpan.textContent = 'Blow into mic! 💨';
        }

        const banner = document.getElementById('cakeWishBanner');
        if (banner && !this.candlesBlown) {
          banner.innerHTML = `<span style="color: #67e8f9;">💨 Listening to your microphone... Blow gently into your mic to blow out the candles!</span>`;
        }

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let sustainedBlowCount = 0;

        const checkBreath = () => {
          if (!this.isListeningForBlow || this.candlesBlown) return;

          this.analyser.getByteFrequencyData(dataArray);

          // Calculate average amplitude across airflow frequencies (wind/breath noise)
          let sum = 0;
          for (let i = 4; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / (bufferLength - 4);

          // Threshold for breath sound
          if (avg > 38) {
            sustainedBlowCount++;
            if (sustainedBlowCount >= 3) {
              this.stopBreathDetection();
              if (onBlowDetected) onBlowDetected();
              return;
            }
          } else {
            sustainedBlowCount = Math.max(0, sustainedBlowCount - 1);
          }

          this.micRafId = requestAnimationFrame(checkBreath);
        };

        this.micRafId = requestAnimationFrame(checkBreath);
      })
      .catch(err => {
        console.warn('Microphone permission not granted:', err);
        if (micBtn) {
          const textSpan = micBtn.querySelector('.mic-text');
          if (textSpan) textSpan.textContent = 'Mic denied (tap button)';
        }
      });
  }

  stopBreathDetection() {
    this.isListeningForBlow = false;
    if (this.micRafId) {
      cancelAnimationFrame(this.micRafId);
      this.micRafId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    const micBtn = document.getElementById('cakeMicBtn');
    if (micBtn) {
      micBtn.classList.remove('is-listening');
      const textSpan = micBtn.querySelector('.mic-text');
      if (textSpan) textSpan.textContent = 'Blow with Mic';
    }
  }

  showExperience() {
    const overlay = document.getElementById('expOverlay');
    if (overlay) {
      overlay.classList.add('is-active');
      this.goToScreen(this.currentScreen || 'screen-a');
      // Song starts ONLY from this page (Screen A / Envelope page) onwards!
      romanticAudio.start();
    }
  }

  openLightbox(photo, isFullscreen = false) {
    const lightbox = document.getElementById('expLightbox');
    const content = document.getElementById('lightboxContent');
    const imgWrap = document.getElementById('lightboxImgWrap');
    const title = document.getElementById('lightboxTitle');
    const caption = document.getElementById('lightboxCaption');
    const date = document.getElementById('lightboxDate');
    const openIcon = document.querySelector('.fs-icon-open');
    const exitIcon = document.querySelector('.fs-icon-exit');
    const fsText = document.querySelector('.fs-text');

    if (!lightbox) return;

    if (photo.src) {
      imgWrap.innerHTML = `<img src="${photo.src}" alt="${photo.title}" class="lightbox-img" id="lightboxActiveImg" />`;
    } else {
      imgWrap.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${photo.gradient}; color: #fff;">
          <span style="font-size: 52px; margin-bottom: 8px;">💖</span>
          <span style="font-size: 20px; font-weight: 600;">${photo.title}</span>
        </div>
      `;
    }

    title.textContent = photo.title;
    caption.textContent = photo.caption;
    date.textContent = photo.date;

    if (content) {
      if (photo.isFeatured || isFullscreen) {
        content.classList.add('is-featured-mode');
        content.classList.add('is-fullscreen-view');
        if (openIcon) openIcon.style.display = 'none';
        if (exitIcon) exitIcon.style.display = 'inline-block';
        if (fsText) fsText.textContent = 'Exit Fullscreen';
      } else {
        content.classList.remove('is-featured-mode');
        content.classList.remove('is-fullscreen-view');
        if (openIcon) openIcon.style.display = 'inline-block';
        if (exitIcon) exitIcon.style.display = 'none';
        if (fsText) fsText.textContent = 'Full Screen';
      }
    }

    lightbox.classList.add('is-open');
  }

  toggleLightboxFullscreen() {
    const lightbox = document.getElementById('expLightbox');
    const content = document.getElementById('lightboxContent');
    const openIcon = document.querySelector('.fs-icon-open');
    const exitIcon = document.querySelector('.fs-icon-exit');
    const fsText = document.querySelector('.fs-text');
    if (!lightbox || !content) return;

    const isFull = content.classList.toggle('is-fullscreen-view');

    if (isFull) {
      if (openIcon) openIcon.style.display = 'none';
      if (exitIcon) exitIcon.style.display = 'inline-block';
      if (fsText) fsText.textContent = 'Exit Fullscreen';
      if (lightbox.requestFullscreen && !document.fullscreenElement) {
        lightbox.requestFullscreen().catch(() => {});
      }
    } else {
      if (openIcon) openIcon.style.display = 'inline-block';
      if (exitIcon) exitIcon.style.display = 'none';
      if (fsText) fsText.textContent = 'Full Screen';
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  closeLightbox() {
    const lightbox = document.getElementById('expLightbox');
    const content = document.getElementById('lightboxContent');
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (content) {
      content.classList.remove('is-fullscreen-view');
      content.classList.remove('is-featured-mode');
    }
    if (lightbox) lightbox.classList.remove('is-open');
  }

  /* --- Confetti Engine --- */
  initConfetti() {
    this.confettiCanvas = document.getElementById('confettiCanvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  fireConfetti(originX, originY, count = 75) {
    if (!this.confettiCtx) return;
    const colors = ['#f43f5e', '#fb7185', '#ffd166', '#06d6a0', '#118ab2', '#e8b960', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 12,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
      });
    }

    if (!this.confettiRAF) {
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiCtx) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.rotation += p.vrot;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1);
        continue;
      }

      this.confettiCtx.save();
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.globalAlpha = p.life;
      this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      this.confettiCtx.restore();
    }

    if (this.confettiParticles.length > 0) {
      this.confettiRAF = requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiRAF = null;
    }
  }

  /* --- Petal Shower Engine --- */
  initPetals() {
    // Petals share the confetti canvas for high efficiency
  }

  showerPetals(originX, originY, count = 28) {
    if (!this.confettiCtx) return;
    const colors = ['#fca5a5', '#f87171', '#fecdd3', '#fda4af', '#fb7185'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.5) * Math.PI;
      const speed = Math.random() * 5 + 2;
      this.confettiParticles.push({
        x: originX + (Math.random() - 0.5) * 60,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle)) * speed - 2,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 6,
        life: 1,
        decay: Math.random() * 0.01 + 0.005,
      });
    }

    if (!this.confettiRAF) {
      this.animateConfetti();
    }
  }

  checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('gifts') || params.has('experience')) {
      const screen = params.get('scene') || 'screen-a';
      this.showExperience();
      this.goToScreen(screen);
    }
  }
}

export const birthdayExperience = new BirthdayExperience();
