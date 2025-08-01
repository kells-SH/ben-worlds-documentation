// ========================================
// THEME MANAGEMENT
// ========================================
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    
    window.addEventListener("DOMContentLoaded", () => {
      this.updateThemeIcon(savedTheme);
    });
    
    this.bindToggleButton();
  },

  updateThemeIcon(theme) {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = theme === "dark" ? "🌙" : "☀️";
    }
  },

  toggleTheme() {
    const current = document.body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    this.updateThemeIcon(next);
  },

  bindToggleButton() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggleTheme());
    }
  }
};

// ========================================
// CAROUSEL FUNCTIONALITY
// ========================================
const CarouselManager = {
  init() {
    this.track = document.querySelector(".carousel-track");
    this.prevBtn = document.querySelector(".carousel-btn.prev");
    this.nextBtn = document.querySelector(".carousel-btn.next");
    this.items = document.querySelectorAll(".carousel-item");
    
    if (!this.track || !this.items.length) return;
    
    this.itemWidth = this.items[0].getBoundingClientRect().width + 16;
    this.currentPosition = 0;
    
    this.bindEvents();
    this.positionButtons();
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.movePrevious());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.moveNext());
    }
    
    window.addEventListener("load", () => this.positionButtons());
    window.addEventListener("resize", () => this.positionButtons());
  },

  movePrevious() {
    this.currentPosition += this.itemWidth;
    if (this.currentPosition > 0) this.currentPosition = 0;
    this.updateTrackPosition();
  },

  moveNext() {
    const containerWidth = document.querySelector(".carousel-track-container").offsetWidth;
    const totalWidth = this.itemWidth * this.items.length;
    const maxScroll = containerWidth - totalWidth;
    
    this.currentPosition -= this.itemWidth;
    if (this.currentPosition < maxScroll) this.currentPosition = maxScroll;
    this.updateTrackPosition();
  },

  updateTrackPosition() {
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
  },

  positionButtons() {
    const reference = document.querySelector(".video-track-height");
    if (!reference || !this.prevBtn || !this.nextBtn) return;
    
    const offset = reference.offsetHeight / 2;
    this.prevBtn.style.top = `${offset}px`;
    this.nextBtn.style.top = `${offset}px`;
  }
};

// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================
const NavigationManager = {
  init() {
    this.bindHamburgerMenu();
    this.bindLogoReload();
  },

  bindHamburgerMenu() {
    const hamburger = document.querySelector(".hamburger");
    const siteHeader = document.querySelector(".site-header");
    
    if (hamburger && siteHeader) {
      hamburger.addEventListener("click", () => {
        siteHeader.classList.toggle("active");
      });
    }
  },

  bindLogoReload() {
    document.addEventListener("DOMContentLoaded", () => {
      const logoLink = document.querySelector(".logo a");
      if (!logoLink) return;

      logoLink.addEventListener("click", (e) => {
        const targetHref = logoLink.getAttribute("href");
        const fullTargetURL = new URL(targetHref, window.location.origin).href;

        if (window.location.href === fullTargetURL) {
          e.preventDefault();
          location.reload();
        }
      });
    });
  },
};

