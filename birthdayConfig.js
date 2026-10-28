/**
 * ============================================================
 * BIRTHDAY CONFIGURATION — PERSONALIZATION CENTER
 * Edit this file to customize names, messages, dates, and photos!
 * ============================================================
 */

export const birthdayConfig = {
  // Recipient details
  recipient: {
    name: "Krithika",
    nickname: "Krithi",
    birthdayDate: "October 27",
    age: "", // optional, e.g. "21"
  },

  // Sender details
  sender: {
    name: "With all my love",
    signature: "Always & Forever ♥",
  },

  // Screen A: Envelope Introduction
  envelopeIntro: {
    eyebrow: "A special delivery for",
    title: "Happy Birthday, Krithika",
    subtitle: "You have received a sealed birthday letter",
    tapPrompt: "Tap the golden wax seal to open",
  },

  // Screen B: Cinematic Birthday Greeting
  cinematicGreeting: {
    eyebrow: "today belongs to you",
    headline: "Happy Birthday, Krithika",
    quote: "“Some people make the world brighter just by being in it. You are one of those rare and beautiful souls.”",
    subtext: "May this year bring as much joy, warmth, and laughter into your life as you bring into everyone else’s.",
    continueButton: "Explore Your Birthday Gifts ✨",
  },

  // DREAMY MOONLIGHT SCENE 🌙✨
  moonlightScene: {
    title: "Under the Starlit Moon",
    subtitle: "A quiet, magical moment beneath the cosmos",
    openingMessage: "Tonight, I have something special for you…",
    moonImage: "/images/moon.jpg",
    makeWishPrompt: "Make a Wish ✨",
    closeEyesPrompt: "Close your eyes, make a wish, and let the universe listen.",
    wishes: [
      "Under this beautiful moon, may your life always shine brighter than the stars.",
      "If I could make one wish tonight, I would wish for your happiness, your dreams, and a thousand beautiful reasons to smile.",
      "May every shooting star carry a little hope, every sunrise bring a new beginning, and every night remind you how special you are.",
      "Even beneath a sky filled with countless stars, some souls shine in a way that makes the whole universe feel beautiful.",
      "Tonight, the moon is beautiful, the stars are shining, and somewhere in this universe, someone is wishing you nothing but happiness. ✨"
    ],
    continueButton: "Continue the Surprise 🎁 →"
  },

  // Screen C: "These Are for You" Gift Selection
  giftSelection: {
    title: "These Are for You",
    subtitle: "Three little tokens crafted with love for your special day",
    gifts: [
      {
        id: "letter",
        title: "A Birthday Wish Letter",
        tag: "Heartfelt Wishes",
        description: "A warm handwritten wish letter penned just for you",
        badge: "Read Wish Letter 📜",
        icon: "letter",
      },
      {
        id: "bouquet",
        title: "A Realistic Flower Bouquet",
        tag: "Fresh Botanical Blooms",
        description: "Hand-picked roses, peonies & eucalyptus that bloom forever",
        badge: "View Bouquet 💐",
        icon: "bouquet",
      },
      {
        id: "cake",
        title: "Birthday Cake",
        tag: "Make a wish",
        description: "A delicious cake with candles ready to blow",
        badge: "Blow Candles 🎂",
        icon: "cake",
      },
    ],
  },

  // Screen D & F: Personal Handwritten Wish Letter
  letter: {
    date: "October 27",
    salutation: "Dearest Krithika,",
    paragraphs: [
      "Happy, happy birthday! On this truly special day, I send you my warmest, most heartfelt wishes for the incredible year ahead.",
      "May every single step you take this year be filled with genuine joy, boundless laughter, and quiet peace of mind. Your gentle kindness, bright spirit, and radiant smile have a magical way of making everything around you so much brighter.",
      "I wish you good health, exciting adventures, and the strength to turn every dream your heart holds into reality. May you always be surrounded by true friends, endless love, and countless reasons to smile.",
      "Thank you for being such a wonderful, uplifting person. Celebrate yourself today to the fullest—you deserve all the happiness and beauty life has to offer.",
    ],
    closing: "With my warmest wishes and heartiest hugs,",
    signature: "Always wishing you the best ♥",
    postscript: "P.S. Make sure you don't forget to blow out your candles and claim your birthday wish! ✨",
  },

  // Screen E: Flower Bouquet Scene
  bouquet: {
    title: "A Blooming Bouquet for Krithika",
    subtitle: "Fresh botanical roses, peonies & eucalyptus that bloom forever",
    tag: "Everlasting Floral Bloom",
    message:
      "Like delicate petals drinking in the morning sunlight, your warmth, grace, and radiant smile brighten every single day. Each blossom in this bouquet carries a special birthday blessing crafted just for you.",
    tip: "Tap on any flower to reveal its hidden wish blessing, or tap the bouquet to shower fresh petals! 🌸",
    blessings: [
      { id: "rose", icon: "🌹", flower: "Crimson Velvet Rose", wish: "May your heart always be filled with deep warmth, serene peace, and boundless joy." },
      { id: "peony", icon: "🌸", flower: "Blush Garden Peony", wish: "May your days blossom with unforgettable memories, genuine laughter, and vibrant energy." },
      { id: "champagne", icon: "🌼", flower: "Champagne Sunrise Rose", wish: "May every morning greet you with fresh inspiration, gentle hope, and quiet confidence." },
      { id: "lily", icon: "🌺", flower: "Stargazer Lily", wish: "May all your secret ambitions and cherished dreams reach the stars this year." },
      { id: "eucalyptus", icon: "🍃", flower: "Silver Dollar Eucalyptus", wish: "May your life journey be blessed with steady resilience, calm clarity, and enduring strength." },
    ],
  },

  // Screen E: Birthday Cake Scene
  cake: {
    title: "Make a Birthday Wish",
    subtitle: "Close your eyes, think of your sweetest dream, and blow!",
    flavor: "Artisanal Strawberry & Vanilla Buttercream Cake",
    candlesCount: 5,
    promptBefore: "Tap the cake or button below to blow out your candles! 🎂",
    promptBlowing: "💨 Making your wish...",
    wishMessagePhase1: "Your wish is now on its way to the universe. ✨",
    wishMessagePhase2: "May all your beautiful dreams come true. Happy Birthday! ❤️",
  },

  // Screen G: Photo Collage & Scrapbook Memories
  scrapbook: {
    title: "Moments & Memories",
    subtitle: "One Name ♥ Many Languages ♥ Same Soul",
    instruction: "Tap photo to view full screen",
    featured: {
      id: "featured-krithika-art",
      title: "Krithika — One Name ♥ Many Languages ♥ Same Soul",
      date: "Different scripts ♥ Same name ♥ Krithika",
      caption:
        "Across every language in the world — Tamil, Telugu, Hindi, Malayalam, Kannada, Bengali, Odia, Gujarati, Assamese, Punjabi, Persian, Marathi, Arabic, Russian, Japanese, Korean, Chinese, Thai, Hebrew, Greek, Turkish, Vietnamese, Armenian — no matter the script or whisper, your name always reflects the same radiant and beautiful soul.",
      tag: "Special Masterpiece",
      src: "/images/krithika_languages.jpg",
      quote: "“Different scripts ♥ Same name ♥ Krithika”",
      isFeatured: true,
    },
    photos: [
      {
        id: 0,
        title: "Krithika — 23 World Scripts",
        date: "Dedicated Artwork Tribute",
        caption: "A magnificent pencil sketch capturing her eyes and bindi, encircled by 'Krithika' in 23 languages across the globe.",
        rotation: 0,
        gradient: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
        accent: "#e11d48",
        tag: "Art Masterpiece",
        src: "/images/krithika_languages.jpg",
        isFeatured: true,
      },
    ],
  },

  // Screen H: Final Vinyl Record & Music Screen
  vinylScene: {
    title: "Our Special Birthday Soundtrack",
    trackTitle: "இனிய பிறந்தநாள் கீர்த்தி — Sakthi Narayanan",
    artist: "A Heartfelt Song Dedicated to Keerthi ♥",
    audioSrc: "/audio/keerthi_birthday_song.mp3",
    currentTrackId: "keerthi_song",
    tracks: [
      {
        id: "keerthi_song",
        title: "இனிய பிறந்தநாள் கீர்த்தி",
        artist: "Sakthi Narayanan",
        badge: "Special Dedicated Song ♥",
        type: "audio",
        src: "/audio/keerthi_birthday_song.mp3",
        label: "இனிய பிறந்தநாள் கீர்த்தி",
        sublabel: "Sakthi Narayanan ♥",
      },
      {
        id: "sidu_sidu",
        title: "Sidu Sidu (Romeo)",
        artist: "Kapil Kapilan",
        badge: "Background Melody",
        type: "youtube",
        videoId: "Dyt1jelmjY0",
        startTime: 38,
        label: "SIDU SIDU",
        sublabel: "Romeo (0:38)",
      },
    ],
    lyrics: {
      title: "பாடல் வரிகள் (Lyrics)",
      author: "வரிகள் & குரல்: Sakthi Narayanan",
      sections: [
        {
          label: "அறிமுகம் (Intro)",
          lines: [
            "இறைவன் தந்த அழகான வரம்,",
            "என் வாழ்வில் நீ வந்த தருணம்,",
            "வார்த்தைகள் தோற்கும் உன் அழகில்,",
            "கவிதையாய் மாறினேன் உன் நினைவில்.",
          ],
        },
        {
          label: "சரணம் 1 (Verse 1)",
          lines: [
            "கீர்த்தி... உன் பெயர் சொன்னாலே,",
            "என் மனம் அமைதியில் பூக்குதே.",
            "உலகத்தில் யார் இருந்தாலும்,",
            "என் மனம் உன்னையே தேடுதே.",
            "உன் சிரிப்பில் என் சந்தோஷம்,",
            "உன் பேச்சில் என் நிம்மதி,",
            "எத்தனை உறவுகள் இருந்தாலும்,",
            "நீயே என் மனதின் முதல் விருப்பம்.",
          ],
        },
        {
          label: "பல்லவி (Chorus)",
          lines: [
            "இனிய பிறந்தநாள் கீர்த்தி,",
            "என் இதயத்தின் இனிய கீர்த்தி!",
            "உன் கனவுகள் யாவும் நனவாக,",
            "இறைவன் துணையாய் வரம் தருவானாக.",
            "நீ நடக்கும் பாதையெல்லாம்,",
            "பூக்கள் பூத்திட வேண்டுமே.",
            "உன் கண்ணில் கண்ணீர் வந்தால்,",
            "அதைத் துடைக்க நான் வேண்டுமே.",
          ],
        },
        {
          label: "சரணம் 2 (Verse 2)",
          lines: [
            "உன் கவலை சொல்லும் நேரத்தில்,",
            "உன் தோளாய் நான் இருப்பேன்.",
            "உலகமே எதிர்த்துப் போனாலும்,",
            "உன் பக்கம் நான் நிற்பேன்.",
            "வெற்றியிலும் உன் கூட இருப்பேன்,",
            "தோல்வியிலும் கை கொடுப்பேன்,",
            "எத்தனை காலம் கடந்தாலும்,",
            "உனக்கான துணையாய் இருப்பேன்.",
            "நீ சாய்ந்து கொள்ளும் இடமாய்,",
            "என் இதயம் என்றும் இருக்கட்டும்,",
            "உன் மனம் தேடும் நிம்மதியாய்,",
            "நம் பந்தம் என்றும் நிலைக்கட்டும்.",
          ],
        },
        {
          label: "முடிவுரை (Bridge & Outro)",
          lines: [
            "உன்னை எனக்குப் பிடித்த அளவை,",
            "வார்த்தைகளால் சொல்ல முடியாது.",
            "உன்னைப் போன்ற ஒரு உறவை,",
            "காலங்கள் கூட மாற்ற முடியாது.",
            "நீ கேட்கும் முன்னே உன் தேவைகள்,",
            "நிறைவேற இறைவனை வேண்டினேன்! ♥",
          ],
        },
      ],
    },
    closingMessage:
      "As this day unfolds, may this beautiful melody accompany you into a brand new year of happiness, beauty, and wonder. Happy Birthday once again, Krithika!",
    vinylQuote: "“Where words fail, music speaks. Where music plays, love stays.”",
    playPrompt: "Tap the vinyl to spin & play the dedicated song ♫",
  },
};
