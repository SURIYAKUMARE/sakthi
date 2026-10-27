/**
 * ============================================================
 * UNIFIED SOUNDTRACK & AUDIO ENGINE
 * Direct, robust control for YouTube background soundtrack:
 * "Sidu Sidu" from Romeo (Kapil Kapilan) starting from 0:38 (38s)
 * Uses high-priority postMessage + YT IFrame API with automatic
 * browser gesture unlock.
 * ============================================================
 */

class BackgroundSoundtrackManager {
  constructor() {
    this.iframeId = 'yt-bg-iframe';
    this.startTime = 38; // 0:38 as requested by the user
    this.isPlaying = false;
    this.isMuted = false;
    this.listeners = [];
    this.ytPlayer = null;
    this.hasUnlocked = false;

    // Listen for YouTube state changes via postMessage
    this.initPostMessageListener();
    // Load YouTube API as secondary controller
    this.loadYouTubeAPI();
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
          if (data.info === 1) {
            this.setPlayingState(true);
          } else if (data.info === 2 || data.info === 0) {
            this.setPlayingState(false);
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
              // Audio only plays when entering the Envelope screen
            } catch (_) {}
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              this.setPlayingState(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              this.setPlayingState(false);
            }
          },
        },
      });
    } catch (_) {}
  }

  start() {
    // Send postMessage directly to iframe
    this.post('seekTo', [this.startTime, true]);
    this.post('unMute');
    this.post('setVolume', [100]);
    this.post('playVideo');

    // Also call YT player method if attached
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

    this.setPlayingState(true);
    return true;
  }

  pause() {
    this.post('pauseVideo');
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (_) {}
    }
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

  toggleMute() {
    this.isMuted = !this.isMuted;
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
    this.listeners.forEach((cb) => {
      try { cb(playing); } catch (_) {}
    });
  }

  onStateChange(cb) {
    this.listeners.push(cb);
  }

  playChime() {
    // No-op placeholder to preserve compatibility with bouquet sound trigger
  }
}

export const romanticAudio = new BackgroundSoundtrackManager();
