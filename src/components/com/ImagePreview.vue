<template>
  <div @click.capture="openImage" @keydown.enter.capture="openImage" @keydown.space.capture="openImage">
    <slot />
    <v-dialog v-model="opened" fullscreen :transition="false">
      <div ref="viewer" class="image-preview" @click.self="close" @wheel.prevent="onWheel">
        <v-btn class="image-preview__close" icon dark :aria-label="$t('close')" :title="$t('close')" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-progress-circular v-if="loading" indeterminate color="white" class="image-preview__status" />
        <div v-if="imageFailed" class="image-preview__status white--text" role="alert">{{ $t('imageLoadFailed') }}</div>
        <img
          v-if="opened && imageSource"
          :src="imageSource"
          :alt="imageAlt"
          class="image-preview__image"
          :class="{ 'image-preview__image--dragging': drag }"
          :style="imageStyle"
          :draggable="false"
          @load="loading = false"
          @error="loading = false; imageFailed = true"
          @pointerdown="startDrag"
          @pointermove="moveDrag"
          @pointerup="drag = null"
          @pointercancel="drag = null"
          @lostpointercapture="drag = null"
          @click.stop
        />
        <div class="image-preview__toolbar" @click.stop>
          <v-btn icon dark :disabled="loading || imageFailed || scale <= 0.1" :aria-label="$t('zoomOut')" :title="$t('zoomOut')" @click="zoom(1 / 1.2)">
            <v-icon>mdi-magnify-minus-outline</v-icon>
          </v-btn>
          <span class="image-preview__scale">{{ Math.round(scale * 100) }}%</span>
          <v-btn icon dark :disabled="loading || imageFailed || scale >= 10" :aria-label="$t('zoomIn')" :title="$t('zoomIn')" @click="zoom(1.2)">
            <v-icon>mdi-magnify-plus-outline</v-icon>
          </v-btn>
          <v-btn icon dark :disabled="loading || imageFailed" :aria-label="$t('rotateLeft')" :title="$t('rotateLeft')" @click="rotation = (rotation - 90) % 360">
            <v-icon>mdi-rotate-left</v-icon>
          </v-btn>
          <v-btn icon dark :disabled="loading || imageFailed" :aria-label="$t('rotateRight')" :title="$t('rotateRight')" @click="rotation = (rotation + 90) % 360">
            <v-icon>mdi-rotate-right</v-icon>
          </v-btn>
          <v-btn icon dark :disabled="loading || imageFailed" :aria-label="$t('reset')" :title="$t('reset')" @click="reset">
            <v-icon>mdi-restore</v-icon>
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    opened: false,
    imageSource: '',
    imageAlt: '',
    loading: false,
    imageFailed: false,
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    drag: null,
  }),

  computed: {
    imageStyle() {
      return {
        transform: `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${this.rotation}deg) scale(${this.scale})`,
        visibility: this.loading || this.imageFailed ? 'hidden' : 'visible',
      };
    },
  },

  watch: {
    opened(value) {
      if (!value) this.drag = null;
      else this.$nextTick(this.labelDialog);
    },
    '$i18n.locale'() {
      this.prepareImages();
      this.labelDialog();
    },
  },

  mounted() {
    this.prepareImages();
    this._imageObserver = new MutationObserver(this.prepareImages);
    this._imageObserver.observe(this.$el, { childList: true, subtree: true });
  },

  beforeDestroy() {
    if (this._imageObserver) this._imageObserver.disconnect();
  },

  methods: {
    prepareImages() {
      this.$el.querySelectorAll('.v-md-editor-preview img').forEach(image => {
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', this.$t('imagePreview') + (image.alt ? ': ' + image.alt : ''));
        image.style.cursor = 'zoom-in';
      });
    },

    labelDialog() {
      if (this.$refs.viewer) {
        this.$refs.viewer.closest('[role="dialog"]').setAttribute('aria-label', this.$t('imagePreview'));
      }
    },

    openImage(event) {
      const image = event.target;
      if (image.tagName !== 'IMG' || !image.closest('.v-md-editor-preview')) return;
      const source = image.currentSrc || image.src;
      if (!source) return;
      event.preventDefault();
      event.stopPropagation();
      image.focus({ preventScroll: true });
      this.reset();
      this.imageSource = source;
      this.imageAlt = image.alt || this.$t('imagePreview');
      this.loading = true;
      this.imageFailed = false;
      this.opened = true;
    },

    close() {
      this.drag = null;
      this.opened = false;
    },

    reset() {
      this.scale = 1;
      this.rotation = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.drag = null;
    },

    zoom(factor) {
      this.scale = Math.min(10, Math.max(0.1, this.scale * factor));
    },

    onWheel(event) {
      if (!this.loading && !this.imageFailed && event.deltaY) {
        this.zoom(Math.exp(-event.deltaY * 0.001));
      }
    },

    startDrag(event) {
      if (event.button !== 0 || this.loading || this.imageFailed) return;
      event.preventDefault();
      this.drag = { pointerId: event.pointerId, x: event.clientX - this.offsetX, y: event.clientY - this.offsetY };
      event.currentTarget.setPointerCapture(event.pointerId);
    },

    moveDrag(event) {
      if (this.drag && this.drag.pointerId === event.pointerId) {
        this.offsetX = event.clientX - this.drag.x;
        this.offsetY = event.clientY - this.drag.y;
      }
    },
  },
};
</script>

<style scoped>
.image-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 图片预览背景遮罩：最后一位为不透明度，0 全透明、1 全黑；调小 0.9 可让底层页面更清晰。 */
  background: rgba(0, 0, 0, 0.3);
}
.image-preview__image {
  flex: none;
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.image-preview__image--dragging { cursor: grabbing; }
.image-preview__close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}
.image-preview__status { position: absolute; }
.image-preview__toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  /* 底部工具栏背景：0.7 为不透明度，仅影响工具栏，不影响页面遮罩和图片。 */
  background: rgba(0, 0, 0, 0.7);
  transform: translateX(-50%);
}
.image-preview__scale { min-width: 55px; color: white; text-align: center; }
</style>
