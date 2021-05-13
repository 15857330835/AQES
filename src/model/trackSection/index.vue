<template>
  <div
    class="nces_edit"
    v-show="!this.chunksetshow"
    :key="this.$store.state.refreshKey"
  >
    <drawruler></drawruler>
    <videotip></videotip>
    <div v-show="trackBoxShow" class="tracks-container">
      <trackbox :editHeight="editHeight"></trackbox>
      <trackcaption></trackcaption>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import drawruler from './drawRuler'
import trackbox from './trackBox'
import trackcaption from './trackCaption'
import videotip from './videoTip'
import _ from 'lodash'
import { TRACK_MAXHEIGHT_NUMBER } from '@/config'

export default {
  data() {
    return {
      trackWidth: 0
    }
  },
  computed: {
    ...mapState([
      'chunksetshow',
      'trackBoxShow',
      'slidernum',
      'trackAbleWidth',
      'clientwidth'
    ]),
    pointer() {
      return this.$store.state.all.pointer
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    length() {
      return this.$store.state.all.curr_track_len
    },
    position() {
      return this.pointer.position
    },
    outleft() {
      return this.$store.state.all.track_property.outLeft
    },
    widthScale() {
      if (this.clientwidth >= 1440) {
        return this.track_property.fanwei['1920'].now * 100
      } else {
        return this.track_property.fanwei['1440'].now * 100
      }
    },
    editHeight() {
      return `calc(100vh - ${this.widthScale}vw / 16 * 9 - 2.56rem - ${TRACK_MAXHEIGHT_NUMBER}px)`
    }
  },
  components: {
    drawruler,
    trackbox,
    trackcaption,
    videotip
  },
  methods: {
    ...mapActions(['getnowimg']),
    ...mapMutations([
      'PROPERTY_OUTLEFT',
      'CHANGE_VIS_TIMER_WIDTH',
      'CHANGE_TRACK_ABLE_WIDTH'
    ]),
    getResize() {
      this.trackWidth = document.querySelector(
        '.edit_track_contents'
      ).offsetWidth
      this.CHANGE_TRACK_ABLE_WIDTH()
    },
    throttleResize: _.throttle(function() {
      this.getResize()
    }, 200)
  },
  watch: {
    position: {
      deep: true,
      handler() {
        const a = this.position
        const that = this
        if (
          a / (this.slidernum.max - this.track_property.ratio) -
            this.track_property.outLeft >
            this.trackWidth &&
          this.pointer.speed === 1
        ) {
          console.log(a / (this.slidernum.max - this.track_property.ratio))
          const outleft =
            a / (this.slidernum.max - this.track_property.ratio) +
              this.trackWidth >
            this.trackAbleWidth
              ? this.trackAbleWidth - this.trackWidth
              : a / (this.slidernum.max - this.track_property.ratio)
          console.log(outleft)
          $.post(
            window.AQES.DOMAIN + '/api/property' + `?authKey=${window.AQES.authKey}`,
            JSON.stringify({
              cmd: 'append',
              property: { outLeft: outleft }
            }),
            function(res) {
              if (res.code === 0) {
                // Hub.$emit('changeM')
                // console.log({outleft})
                that.PROPERTY_OUTLEFT(outleft)
                that.getnowimg()
              }
              if (res.code !== 0) {
                console.warn(res.msg)
              }
            },
            'json'
          )
        }
        return
      }
    },
    length: {
      immediate: true,
      handler() {
        const a = this.length
        const that = this
        if (
          a / (this.slidernum.max - this.track_property.ratio) +
            100 -
            this.track_property.outLeft <
          this.trackWidth
        ) {
          let outleft =
            a / (this.slidernum.max - this.track_property.ratio) +
            100 -
            this.trackWidth
          if (outleft < 0) {
            outleft = 0
          }
          $.post(
            window.AQES.DOMAIN + '/api/property' + `?authKey=${window.AQES.authKey}`,
            JSON.stringify({
              cmd: 'append',
              property: { outLeft: outleft }
            }),
            function(res) {
              if (res.code === 0) {
                // Hub.$emit('changeM')
                that.PROPERTY_OUTLEFT(outleft)
                that.getnowimg()
              }
              if (res.code !== 0) {
                console.warn(res.msg)
              }
            },
            'json'
          )
        }
      }
    }
  },
  mounted() {
    this.getResize()
    // this.CHANGE_VIS_TIMER_WIDTH(this.trackWidth);
    window.addEventListener('resize', this.throttleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttleResize)
  }
}
</script>

<style lang="scss" scoped>
.nces_edit {
  margin: 2px 2px 0.6rem;
  background-color: #1c232a;
}
</style>
