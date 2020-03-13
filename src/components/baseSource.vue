<template>
  <div class="video_option_content">
    <div class="content_top" :style="{ backgroundColor }">
      <img
        v-if="isTransitionEffects"
        :src="src"
        class="content_top_img dragele source-img"
        :data-jpg="source.staticImg"
        :data-gif="source.dynamicImg"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :data-service="source.service"
        :class="{ loaded: imgLoaded }"
        @load="handleImgLoad"
      />
      <img
        v-else
        :src="src"
        class="content_top_img dragele source-img"
        :data-src_url="source.url"
        :data-src_from="source.from"
        :data-src_type="source.flag"
        :data-source="source.source"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :class="{ loaded: imgLoaded }"
        @load="handleImgLoad"
      />
      <div
        class="audio_control u-icon"
        v-if="audioControlShow"
        @click="handleAudioControlClick"
        :class="{ active: playing }"
      ></div>
    </div>
    <div class="content_mes clearfix">
      <div :title="source.title">{{ source.title }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  components: {},
  props: ['source'],
  data() {
    return {
      audio: null,
      hover: false,
      imgLoaded: false
    }
  },
  watch: {},
  computed: {
    ...mapState(['audioStatus']),
    src() {
      if (this.isTransitionEffects) {
        if (this.hover) {
          return (
            `${window.NCES.DOMAIN}${this.source.dynamicImg}` ||
            `${window.NCES.DOMAIN}${this.source.staticImg}`
          )
        } else {
          return `${window.NCES.DOMAIN}${this.source.staticImg}`
        }
      } else {
        if (this.hover) {
          return this.source.dynamicImg || this.source.staticImg
        } else {
          return this.source.staticImg
        }
      }
    },
    isTransitionEffects() {
      return !!this.source.service
    },
    backgroundColor() {
      return this.source.source === 'image_id' ? '#fff' : '#000'
    },
    audioControlShow() {
      return this.source.source === 'audio_id'
    },
    playing() {
      return this.audioStatus.src === `//${this.source.url}`
    }
  },
  methods: {
    ...mapMutations(['UPDATE_AUDIO_STATUS']),
    handleAudioControlClick() {
      if (this.playing) {
        this.audioPause()
      } else {
        this.audioPlay()
      }
    },
    audioPlay() {
      this.UPDATE_AUDIO_STATUS(
        Object.assign(this.audioStatus, { src: `//${this.source.url}` })
      )
      // 在设置完src后有一段加载时间,不能立即play
      setTimeout(() => {
        this.UPDATE_AUDIO_STATUS(
          Object.assign(this.audioStatus, { isPlaying: true })
        )
      }, 100)
    },
    audioPause() {
      this.UPDATE_AUDIO_STATUS({ isPlaying: false, src: '' })
    },
    handleMouseEnter() {
      this.hover = true
    },
    handleMouseLeave() {
      this.hover = false
    },
    handleImgLoad() {
      this.imgLoaded = true
    }
  }
}
</script>
<style lang="scss"></style>
