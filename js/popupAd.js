class PopupAd {
  constructor(player, options = {}) {
    this.player = player;
    this.options = options;
    this.adElement = null;
    this.isVisible = false;

    this.initPopAd();
  }

  initPopAd() {
    // Create the ad element
    this.adElement = document.createElement("div");
    this.adElement.className = "popup-ad";
    this.adElement.style.position = "absolute";
    this.adElement.style.display = "none";
    this.adElement.style.zIndex = "1000";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.className = "close-ad";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.zIndex = "1001";
    closeButton.addEventListener("click", () => this.hide());

    this.adElement.appendChild(closeButton);

    // Add to the player container
    const videoContainer = document.getElementById(this.player.playerId);
    videoContainer.appendChild(this.adElement);

    // Apply alignment and size
    this.setAlignment(
      this.options.alignment || { vertical: "middle", horizontal: "center" }
    );
    this.setSize(this.options.size || { width: "50%", height: "50%" });

    // Track impressions for analytics
    this.trackImpression();
  }

  setSize(size) {
    if (typeof size.width === "string") {
      this.adElement.style.width = size.width;
    } else {
      this.adElement.style.width = `${size.width}px`;
    }

    if (typeof size.height === "string") {
      this.adElement.style.height = size.height;
    } else {
      this.adElement.style.height = `${size.height}px`;
    }
  }

  setAlignment(alignment) {
    const { vertical, horizontal } = alignment;

    switch (vertical) {
      case "top":
        this.adElement.style.top = "0";
        this.adElement.style.bottom = "auto";
        break;
      case "middle":
        this.adElement.style.top = "50%";
        this.adElement.style.bottom = "auto";
        this.adElement.style.transform = "translateY(-50%)";
        break;
      case "bottom":
        this.adElement.style.top = "auto";
        this.adElement.style.bottom = "0";
        break;
    }

    switch (horizontal) {
      case "left":
        this.adElement.style.left = "0";
        this.adElement.style.right = "auto";
        break;
      case "center":
        this.adElement.style.left = "50%";
        this.adElement.style.right = "auto";
        this.adElement.style.transform += " translateX(-50%)";
        break;
      case "right":
        this.adElement.style.left = "auto";
        this.adElement.style.right = "0";
        break;
    }
  }

  setContent(content) {
    if (typeof content === "string") {
      this.adElement.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.adElement.innerHTML = "";
      this.adElement.appendChild(content);
    }
  }

  show(content, alignment, size) {
    if (content) this.setContent(content);
    if (alignment) this.setAlignment(alignment);
    if (size) this.setSize(size);

    this.adElement.style.display = "flex";
    this.isVisible = true;

    // Track impressions for analytics
    this.trackImpression();

    // Trigger event
    this.triggerEvent(Events.POPUP_AD_SHOWN);
  }

  hide() {
    this.adElement.style.display = "none";
    this.isVisible = false;
  }

  trackImpression() {
    if (!this.isVisible) {
      this.triggerEvent(Events.POPUP_AD_IMPRESSION, { timestamp: Date.now() });
    }
  }

  triggerEvent(eventName, data = null) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

// Usage Example:
// const popupAd = new PopupAd(player, {
//   alignment: { vertical: "middle", horizontal: "center" },
//   size: { width: "300px", height: "200px" }
// });
// popupAd.show("<img src='https://via.placeholder.com/300x200' alt='Ad Image'>");
