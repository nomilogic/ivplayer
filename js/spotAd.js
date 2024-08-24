class TweenEngine {
  constructor() {
    this.tweens = [];
    this.isRunning = false;
  }

  addTween(tween) {
    this.tweens.push(tween);
    if (!this.isRunning) {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.update(performance.now());
  }

  update(timestamp) {
    this.tweens = this.tweens.filter((tween) => !tween.isComplete());

    this.tweens.forEach((tween) => tween.update(timestamp));

    if (this.tweens.length > 0) {
      requestAnimationFrame(this.update.bind(this));
    } else {
      this.isRunning = false;
    }
  }

  clear() {
    this.tweens = [];
  }
}


// Example Usage of the Tween Engine

class Tween {
  constructor(startValues, duration = 0, easing = TweenEngine.linear) {
    this.startValues = startValues;
    this.steps = [];
    this.duration = duration;
    this.easing = easing;
    this.currentStep = 0;
    this.startTime = null;
    this.active = false;
    this.completed = false;
    this.currentValues = { ...startValues };
    this.onUpdateCallback = null;
    this.onCompleteCallback = null;
  }

  to(endValues, duration, easing = this.easing) {
    this.steps.push({ endValues, duration, easing });
    return this;
  }

  start(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    this.active = true;
  }

  update(timestamp) {
    if (!this.active || this.completed) return;

    if (!this.startTime) {
      this.start(timestamp);
    }

    const elapsed = timestamp - this.startTime;
    let currentStep = this.steps[this.currentStep];
    const stepProgress = Math.min(elapsed / currentStep.duration, 1);
    const easedProgress = currentStep.easing(stepProgress);

    for (const key in this.startValues) {
      this.currentValues[key] =
        this.startValues[key] +
        (currentStep.endValues[key] - this.startValues[key]) * easedProgress;
    }

    if (this.onUpdateCallback) {
      this.onUpdateCallback(this.currentValues);
    }

    if (stepProgress >= 1) {
      this.currentStep += 1;
      this.startTime = timestamp;

      if (this.currentStep < this.steps.length) {
        this.startValues = { ...this.currentValues };
      } else {
        this.completed = true;
        if (this.onCompleteCallback) {
          this.onCompleteCallback();
        }
      }
    }
  }

  isComplete() {
    return this.completed;
  }

  onUpdate(callback) {
    this.onUpdateCallback = callback;
    return this;
  }

  onComplete(callback) {
    this.onCompleteCallback = callback;
    return this;
  }

  static linear(t) {
    return t;
  }

  static easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

class SpotAd {
  constructor(player, container, options = {}) {
    this.player = player;
    this.options = options;
    this.ads = [];
    this.currentAd = null;
    this.container = container;

    this.initSpotAds();
  }

  initSpotAds() {
    this.options.ads.forEach((adConfig) => {
      const adElement = this.createAdElement(adConfig);
      adElement.style.display = "none";
      this.ads.push({ element: adElement, config: adConfig });
      this.container.appendChild(adElement);
    });

    this.player.addEventListener(Events.ON_TIME_UPDATE, (e) => this.checkAds(e));
  }

  createAdElement(adConfig) {
    console.log(adConfig)
    const adElement = document.createElement("div");
    adElement.className = "spot-ad";
    adElement.style.position = "absolute";
    adElement.style.background = "rgba(0, 255, 255, 1)";
    adElement.style.cursor = "pointer";
    adElement.style.width = adConfig.size.width;
    adElement.style.height = adConfig.size.height;
    adElement.style.transition = "none"; // Disable CSS transitions

    adElement.addEventListener("click", () => {
      this.handleAdClick(adConfig);
    });

    return adElement;
  }

  checkAds(e) {
    const currentTime = this.player.player.currentTime();
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
      this.trackImpression(ad.config);
    }
  }

  hideAd(ad) {
    ad.element.style.display = "none";
    ad.element.style.transform = "none";
  }

  animateAd(ad) {
    const { animationSequence } = ad.config;

    // Initialize Tween with the first animation in the sequence
    let tween = new Tween({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 });

    // Chain animations using the .to() method
    animationSequence.forEach((animation) => {
      tween = tween.to(
        {
          x: animation.endPosition.x,
          y: animation.endPosition.y,
          scale: animation.scale,
          rotate: animation.rotate,
          opacity: animation.opacity,
        },
        animation.duration
      ).onUpdate((currentValues) => {
          console.log(currentValues) 
        ad.element.style.transform = `translate(${currentValues.x}px, ${currentValues.y}px) scale(${currentValues.scale}) rotate(${currentValues.rotate}deg)`;
        ad.element.style.opacity = currentValues.opacity;
      });
    });

    // Start the tween animation
    tweenEngine.addTween(tween);
  }

  handleAdClick(adConfig) {
    this.trackClick(adConfig);
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


// Example Usage


// Example Usage


