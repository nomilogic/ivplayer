class BannerAd {
  constructor(elementId) {
    this.bannerElement = document.getElementById(elementId);
    this.bannerImages = this.bannerElement.querySelectorAll(".banner-image");
    this.currentIndex = 0;

    this.initBanner();
  }

  initBanner() {
    if (this.bannerImages.length === 0) return;

    this.showBanner(this.currentIndex);
    this.bannerInterval = setInterval(() => this.nextBanner(), 5000); // Change banner every 5 seconds
    this.createIndicators();
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
    });
    this.currentIndex = index;
    this.updateIndicators();
  }

  nextBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.bannerImages.length;
    this.showBanner(this.currentIndex);
  }

  updateIndicators() {
    if (!this.indicatorsContainer) return;

    const indicators = this.indicatorsContainer.querySelectorAll(".indicator");
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === this.currentIndex);
    });
  }
}

// Initialize BannerAd on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new BannerAd('bannerComponent');
});