// ========================================
// SEARCH FUNCTIONALITY CURRENTLY INACTIVE
// ========================================
const SearchManager = {
  init() {
    this.searchToggle = document.getElementById("search-toggle");
    this.searchContainer = document.querySelector(".search-container");
    this.searchInput = document.getElementById("search-input");
    this.suggestionsContainer = this.initSuggestionsContainer();
    
    if (this.isInitialized()) {
      this.bindEvents();
    }
  },

  isInitialized() {
    return this.searchToggle && this.searchContainer && 
           this.searchInput && this.suggestionsContainer;
  },

  initSuggestionsContainer() {
    let container = document.querySelector(".suggestions-list");
    
    if (!container && this.searchContainer) {
      container = document.createElement("div");
      container.classList.add("suggestions-list");
      this.searchContainer.appendChild(container);
    }
    
    return container;
  },

  bindEvents() {
    this.searchInput.addEventListener("input", () => this.handleSearch());
    this.searchToggle.addEventListener("click", () => this.toggleSearch());
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideSuggestions();
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.searchContainer.contains(e.target)) {
        this.hideSuggestions();
      }
    });
  },

  handleSearch() {
    const query = this.searchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
      this.hideSuggestions();
      return;
    }

    const matches = this.docsIndex.filter(doc => 
      doc.title.toLowerCase().includes(query)
    );
    
    this.showSuggestions(matches);
  },

  toggleSearch() {
    this.searchContainer.classList.toggle("active");
    this.clearSuggestions();

    if (this.searchContainer.classList.contains("active")) {
      this.searchInput.focus();
    } else {
      this.searchInput.value = "";
    }
  },

  showSuggestions(matches) {
    this.clearSuggestions();
    
    if (matches.length === 0) {
      this.showNoResults();
      return;
    }

    matches.forEach(doc => {
      const item = this.createSuggestionItem(doc);
      this.suggestionsContainer.appendChild(item);
    });

    this.suggestionsContainer.style.display = "block";
  },

  showNoResults() {
    const noMatch = document.createElement("div");
    noMatch.className = "suggestion-item";
    noMatch.textContent = "No matching docs found.";
    this.suggestionsContainer.appendChild(noMatch);
    this.suggestionsContainer.style.display = "block";
  },

  createSuggestionItem(doc) {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.textContent = "📄 " + doc.title;
    item.addEventListener("click", () => {
      window.location.href = doc.link;
    });
    return item;
  },

  clearSuggestions() {
    this.suggestionsContainer.innerHTML = "";
  },

  hideSuggestions() {
    this.suggestionsContainer.style.display = "none";
  },

  // Move docs data to a property
  docsIndex: [
    { "title": "Improve Custom Model Imports", "link": "docs.html#docs/meshes-materials-import/improve-custom-model-imports.md" },
      { "title": "Optimize IWP Assets For Peak Performance", "link": "docs.html#docs/meshes-materials-import/optimize-IWP-assets-for-peak-performance.md" },
  { "title": "Import Images And Add Texture Animation", "link": "docs.html#docs/meshes-materials-import/import-images-and-add-texture-animation.md" },
  { "title": "Contribute To Creator Documentation", "link": "docs.html#docs/manuals-and-cheat-sheets/contribute-to-creator-documentation.md" },
  { "title": "Worlds Creator Manual Essentials Made Easy", "link": "docs.html#docs/manuals-and-cheat-sheets/worlds-creator-manual-essentials-made-easy.md" },
  { "title": "How To Make Your World Go Viral", "link": "docs.html#docs/manuals-and-cheat-sheets/how-to-make-your-world-go-viral.md" },
  { "title": "MHCP WorldPlanningGuide.Pdf", "link": "docs.html#docs/manuals-and-cheat-sheets/MHCP_WorldPlanningGuide.pdf" },
  { "title": "MHCP Publishing Checklist.Pdf", "link": "docs.html#docs/manuals-and-cheat-sheets/MHCP_Publishing_Checklist.pdf" },
  { "title": "Publishing Checklist For Horizon Worlds", "link": "docs.html#docs/manuals-and-cheat-sheets/publishing-checklist-for-Horizon-Worlds.md" },
  { "title": "World Building & Pre Production Guide", "link": "docs.html#docs/manuals-and-cheat-sheets/world-building-%26-pre-production-guide.md" },
  { "title": "Worlds Workarounds", "link": "docs.html#docs/manuals-and-cheat-sheets/worlds-workarounds.md" },
  { "title": "15 Blender Tips For Horizon Assets", "link": "docs.html#meshes-materials-import/15-blender-tips-for-Horizon-assets.md" },
  { "title": "3D Modeling In Worlds 101", "link": "docs.html#docs/meshes-materials-import/3d-modeling-in-Worlds-101.md" },
  { "title": "Custom Skydomes Guide Cinematic Horizons", "link": "docs.html#docs/meshes-materials-import/custom-skydomes-guide-cinematic-horizons.md" },
  { "title": "Improve Custom Model Imports", "link": "docs.html#docs/meshes-materials-import/improve-custom-model-imports.md" },
  { "title": "Optimize IWP Assets For Peak Performance", "link": "docs.html#docs/meshes-materials-import/optimize-IWP-assets-for-peak-performance.md" },
  { "title": "Roads & Fences In Horizon Paths 10", "link": "docs.html#docs/meshes-materials-import/roads-%26-fences-in-Horizon---paths-101.md" },
  { "title": "Import Images And Add Texture Animation", "link": "docs.html#docs/meshes-materials-import/import-images-and-add-texture-animation.md" },
  { "title": "Boost performance - top 7 spawning & streaming tricks", "link": "docs.html#docs/understanding-the-desktop-editor/boost-performance-top-7-spawning-%26-streaming-tricks.md" },
  { "title": "Collaboratively Build With Shared Asset Templates", "link": "docs.html#docs/understanding-the-desktop-editor/collaboratively-build-with-shared-asset-templates.md" },
  { "title": "Improve Frame Rates And Custom Asset Bloat", "link": "docs.html#docs/understanding-the-desktop-editor/improve-frame-rates-and-custom-asset-bloat.md" },
  { "title": "Trace, Fix, & Optimize World Performance Issues", "link": "docs.html#docs/understanding-the-desktop-editor/trace,-fix,-%26-optimize-world-performance-issues.md" },
  { "title": "Worlds Desktop Editor 101", "link": "docs.html#docs/understanding-the-desktop-editor/Worlds-desktop-editor-101.md" },
  { "title": "Worlds Desktop Tools Basics", "link": "docs.html#docs/understanding-the-desktop-editor/Worlds-desktop-tools-basics.md" },
  { "title": "Prompt Meta AI In The Worlds Desktop Editor", "link": "docs.html#docs/generative-ai-tools/prompt-Meta-AI-in-the-Worlds-desktop-editor.md" },
  { "title": "Topology Tune Up For GenAI Props And Sets", "link": "docs.html#docs/generative-ai-tools/topology-tune-up-for-GenAI-props-and-sets.md" },
  { "title": "Building Your First World", "link": "docs.html#docs/creating-a-world/building-your-first-world.md" },
  { "title": "Creating A Versatile Holster System In Worlds", "link": "docs.html#docs/creating-a-world/create-a-versatile-holster-system-in-Worlds.md" },
  { "title": "Mobile Worlds Crash Course", "link": "docs.html#docs/creating-a-world/mobile-worlds-crash-course.md" },
  { "title": "Worlds Tools Overview", "link": "docs.html#docs/creating-a-world/Worlds-tools-overview.md" },
  { "title": "15 Worlds TypeScript API 2.0 Tips And Tricks", "link": "docs.html#docs/getting-started-with-scripting/15-Worlds-TypeScript-API-2.0-tips-and-tricks.md" },
  { "title": "Codeblock To TypeScript", "link": "docs.html#docs/getting-started-with-scripting/codeblocks-to-TypeScript.md" },
  { "title": "TypeScript Best Practices 101", "link": "docs.html#docs/getting-started-with-scripting/TypeScript-best-practices-101.md" },
  { "title": "Json Ppvs And Versioning", "link": "docs.html#docs/getting-started-with-scripting/json-ppvs-and-versioning.md" },
  { "title": "Text Entry Tutorial", "link": "docs.html#docs/getting-started-with-scripting/text-entry-tutorial.md" }
  ]
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  CarouselManager.init();
  NavigationManager.init();
  SearchManager.init();
});