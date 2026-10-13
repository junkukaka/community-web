export default {
  mounted() {
    this._cataloguePreview = this.$refs.editor.$el.querySelector('.v-md-editor-preview');
    if (!this._cataloguePreview) return;

    this.buildCatalogue();
    this._catalogueObserver = new MutationObserver(this.buildCatalogue);
    this._catalogueObserver.observe(this._cataloguePreview, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    this._cataloguePreview.addEventListener('load', this.queueCatalogueUpdate, true);
    window.addEventListener('scroll', this.queueCatalogueUpdate, { passive: true });
    window.addEventListener('resize', this.queueCatalogueUpdate);
  },

  beforeDestroy() {
    if (this._catalogueObserver) this._catalogueObserver.disconnect();
    if (this._cataloguePreview) {
      this._cataloguePreview.removeEventListener('load', this.queueCatalogueUpdate, true);
    }
    window.removeEventListener('scroll', this.queueCatalogueUpdate);
    window.removeEventListener('resize', this.queueCatalogueUpdate);
    if (this._catalogueFrame != null) window.cancelAnimationFrame(this._catalogueFrame);
  },

  methods: {
    buildCatalogue() {
      this._catalogueHeadings = Array.from(
        this._cataloguePreview.querySelectorAll('h1,h2,h3,h4,h5,h6')
      ).filter(heading => heading.innerText.trim());
      const levels = [...new Set(this._catalogueHeadings.map(heading => heading.tagName))].sort();
      this.titles = this._catalogueHeadings.map((heading, index) => ({
        title: heading.innerText.trim(),
        lineIndex: heading.getAttribute('data-v-md-line') || `heading-${index}`,
        indent: levels.indexOf(heading.tagName),
      }));
      this.updateCatalogueActive();
    },

    queueCatalogueUpdate() {
      if (this._catalogueFrame != null) return;
      this._catalogueFrame = window.requestAnimationFrame(() => {
        this._catalogueFrame = null;
        this.updateCatalogueActive();
      });
    },

    updateCatalogueActive() {
      if (!this.titles.length) {
        this.contentsTitle = null;
        return;
      }
      let active = 0;
      for (let index = 0; index < this._catalogueHeadings.length; index++) {
        // 与点击目录时的 100px 顶部偏移一致，容许滚动位置取整误差。
        if (this._catalogueHeadings[index].getBoundingClientRect().top > 101) break;
        active = index;
      }
      if (window.pageYOffset > 0 &&
          window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        active = this.titles.length - 1;
      }
      this.contentsTitle = this.titles[active].lineIndex;
    },

    handleAnchorClick(anchor) {
      const heading = this._catalogueHeadings[this.titles.indexOf(anchor)];
      if (heading) {
        this.contentsTitle = anchor.lineIndex;
        this.$refs.editor.previewScrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 100,
        });
      }
    },
  },
};
