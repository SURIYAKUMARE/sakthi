/**
 * ============================================================
 * UNIFIED SOUNDTRACK & AUDIO ENGINE
 * Seamless multi-track audio manager supporting:
 * 1. Dedicated Custom Song: "இனிய பிறந்தநாள் கீர்த்தி" (Sakthi Narayanan)
 *    played via high-fidelity local HTML5 Audio (/audio/keerthi_birthday_song.mp3)
 * 2. Background Melody: "Sidu Sidu" from Romeo (Kapil Kapilan)
 *    played via YouTube iframe postMessage + API
 * ============================================================
 */

class BackgroundSoundtrackManager {
  constructor() {
    this.iframeId = 'yt-bg-iframe';
    this.startTime = 38; // 0:38 for Sidu Sidu
    this.isPlaying = false;
    this.isMuted = false;
    this.activeTrack = 'sidu_sidu'; // default background soundtrack
    this.stateListeners = [];
    this.timeListeners = [];
    this.trackListeners = [];
    this.ytPlayer = null;
    this.hasUnlocked = false;

    // Local HTML5 audio for Sakthi's dedicated song
    this.localAudio = new Audio('/audio/keerthi_birthday_song.mp3');
    this.localAudio.preload = 'auto';

    this.initLocalAudioListeners();
    this.initPostMessageListener();
    this.loadYouTubeAPI();
  }

  initLocalAudioListeners() {
    if (!this.localAudio) return;

    this.localAudio.addEventListener('play', () => {
      if (this.activeTrack === 'keerthi_song') {
        this.setPlayingState(true);
      }
    });

    this.localAudio.addEventListener('pause', () => {
      if (this.activeTrack === 'keerthi_song') {
        this.setPlayingState(false);
      }
    });

    this.localAudio.addEventListener('ended', () => {
      if (this.activeTrack === 'keerthi_song') {
        this.setPlayingState(false);
      }
    });

    this.localAudio.addEventListener('timeupdate', () => {
      if (this.activeTrack === 'keerthi_song') {
        const cur = this.localAudio.currentTime || 0;
        const dur = this.localAudio.duration || 0;
        const percent = dur > 0 ? (cur / dur) * 100 : 0;
        this.timeListeners.forEach((cb) => {
          try { cb({ currentTime: cur, duration: dur, percent: percent }); } catch (_) {}
        });
      }
    });
  }

  post(func, args = []) {
    const iframe = document.getElementById(this.iframeId);
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      } catch (err) {
        console.warn('postMessage error:', err);
      }
    }
  }

  initPostMessageListener() {
    window.addEventListener('message', (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'onStateChange') {
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
          if (this.activeTrack === 'sidu_sidu') {
            if (data.info === 1) {
              this.setPlayingState(true);
            } else if (data.info === 2 || data.info === 0) {
              this.setPlayingState(false);
            }
          }
        }
      } catch (_) {}
    });
  }

  loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      this.attachYTPlayer();
      return;
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      this.attachYTPlayer();
    };

    if (!document.getElementById('yt-iframe-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }

  attachYTPlayer() {
    const iframe = document.getElementById(this.iframeId);
    if (!iframe) {
      setTimeout(() => this.attachYTPlayer(), 300);
      return;
    }

    try {
      this.ytPlayer = new window.YT.Player(this.iframeId, {
        events: {
          onReady: (event) => {
            try {
              event.target.seekTo(this.startTime, true);
              event.target.unMute();
              event.target.setVolume(100);
            } catch (_) {}
          },
          onStateChange: (event) => {
            if (this.activeTrack === 'sidu_sidu') {
              if (event.data === window.YT.PlayerState.PLAYING) {
                this.setPlayingState(true);
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                this.setPlayingState(false);
              }
            }
          },
        },
      });
    } catch (_) {}
  }

  selectTrack(trackId, autoPlay = true) {
    if (this.activeTrack === trackId && this.isPlaying) return;

    this.pause();
    this.activeTrack = trackId;

    this.trackListeners.forEach((cb) => {
      try { cb(trackId); } catch (_) {}
    });

    if (autoPlay) {
      setTimeout(() => this.start(), 150);
    }
  }

  start() {
    if (this.activeTrack === 'keerthi_song') {
      this.pauseYouTube();
      this.localAudio.muted = this.isMuted;
      const playPromise = this.localAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.setPlayingState(true);
          })
          .catch((err) => {
            console.warn('Local audio play error:', err);
          });
      }
      return true;
    } else {
      // Sidu Sidu (YouTube)
      if (this.localAudio) this.localAudio.pause();
      this.playYouTube();
      this.setPlayingState(true);
      return true;
    }
  }

  playYouTube() {
    this.post('seekTo', [this.startTime, true]);
    this.post('unMute');
    this.post('setVolume', [100]);
    this.post('playVideo');

    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        const cur = this.ytPlayer.getCurrentTime ? this.ytPlayer.getCurrentTime() : 0;
        if (cur < this.startTime) {
          this.ytPlayer.seekTo(this.startTime, true);
        }
        this.ytPlayer.unMute();
        this.ytPlayer.playVideo();
      } catch (_) {}
    }
  }

  pauseYouTube() {
    this.post('pauseVideo');
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (_) {}
    }
  }

  pause() {
    if (this.localAudio) {
      this.localAudio.pause();
    }
    this.pauseYouTube();
    this.setPlayingState(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  seek(seconds) {
    if (this.activeTrack === 'keerthi_song') {
      if (this.localAudio) {
        this.localAudio.currentTime = seconds;
      }
    } else {
      this.post('seekTo', [seconds, true]);
      if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        try { this.ytPlayer.seekTo(seconds, true); } catch (_) {}
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.localAudio) {
      this.localAudio.muted = this.isMuted;
    }

    if (this.isMuted) {
      this.post('mute');
      if (this.ytPlayer && typeof this.ytPlayer.mute === 'function') {
        try { this.ytPlayer.mute(); } catch (_) {}
      }
    } else {
      this.post('unMute');
      if (this.ytPlayer && typeof this.ytPlayer.unMute === 'function') {
        try { this.ytPlayer.unMute(); } catch (_) {}
      }
    }
    return this.isMuted;
  }

  setPlayingState(playing) {
    this.isPlaying = playing;
    this.stateListeners.forEach((cb) => {
      try { cb(playing); } catch (_) {}
    });
  }

  onStateChange(cb) {
    this.stateListeners.push(cb);
  }

  onTimeUpdate(cb) {
    this.timeListeners.push(cb);
  }

  onTrackChange(cb) {
    this.trackListeners.push(cb);
  }

  playChime() {
    // No-op placeholder
  }
}

export const romanticAudio = new BackgroundSoundtrackManager();
