document.addEventListener('DOMContentLoaded', () => {
  // Initialize CustomVideoPlayer

  const player= new CustomVideoPlayer("videoPlayer", [
    "https://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  ]);
  const videoPlayer=player;
  
  // Example of event handling
  videoPlayer.addEventListener(Events.PLAYLIST_LOADED, () =>
    console.log("Playlist loaded")
  );
  
  videoPlayer.addEventListener(Events.VIDEO_PLAYED, () =>
    console.log("Video started playing")
  );
  videoPlayer.addEventListener(Events.PLAYER_READY, ()=>{
    console.log("player Ready");
  })
  console.log(videoPlayer,"video")

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
  
  // Initialize PopupAd
  const popupAd = new PopupAd(videoPlayer, {
    alignment: { vertical: "middle", horizontal: "center" },
    size: { width: "300px", height: "200px" }
  });

  // Initialize SpotAd
  const container=document.getElementsByClassName('spot-container')[0];
   tweenEngine = new TweenEngine();

  const spotAd = new SpotAd(player, container, {
    ads: [
      {
        id: "ad1",
        size: { width: "100px", height: "100px" },
        position: { top: "10%", left: "30%" },
        startTime: 10,
        endTime: 20,
        animationSequence: [
          {
            endPosition: { x: 100, y: 0 },
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 1000,
          },
          {
            endPosition: { x: 100, y: 100 },
            scale: 1.5,
            rotate: 45,
            opacity: 0.8,
            duration: 1000,
          },
          {
            endPosition: { x: 0, y: 100 },
            scale: 2,
            rotate: 90,
            opacity: 0.5,
            duration: 1000,
          },
        ],
        popupAd: {
          content: "<img src='https://via.placeholder.com/300x200' alt='Ad Image'>",
          alignment: { vertical: "middle", horizontal: "center" },
          size: { width: "300px", height: "200px" },
          options: { /* additional options for popup ad */ }
        }
      },
      // Additional ad configurations...
    ],
  });
  
  
  

 /*  videoPlayer.addEventListener(Events.ON_TIME_UPDATE, (e) => {
    console.log(e);
    spotAd.checkAds();
    console.log('Time update event for Spot Ads');
  }); */
  // Initialize BannerAd
  const bannerAd = new BannerAd('bannerComponent', 5000); // 5000ms = 5 seconds


  // Popup Ad Button
  document.getElementById('popupAdButton').addEventListener('click', () => {
    popupAd.show(
      "<img src='https://via.placeholder.com/300x200' alt='Ad Image'>",
      { vertical: "middle", horizontal: "center" },
      { width: "300px", height: "200px" }
    );
    console.log('Popup ad button clicked');
  });

  // Handle Popup Ad Close Button
  document.getElementById('closePopupAd').addEventListener('click', () => {
    popupAd.hide();
    console.log('Popup ad closed');
  });

  // Event Listeners for Ad Events
  document.addEventListener(Events.POPUP_AD_SHOWN, (event) => {
    console.log('Popup Ad Shown:', event.detail);
  });

  document.addEventListener(Events.POPUP_AD_IMPRESSION, (event) => {
    console.log('Popup Ad Impression:', event.detail);
  });

  document.addEventListener(Events.SPOT_AD_IMPRESSION, (event) => {
    console.log('Spot Ad Impression:', event.detail);
  });

  document.addEventListener(Events.SPOT_AD_CLICK, (event) => {
    console.log('Spot Ad Click:', event.detail);
  });

  document.addEventListener(Events.BANNER_AD_IMPRESSION, (event) => {
    console.log('Banner Ad Impression:', event.detail);
  });

  document.addEventListener(Events.BANNER_AD_CLICK, (event) => {
    console.log('Banner Ad Click:', event.detail);
  });

  // Ensure Spot Ads and Popup Ads are visible or hidden based on player events
  

  videoPlayer.on('play', () => {
    popupAd.trackImpression();
    console.log('Video playing');
  });

  videoPlayer.on('pause', () => {
    console.log('Video paused');
  });

  videoPlayer.on('ended', () => {
    console.log('Video ended');
  });
});
