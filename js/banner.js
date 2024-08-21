class BannerComponent {
  constructor(elementId) {
    this.bannerElement = document.getElementById(elementId);
    this.bannerImages = this.bannerElement.querySelectorAll(".banner-image");
    this.currentIndex = 0;
    this.bannerInterval = null;

    this.initBanner();
  }

  initBanner() {
    this.showBanner(this.currentIndex);
    this.bannerInterval = setInterval(() => this.nextBanner(), 5000); // Change banner every 5 seconds
    this.createNavigationControls();
    this.createIndicators();
  }

  createNavigationControls() {
    this.prevButton = document.createElement("button");
    this.prevButton.textContent = "Previous";
    this.prevButton.className = "banner-control";
    this.prevButton.addEventListener("click", () => this.prevBanner());

    this.nextButton = document.createElement("button");
    this.nextButton.textContent = "Next";
    this.nextButton.className = "banner-control";
    this.nextButton.addEventListener("click", () => this.nextBanner());

    this.bannerElement.appendChild(this.prevButton);
    this.bannerElement.appendChild(this.nextButton);
  }

  createIndicators() {
    this.indicatorsContainer = document.createElement("div");
    this.indicatorsContainer.className = "banner-indicators";

    this.bannerImages.forEach((_, i) => {
      const indicator = document.createElement("span");
      indicator.className = "indicator";
      indicator.addEventListener("click", () => this.showBanner(i));
      this.indicatorsContainer.appendChild(indicator);
    });

    this.bannerElement.appendChild(this.indicatorsContainer);
    this.updateIndicators();
  }

  showBanner(index) {
    this.bannerImages.forEach((img, i) => {
      img.classList.toggle("active", i === index);
      if (i === index) {
        this.trackClick(i);
      }
    });
    this.currentIndex = index;
    this.updateIndicators();
  }

  nextBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.bannerImages.length;
    this.showBanner(this.currentIndex);
  }

  prevBanner() {
    this.currentIndex =
      (this.currentIndex - 1 + this.bannerImages.length) %
      this.bannerImages.length;
    this.showBanner(this.currentIndex);
  }

  updateIndicators() {
    const indicators = this.indicatorsContainer.querySelectorAll(".indicator");
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === this.currentIndex);
    });
  }

  trackImpressions() {
    this.bannerImages.forEach((img, index) => {
      if (img.classList.contains("active")) {
        console.log(`Impression recorded for banner ${index}`);
        // Send impression analytics data here
      }
    });
  }

  trackClick(index) {
    console.log(`Click recorded for banner ${index}`);
    // Send click analytics data here
  }
}

// Usage example
