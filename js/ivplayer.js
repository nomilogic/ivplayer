class Events {
  static PLAYER_READY = "playerReady";
  static PLAYLIST_LOADED = "playlistLoaded";
  static VIDEO_PLAYED = "videoPlayed";
  static QUALITY_CHANGED = "qualityChanged";
  static ADS_SETUP = "adsSetup";
  static POPUP_AD_SHOWN = "popupAdShown";
  static INBETWEEN_AD_SHOWN = "inBetweenAdShown";
  static VIDEO_ENDED = "videoEnded";
  static PLAYLIST_ENDED = "playlistEnded";
  static FULLSCREEN_TOGGLED = "fullscreenToggled";
  static MUTE_TOGGLED = "muteToggled";
  static VOLUME_CHANGED = "volumeChanged";
  static CAPTIONS_TOGGLED = "captionsToggled";
  static SEEKED = "seeked";
  static SPEED_CHANGED = "speedChanged";
  static ERROR = "errorOccurred";
  static SPOT_AD_CLICKED = "spotAdClicked";
  static SPOT_AD_IMPRESSION = "spotAdImpression";
}

class CustomVideoPlayer {
  constructor(playerId, videoSources, options = {}) {
    this.playerId = playerId;
    this.videoSources = videoSources;
    this.options = options;

    this.initPlayer();
    this.bindEvents();
  }

  initPlayer() {
    this.player = videojs(this.playerId, this.options);

    // Load the playlist
    this.loadPlaylist(this.videoSources);

    // Set up the player ready event
    this.player.ready(() => {
      console.log("Video player is ready.");
      this.triggerEvent(Events.PLAYER_READY);
    });

    // Handle end of video for in-between ads
    this.player.on("ended", () => {
      this.triggerEvent(Events.VIDEO_ENDED);
      this.playNextVideo();
    });
  }

  loadPlaylist(sources) {
    this.playlist = sources;
    this.currentVideoIndex = 0;
    this.player.src(this.playlist[this.currentVideoIndex]);

    this.triggerEvent(Events.PLAYLIST_LOADED);
  }

  playVideo(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentVideoIndex = index;
      this.player.src(this.playlist[this.currentVideoIndex]);
      this.player.play();
      this.triggerEvent(Events.VIDEO_PLAYED, index);
    }
  }

  playNextVideo() {
    const nextIndex = this.currentVideoIndex + 1;
    if (nextIndex < this.playlist.length) {
      this.playVideo(nextIndex);
    } else {
      this.triggerEvent(Events.PLAYLIST_ENDED);
    }
  }

  playPrevVideo() {
    const prevIndex = this.currentVideoIndex - 1;
    if (prevIndex >= 0) {
      this.playVideo(prevIndex);
    }
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  stop() {
    this.player.pause();
    this.player.currentTime(0);
  }

  rewind(seconds = 10) {
    this.player.currentTime(this.player.currentTime() - seconds);
    this.triggerEvent(Events.SEEKED, -seconds);
  }

  fastForward(seconds = 10) {
    this.player.currentTime(this.player.currentTime() + seconds);
    this.triggerEvent(Events.SEEKED, seconds);
  }

  setSpeed(rate) {
    this.player.playbackRate(rate);
    this.triggerEvent(Events.SPEED_CHANGED, rate);
  }

  setQuality(quality) {
    // Placeholder: Implement quality switching logic
    console.log(`Setting quality to: ${quality}`);
    this.triggerEvent(Events.QUALITY_CHANGED, quality);
  }

  toggleFullscreen() {
    if (this.player.isFullscreen()) {
      this.player.exitFullscreen();
    } else {
      this.player.requestFullscreen();
    }
    this.triggerEvent(Events.FULLSCREEN_TOGGLED, this.player.isFullscreen());
  }

  toggleMute() {
    const isMuted = this.player.muted(!this.player.muted());
    this.triggerEvent(Events.MUTE_TOGGLED, isMuted);
  }

  changeVolume(volume) {
    this.player.volume(volume);
    this.triggerEvent(Events.VOLUME_CHANGED, volume);
  }

  toggleCaptions() {
    const tracks = this.player.textTracks();
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = tracks[i].mode === "showing" ? "disabled" : "showing";
    }
    this.triggerEvent(Events.CAPTIONS_TOGGLED);
  }

  setupAds(adOptions) {
    this.adOptions = adOptions;

    // Implement ad setup logic here
    this.triggerEvent(Events.ADS_SETUP);
  }

  bindEvents() {
    this.player.on("timeupdate", () => {
      if (this.player.currentTime() > 120 && !this.adShown) {
        // Example: show ad after 2 minutes
        this.triggerEvent(Events.INBETWEEN_AD_SHOWN);
        this.adShown = true;
      }
    });

    this.player.on("error", (e) => {
      console.error("An error occurred:", e);
      this.triggerEvent(Events.ERROR, e);
    });

    // Spot ad click event handler
    document.addEventListener(Events.SPOT_AD_CLICKED, (e) => {
      this.triggerEvent(Events.SPOT_AD_CLICKED, e.detail);
    });

    // Spot ad impression event handler
    document.addEventListener(Events.SPOT_AD_IMPRESSION, (e) => {
      this.triggerEvent(Events.SPOT_AD_IMPRESSION, e.detail);
    });
  }

  on(event, callback) {
    this.player.on(event, callback);
  }

  triggerEvent(eventName, data = null) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

const player = new CustomVideoPlayer("videoPlayer", [
  "https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4",
  "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
]);

// Example of event handling
document.addEventListener(Events.PLAYLIST_LOADED, () =>
  console.log("Playlist loaded")
);

document.addEventListener(Events.VIDEO_PLAYED, () =>
  console.log("Video started playing")
);

// Binding controls for player actions
document
  .getElementById("playBtn")
  .addEventListener("click", () => player.play());
document
  .getElementById("pauseBtn")
  .addEventListener("click", () => player.pause());
document
  .getElementById("stopBtn")
  .addEventListener("click", () => player.stop());
document
  .getElementById("rewindBtn")
  .addEventListener("click", () => player.rewind(15));
document
  .getElementById("fwdBtn")
  .addEventListener("click", () => player.fastForward(15));
document
  .getElementById("prevBtn")
  .addEventListener("click", () => player.playPrevVideo());
document
  .getElementById("nextBtn")
  .addEventListener("click", () => player.playNextVideo());
document.getElementById("speedSlider").addEventListener("input", (e) => {
  const speed = e.target.value;
  player.setSpeed(speed);
  document.getElementById("speedValue").textContent = `${speed}x`;
});
