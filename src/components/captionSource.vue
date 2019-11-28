<template>
  <div
    class="video_option_content"
    style="width:192px;padding:5px 5px 0px;margin-bottom:15px"
  >
    <div
      class="content_top"
      :class="{ active: isSelected }"
      style="height:108px"
    >
      <img
        :src="src"
        class="content_top_img source-img"
        style="height: 108px"
        :class="{ loaded: imgLoaded }"
        @load="handleImgLoad"
      />
      <span class="zmTouse" :data-style="source.style" @click="applyStyle"
        >应用</span
      >
      <span class="zmSuccess"></span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { captionAddApi, captionUpdateStyleApi } from '@/api/Caption'
export default {
  props: ['source'],
  data() {
    return {
      hover: false,
      imgLoaded: false
    }
  },
  watch: {},
  computed: {
    ...mapState(['captionStyle']),
    src() {
      return '//' + this.source.preview_img
    },
    isSelected() {
      return (
        this.source.style === this.captionStyle.status.style &&
        this.captionStyle.chunks.length > 0
      )
    }
  },
  methods: {
    ...mapMutations(['UPDATE_AUDIO_STATUS']),
    ...mapActions(['changeLoading']),
    async applyStyle() {
      if (this.captionStyle.status.style === this.source.style) {
        if (this.captionStyle.chunks.length === 0) {
          const res = await captionAddApi({
            track_start: 0,
            track_end: 3 * 25,
            text: ''
          })
          if (res.code === 0) {
            this.changeLoading()
          }
        }
      } else {
        const res = await captionUpdateStyleApi({
          style: this.source.style
        })
        if (res.code !== 0) return
        if (this.captionStyle.chunks.length === 0) {
          const res2 = await captionAddApi({
            track_start: 0,
            track_end: 3 * 25,
            text: ''
          })
          if (res2.code === 0) {
            this.changeLoading()
          }
        } else {
          this.changeLoading()
        }
      }
    },
    handleImgLoad() {
      this.imgLoaded = true
    }
  }
}
</script>
<style lang="scss" scoped>
.img-enter-active,
.img-leave-active {
  transition: all 0.5s;
}
.img-enter,
.img-leave-to {
  opacity: 0;
}
.source-img {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.source-img.loaded {
  opacity: 1;
}
</style>
