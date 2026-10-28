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

              <!-- Realistic Luxury Artisanal Cake Stage -->
              <div class="cake-interactive-stage" id="cakeStage" title="Tap the cake or candles to blow them out!">
                <div class="cake-showcase-frame">
                  <img
                    src="/images/realistic_cake.jpg"
                    alt="Luxury Artisanal Birthday Cake for Krithika"
                    class="cake-real-photo"
                    id="cakePhoto"
                  />
                  <!-- Warm Candlelight Ambient Reflection Glow on Cake -->
                  <div class="cake-candle-ambient-glow" id="cakeAmbientGlow" aria-hidden="true"></div>

                  <!-- Edible Gold Leaf & Berry Sparkle Glints -->
                  <div class="cake-sparkle-layer" aria-hidden="true">
                    <span class="cake-glint g1">✦</span>
                    <span class="cake-glint g2">✦</span>
                    <span class="cake-glint g3">✦</span>
                    <span class="cake-glint g4">✦</span>
                  </div>

                  <!-- Interactive Animated Candle Flames & Smoke Physics Overlay -->
                  <svg class="cake-flames-overlay" viewBox="0 0 1000 1000" fill="none">
                    <defs>
                      <radialGradient id="cakeFlameCore" cx="50%" cy="80%" r="70%">
                        <stop offset="0%" stop-color="#ffffff" />
                        <stop offset="25%" stop-color="#fef08a" />
                        <stop offset="65%" stop-color="#f59e0b" />
                        <stop offset="100%" stop-color="#ea580c" />
                      </radialGradient>
                      <radialGradient id="cakeFlameAura" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="rgba(254, 240, 138, 0.9)" />
                        <stop offset="40%" stop-color="rgba(245, 158, 11, 0.45)" />
                        <stop offset="100%" stop-color="transparent" />
                      </radialGradient>
                      <filter id="cakeGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ffd05a" flood-opacity="0.95"/>
                        <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#f59e0b" flood-opacity="0.6"/>
                      </filter>
                    </defs>

                    <!-- Candle 1 (Leftmost: 412, 140) -->
                    <g class="cake-flame-unit u1" transform="translate(412, 140)">
                      <circle cx="0" cy="0" r="32" fill="url(#cakeFlameAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#cakeGlowFilter)">
                        <path d="M0,0 C-10,-12 -12,-32 0,-46 C12,-32 10,-12 0,0 Z" fill="url(#cakeFlameCore)" />
                        <ellipse cx="0" cy="-8" rx="3.5" ry="7" fill="#ffffff" opacity="0.95" />
                      </g>
                      <path class="candle-smoke-wisp" d="M0,-4 Q-16,-34 10,-68 Q-10,-102 4,-136" stroke="#f1f5f9" stroke-width="3.5" fill="none" stroke-linecap="round" />
                    </g>

                    <!-- Candle 2 (Center-Left: 478, 126) -->
                    <g class="cake-flame-unit u2" transform="translate(478, 126)">
                      <circle cx="0" cy="0" r="34" fill="url(#cakeFlameAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#cakeGlowFilter)">
                        <path d="M0,0 C-11,-13 -13,-35 0,-50 C13,-35 11,-13 0,0 Z" fill="url(#cakeFlameCore)" />
                        <ellipse cx="0" cy="-9" rx="3.8" ry="7.5" fill="#ffffff" opacity="0.95" />
                      </g>
                      <path class="candle-smoke-wisp" d="M0,-4 Q12,-38 -10,-72 Q12,-106 -4,-140" stroke="#f1f5f9" stroke-width="3.8" fill="none" stroke-linecap="round" />
                    </g>

                    <!-- Candle 3 (Center-Right: 544, 126) -->
                    <g class="cake-flame-unit u3" transform="translate(544, 126)">
                      <circle cx="0" cy="0" r="34" fill="url(#cakeFlameAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#cakeGlowFilter)">
                        <path d="M0,0 C-11,-13 -13,-35 0,-50 C13,-35 11,-13 0,0 Z" fill="url(#cakeFlameCore)" />
                        <ellipse cx="0" cy="-9" rx="3.8" ry="7.5" fill="#ffffff" opacity="0.95" />
                      </g>
                      <path class="candle-smoke-wisp" d="M0,-4 Q-12,-38 10,-72 Q-12,-106 4,-140" stroke="#f1f5f9" stroke-width="3.8" fill="none" stroke-linecap="round" />
                    </g>

                    <!-- Candle 4 (Rightmost: 610, 140) -->
                    <g class="cake-flame-unit u4" transform="translate(610, 140)">
                      <circle cx="0" cy="0" r="32" fill="url(#cakeFlameAura)" class="flame-halo" />
                      <g class="candle-flame-body" filter="url(#cakeGlowFilter)">
                        <path d="M0,0 C-10,-12 -12,-32 0,-46 C12,-32 10,-12 0,0 Z" fill="url(#cakeFlameCore)" />
                        <ellipse cx="0" cy="-8" rx="3.5" ry="7" fill="#ffffff" opacity="0.95" />
                      </g>
                      <path class="candle-smoke-wisp" d="M0,-4 Q16,-34 -10,-68 Q10,-102 -4,-136" stroke="#f1f5f9" stroke-width="3.5" fill="none" stroke-linecap="round" />
                    </g>
                  </svg>
                </div>
              </div>

              <!-- Interactive Cake Ceremony Controls -->
              <div class="cake-action-area">
                <button class="btn-starlight btn-cake-blow" id="blowCandleBtn" title="Make a wish and blow out the candles!">
                  💨 Blow Out Candles & Make a Wish
                </button>

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

          <!-- ==========================================
               SCREEN G: PHOTO COLLAGE / SCRAPBOOK MEMORIES
               ========================================== -->
          <section class="exp-screen" id="screen-g">
            <div class="scrapbook-header">
              <h1 class="scrapbook-title">${birthdayConfig.scrapbook.title}</h1>
              <p class="scrapbook-subtitle">${birthdayConfig.scrapbook.subtitle}</p>
            </div>

            <!-- Featured Masterpiece Showcase Card -->
            <div class="scrapbook-featured-hero" id="featuredArtworkCard" role="button" tabindex="0" title="Click to view full screen">
              <div class="featured-badge">
                <span class="badge-sparkle">✨</span>
                <span>Special Dedicated Artwork</span>
                <span class="badge-sparkle">✨</span>
              </div>
              
              <div class="featured-frame">
                <div class="featured-tape featured-tape--top-left"></div>
                <div class="featured-tape featured-tape--top-right"></div>
                
                <div class="featured-img-container">
                  <img src="${birthdayConfig.scrapbook.featured.src}" alt="${birthdayConfig.scrapbook.featured.title}" class="featured-hero-img" id="featuredArtworkImg" />
                  <div class="featured-overlay">
                    <span class="fullscreen-cta-pill">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                      Tap to View Full Screen ⛶
                    </span>
                  </div>
                </div>

                <div class="featured-hero-meta">
                  <h2 class="featured-hero-title">${birthdayConfig.scrapbook.featured.title}</h2>
                  <p class="featured-hero-quote">${birthdayConfig.scrapbook.featured.quote}</p>
                  <p class="featured-hero-caption">${birthdayConfig.scrapbook.featured.caption}</p>
                  <div class="featured-hero-action-bar">
                    <button class="btn-fullscreen-hero" id="btnOpenHeroFullscreen" type="button">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </svg>
                      View Full Screen ⛶
                    </button>
                    <span class="featured-hint">23 World Scripts • Tamil, Telugu, Hindi, Arabic, Japanese, Korean & more</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scrapbook Divider -->
            <div class="scrapbook-section-divider">
              <span>✦ &nbsp; More Cherished Snapshots &nbsp; ✦</span>
            </div>

            <div class="scrapbook-grid">
              ${birthdayConfig.scrapbook.photos.map(p => `
                <div class="polaroid-card" style="transform: rotate(${p.rotation}deg);" data-photo-id="${p.id}" role="button" tabindex="0">
                  <div class="polaroid-tape"></div>
                  <div class="polaroid-img-wrap" style="background: ${p.gradient};">
                    ${p.src ? `<img src="${p.src}" alt="${p.title}" class="polaroid-img" />` : `
                      <div class="polaroid-placeholder">
                        <span class="polaroid-placeholder-icon">📷</span>
                        <strong style="font-size: 15px;">${p.title}</strong>
                        <span style="font-size: 12px; opacity: 0.9; margin-top: 4px;">${p.tag}</span>
                      </div>
                    `}
                  </div>
                  <p class="polaroid-caption">${p.title}</p>
                  <p class="polaroid-date">${p.date}</p>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 14px; justify-content: center; margin-top: 36px; flex-wrap: wrap;">
              <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" data-goto="screen-c">
                ← Back to Gifts
              </button>
              <button class="btn-primary" data-goto="screen-h">
                Next: Vinyl Music Player 🎵 →
              </button>
            </div>
          </section>
              <button class="btn-primary" style="background: rgba(255,255,255,0.15); color: #fff;" data-goto="screen-c">
                ← Back to Gifts
              </button>
              <button class="btn-primary" data-goto="screen-h">
                Next: Vinyl Music Player 🎵 →
              </button>
            </div>
          </section>

          <!-- ==========================================
               SCREEN H: VINYL RECORD MUSIC PLAYER
               ========================================== -->
          <section class="exp-screen" id="screen-h">
            <div class="vinyl-stage">
              <h1 class="vinyl-title">${birthdayConfig.vinylScene.title}</h1>
              <p class="vinyl-subtitle">${birthdayConfig.vinylScene.trackTitle}</p>

              <!-- Vinyl Record Deck -->
              <div class="vinyl-deck" id="vinylDeck">
                <div class="vinyl-disc" id="vinylDisc" role="button" tabindex="0" title="Tap to spin & play">
                  <div class="vinyl-label">
                    <div class="vinyl-center-hole"></div>
                    <span class="vinyl-label-title">SIDU SIDU</span>
                    <span class="vinyl-label-sub">Romeo (0:38)</span>
                  </div>
                </div>

                <div class="vinyl-tonearm" id="vinylTonearm">
                  <div class="tonearm-pivot"></div>
                  <div class="tonearm-bar"></div>
                  <div class="tonearm-head"></div>
                </div>
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

    // Screen E-2: Candle Blowing
    const cakeStage = document.getElementById('cakeStage');
    const blowBtn = document.getElementById('blowCandleBtn');
    const blowCandles = () => {
      if (this.candlesBlown) {
        // re-light candles with golden stardust
        cakeStage.classList.remove('is-blown');
        this.candlesBlown = false;
        document.getElementById('cakeWishBanner').textContent = birthdayConfig.cake.promptBefore;
        blowBtn.innerHTML = '💨 Blow Out Candles & Make a Wish';
        const rect = cakeStage ? cakeStage.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight * 0.35, width: 0 };
        this.showerPetals(rect.left + rect.width / 2, rect.top + 80, 15);
        return;
      }
      this.candlesBlown = true;
      cakeStage.classList.add('is-blown');
      document.getElementById('cakeWishBanner').innerHTML = `
        <strong style="color: #ffd05a; font-size: 1.15em; display: block; margin-bottom: 8px; text-shadow: 0 0 16px rgba(245, 158, 11, 0.4);">${birthdayConfig.cake.promptAfter}</strong>
        <span style="font-style: italic; color: #fffaf0;">${birthdayConfig.cake.wishNote}</span>
      `;
      blowBtn.innerHTML = '🔥 Relight Candles ✨';
      const rect = cakeStage ? cakeStage.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight * 0.35, width: 0, height: 0 };
      this.fireConfetti(rect.left + rect.width / 2, rect.top + 100);
      setTimeout(() => {
        this.fireConfetti(rect.left + rect.width / 2 + 50, rect.top + 80);
      }, 250);
      this.showerPetals(rect.left + rect.width / 2, rect.top + 120, 35);
    };

    if (cakeStage) cakeStage.addEventListener('click', blowCandles);
    if (blowBtn) blowBtn.addEventListener('click', blowCandles);

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

    // Screen G: Featured Masterpiece Full Screen
    const featuredCard = document.getElementById('featuredArtworkCard');
    const heroFsBtn = document.getElementById('btnOpenHeroFullscreen');
    const openFeaturedHero = (e) => {
      if (e) e.stopPropagation();
      if (birthdayConfig.scrapbook && birthdayConfig.scrapbook.featured) {
        this.openLightbox(birthdayConfig.scrapbook.featured, true);
      }
    };
    if (featuredCard) featuredCard.addEventListener('click', openFeaturedHero);
    if (heroFsBtn) heroFsBtn.addEventListener('click', openFeaturedHero);

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

    // Screen H: Vinyl Controls
    const vinylDisc = document.getElementById('vinylDisc');
    const audioPlayBtn = document.getElementById('audioPlayBtn');
    const audioMuteBtn = document.getElementById('audioMuteBtn');
    const audioConfettiBtn = document.getElementById('audioConfettiBtn');
    const vinylDeck = document.getElementById('vinylDeck');

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

    // Auto-spin vinyl on entering screen H
    if (screenId === 'screen-h' && !romanticAudio.isPlaying) {
      romanticAudio.start();
      const vinylDisc = document.getElementById('vinylDisc');
      const vinylDeck = document.getElementById('vinylDeck');
      const audioPlayBtn = document.getElementById('audioPlayBtn');
      if (vinylDisc) vinylDisc.classList.add('is-playing');
      if (vinylDeck) vinylDeck.classList.add('is-playing');
      if (audioPlayBtn) audioPlayBtn.innerHTML = '❚❚';
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
