document.addEventListener("DOMContentLoaded", () => {
  const playlist = [
    "https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  ];

  const customPlayer = new CustomVideoPlayer("videoPlayer", playlist);
  console.log(customPlayer, "cs");
  // Control bindings
  document
    .getElementById("playBtn")
    .addEventListener("click", () => customPlayer.play());
  document
    .getElementById("pauseBtn")
    .addEventListener("click", () => customPlayer.pause());
  document
    .getElementById("stopBtn")
    .addEventListener("click", () => customPlayer.stop());
  document
    .getElementById("rewindBtn")
    .addEventListener("click", () => customPlayer.rewind(15));
  document
    .getElementById("fwdBtn")
    .addEventListener("click", () => customPlayer.fastForward(15));
  document
    .getElementById("prevBtn")
    .addEventListener("click", () => customPlayer.playPrevVideo());
  document
    .getElementById("nextBtn")
    .addEventListener("click", () => customPlayer.playNextVideo());

  document.getElementById("speedSlider").addEventListener("input", (e) => {
    const speed = e.target.value;
    customPlayer.setSpeed(speed);
    document.getElementById("speedValue").textContent = `${speed}x`;
  });

  // Popup ad button binding
  document.getElementById("popupAdButton").addEventListener("click", () => {
    customPlayer.showPopupAd("<p>Your Ad Content Here</p>");
  });

  // Event listeners for all player events
  document.addEventListener(Events.PLAYER_READY, () =>
    console.log("Player is ready")
  );
  document.addEventListener(Events.PLAYLIST_LOADED, () =>
    console.log("Playlist loaded")
  );
  document.addEventListener(Events.VIDEO_PLAYED, () =>
    console.log("Video started playing")
  );
  document.addEventListener(Events.QUALITY_CHANGED, (e) =>
    console.log(`Quality changed to: ${e.detail}`)
  );
  document.addEventListener(Events.ADS_SETUP, () =>
    console.log("Ads setup complete")
  );
  document.addEventListener(Events.POPUP_AD_SHOWN, () =>
    console.log("Popup ad shown")
  );
  document.addEventListener(Events.INBETWEEN_AD_SHOWN, () =>
    console.log("In-between ad shown")
  );
  document.addEventListener(Events.VIDEO_ENDED, () =>
    console.log("Video ended")
  );
  document.addEventListener(Events.PLAYLIST_ENDED, () =>
    console.log("Playlist ended")
  );
  document.addEventListener(Events.FULLSCREEN_TOGGLED, (e) =>
    console.log(`Fullscreen toggled: ${e.detail}`)
  );
  document.addEventListener(Events.MUTE_TOGGLED, (e) =>
    console.log(`Mute toggled: ${e.detail}`)
  );
  document.addEventListener(Events.VOLUME_CHANGED, (e) =>
    console.log(`Volume changed to: ${e.detail}`)
  );
  document.addEventListener(Events.CAPTIONS_TOGGLED, () =>
    console.log("Captions toggled")
  );
  document.addEventListener(Events.SEEKED, (e) =>
    console.log(`Seeked by: ${e.detail} seconds`)
  );
  document.addEventListener(Events.SPEED_CHANGED, (e) =>
    console.log(`Speed changed to: ${e.detail}x`)
  );
  document.addEventListener(Events.ERROR, (e) =>
    console.log(`An error occurred: ${e.detail}`)
  );
});
