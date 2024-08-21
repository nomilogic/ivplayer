class SpotAd {
  constructor(player, options = {}) {
    this.player = player;
    this.options = options;
    this.ads = [];
    this.currentAd = null;

    this.initSpotAds();
  }

  initSpotAds() {
    this.options.ads.forEach((adConfig) => {
      const adElement = this.createAdElement(adConfig);
      adElement.style.display = "none";
      this.ads.push({ element: adElement, config: adConfig });
      this.player.container.appendChild(adElement);
    });

    // Listen for the player time update to display the ads at the correct time
    this.player.video.addEventListener("timeupdate", () => this.checkAds());
  }

  createAdElement(adConfig) {
    const adElement = document.createElement("div");
    adElement.className = "spot-ad";
    adElement.style.position = "absolute";
    adElement.style.width = adConfig.size.width;
    adElement.style.height = adConfig.size.height;
    adElement.style.top = adConfig.position.top;
    adElement.style.left = adConfig.position.left;
    adElement.style.background = "rgba(255, 255, 255, 0.5)";
    adElement.style.cursor = "pointer";
    adElement.style.transition = adConfig.animation.transition;

    adElement.addEventListener("click", () => {
      this.handleAdClick(adConfig);
    });

    return adElement;
  }

  checkAds() {
    const currentTime = this.player.video.currentTime;

    this.ads.forEach((ad) => {
      if (
        currentTime >= ad.config.startTime &&
        currentTime <= ad.config.endTime
      ) {
        this.showAd(ad);
      } else {
        this.hideAd(ad);
      }
    });
  }

  showAd(ad) {
    if (ad.element.style.display === "none") {
      ad.element.style.display = "block";
      this.animateAd(ad);

      // Track impression for analytics
      this.trackImpression(ad.config);
    }
  }

  hideAd(ad) {
    ad.element.style.display = "none";
    ad.element.style.transform = "none";
  }

  animateAd(ad) {
    const { startPosition, endPosition, duration } = ad.config.animation;
    ad.element.style.transform = `translate(${startPosition.x}, ${startPosition.y})`;
    setTimeout(() => {
      ad.element.style.transform = `translate(${endPosition.x}, ${endPosition.y})`;
      ad.element.style.transitionDuration = `${duration}s`;
    }, 100);
  }

  handleAdClick(adConfig) {
    // Track click for analytics
    this.trackClick(adConfig);

    // Trigger a popup ad if configured
    if (adConfig.popupAd) {
      const popupAd = new PopupAd(this.player, adConfig.popupAd.options);
      popupAd.show(
        adConfig.popupAd.content,
        adConfig.popupAd.alignment,
        adConfig.popupAd.size
      );
    }
  }

  trackImpression(adConfig) {
    this.triggerEvent(Events.SPOT_AD_IMPRESSION, {
      adId: adConfig.id,
      timestamp: Date.now(),
    });
  }

  trackClick(adConfig) {
    this.triggerEvent(Events.SPOT_AD_CLICK, {
      adId: adConfig.id,
      timestamp: Date.now(),
    });
  }

  triggerEvent(eventName, data = null) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

// Example Usage:
// const spotAd = new SpotAd(player, {
//   ads: [
//     {
//       id: "ad1",
//       size: { width: "100px", height: "100px" },
//       position: { top: "10%", left: "30%" },
//       startTime: 10,
//       endTime: 20,
//       animation: {
//         transition: "transform 1s ease-in-out",
//         startPosition: { x: "0", y: "0" },
//         endPosition: { x: "10px", y: "10px" },
//         duration: 1,
//       },
//       popupAd: {
//         content: "<img src='https://via.placeholder.com/300x200' alt='Ad Image'>",
//         alignment: { vertical: "middle", horizontal: "center" },
//         size: { width: "300px", height: "200px" },
//         options: { /* additional options for popup ad */ }
//       }
//     },
//     // Additional ad configurations...
//   ],
// });
