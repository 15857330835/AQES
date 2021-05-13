<template>
  <div class="clearfix caption-box" id="captionbox">
    <!-- <div class="edit_track_title">
      <div class="track-icon-content">
        <span class="cicon"></span>
        <span class="ctitle">字幕轨道</span>
      </div>
      <div class="track-set-content">
        <trackstatus :track="this.status" :type="'caption'"></trackstatus>
        <div
          class="clear-track iconfont icon-qingchu"
          :style="{ color: this.clearTrack_color }"
          @click="clearTrack"
          :title="this.status.block ? '禁用' : '清空轨道'"
        ></div>
      </div>
      <div class="track-caption-mask" v-if="modalVoiceApplyIsShow"></div>
    </div>
    <div class="edit_track_contents">
      <div class="edit_track_content">
        <trackhide :track="this.status" :type="'caption'"></trackhide>
        <div
          class="track_able_content"
          :style="{
            width:
              length / (this.slidernum.max - track_property.ratio) + 100 + 'px',
            left: -track_property.outLeft + 'px'
          }"
        >
          <chunkcaption
            v-for="(chunk, index) in chunks"
            :chunk="chunk"
            :index="index"
            :key="chunk.chunk_id"
          ></chunkcaption>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import trackstatus from './trackStatus'
import trackhide from './trackHide'
import chunkcaption from './chunkCaption'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['slidernum', 'modalVoiceApplyIsShow']),
    length() {
      return this.$store.state.all.curr_track_len
    },
    chunks() {
      return this.$store.state.all.caption.chunks
    },
    status() {
      return this.$store.state.all.caption.status
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    clearTrack_color() {
      return this.status.block ? '#404040' : '#cdd5dd'
    }
  },
  components: {
    trackstatus,
    trackhide,
    chunkcaption
  },
  methods: {
    ...mapActions(['changeLoading']),
    ...mapMutations(['UPDATE_CAPTIONPOSITION']),
    clearTrack() {
      if (this.status.block) {
        return
      }
      const that = this
      $.post(
        window.AQES.DOMAIN + '/api/caption' + `?authKey=${window.AQES.authKey}`,
        JSON.stringify({ cmd: 'clear' }),
        function(res) {
          if (res.code !== 0) {
            console.log(res.msg)
          } else {
            $('.video_option .content_top.active').removeClass('active')
          }
          that.changeLoading()
        }
      )
    }
  },
  mounted() {
    this.UPDATE_CAPTIONPOSITION()
  }
}
</script>

<style lang="scss" scoped>
.caption-box {
  width: 100vw;
  height: 0px; //30
  display: flex;
  font-size: 12px;
  border-bottom: 1px solid #151a20;
  box-sizing: border-box;
  .edit_track_title {
    width: 160px;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid #151a20;
    display: flex;
    justify-content: space-between;
    position: relative;
    .track-icon-content {
      width: 159px;
      height: 100%;
      display: flex;
      align-items: center;
      .cicon {
        background-image: url(../../img/ziti.png);
        background-repeat: no-repeat;
        background-size: 95%;
        width: 0.2rem;
        height: 0.2rem;
        margin: 0 0.06rem;
      }
      .ctitle {
        width: 0.6rem;
        font-size: 0.14rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: keep-all;
      }
    }
    .track-set-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 0.69rem;
      height: 100%;
      margin-right: 0.06rem;
      .clear-track {
        cursor: pointer;
        opacity: 0.6;
        font-size: 0.16rem;
        width: 0.2rem;
        text-align: center;
      }
    }
    .track-caption-mask {
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      z-index: 9999;
    }
  }

  .edit_track_contents {
    flex: 1;
    height: 100%;
    padding: 0 25px 0 10px;
    overflow: hidden;
    box-sizing: border-box;

    .edit_track_content {
      width: 100%;
      height: 100%;
      position: relative;

      .track_able_content {
        min-width: 100%;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
      }
    }
  }
}
</style>
