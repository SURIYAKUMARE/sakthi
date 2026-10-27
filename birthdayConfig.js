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
    flavor: "Sweet Strawberry & Rose Cream Cake",
    candlesCount: 3,
    promptBefore: "Tap the cake or button below to blow out your candles! 🎂",
    promptAfter: "🎉 May all your sweetest wishes come true, Krithika! ✨",
    wishNote: "“May your year ahead be as sweet, delightful, and full of joy as this celebration!”",
  },

  // Screen G: Photo Collage & Scrapbook Memories
  scrapbook: {
    title: "Moments & Memories",
    subtitle: "Little snapshots of joy, smiles, and unforgettable times",
    instruction: "Tap any photo to enlarge and read its memory",
    photos: [
      {
        id: 1,
        title: "Sunsets & Golden Glows",
        date: "Golden Hour Memories",
        caption: "Nothing compares to the quiet beauty of sunsets and heartfelt laughter with you.",
        rotation: -4,
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
        accent: "#f43f5e",
        tag: "Pure Joy",
        src: "", // leave empty to use SVG illustrated placeholder, or put path e.g. "/images/photo1.jpg"
      },
      {
        id: 2,
        title: "Coffee & Cozy Smiles",
        date: "Sweet Everyday Moments",
        caption: "The happiest days are often the simplest ones—good coffee, cozy talks, and your bright smile.",
        rotation: 3,
        gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        accent: "#f59e0b",
        tag: "Precious",
        src: "",
      },
      {
        id: 3,
        title: "Underneath the Stars",
        date: "Midnight Wishes",
        caption: "Looking up at a sky full of stars, and realizing you shine brighter than all of them.",
        rotation: -2,
        gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        accent: "#8b5cf6",
        tag: "Magic",
        src: "",
      },
      {
        id: 4,
        title: "Blooming & Thriving",
        date: "A Year of Growth",
        caption: "Celebrating how much you have grown, the challenges you conquered, and the grace you carried.",
        rotation: 4,
        gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        accent: "#10b981",
        tag: "Inspiration",
        src: "",
      },
    ],
  },

  // Screen H: Final Vinyl Record & Music Screen
  vinylScene: {
    title: "Our Soundtrack",
    trackTitle: "Sidu Sidu (Romeo) — Kapil Kapilan",
    artist: "For Krithika with Love",
    youtube: {
      videoId: "Dyt1jelmjY0",
      startTime: 38, // starts at 0:38
      autoplay: true,
    },
    closingMessage:
      "As this day unfolds, may this beautiful melody accompany you into a brand new year of happiness, beauty, and wonder. Happy Birthday once again, Krithika!",
    vinylQuote: "“Where words fail, music speaks. Where music plays, love stays.”",
    playPrompt: "Tap to spin the record & play Sidu Sidu ♫",
  },
};
