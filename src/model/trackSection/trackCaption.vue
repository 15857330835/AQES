<template>
  <div class="clearfix caption-box" id="captionbox">
    <div style="width:160px;float:left">
      <div class="clearfix">
        <div class="edit_track_title" style="height:30px">
          <div class="icon">
            <span class="cicon"></span>
            <span class="vtitle">字幕轨道</span>
          </div>
          <trackstatus :track="this.status" :type="'caption'"></trackstatus>
          <span
            class="clearTrack iconfont icon-qingchu"
            :style="{ color: this.clearTrack_color }"
            @click="cleartrack"
            :title="this.status.block ? '禁用' : '清空轨道'"
          ></span>
          <div class="track-caption-mask" v-if="modalVoiceApplyIsShow"></div>
        </div>
      </div>
    </div>
    <div style="float:left;width:calc(100% - 160px);height:30px">
      <div class="edit_track_contents clearfix" style="height:100%">
        <div class="edit_track_content">
          <trackhide :track="this.status" :type="'caption'"></trackhide>
          <div
            class="track_able_content"
            :style="{
              height: '30px',
              width:
                length / (this.slidernum.max - track_property.ratio) +
                100 +
                'px',
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
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import trackstatus from './trackStatus'
import trackhide from './trackHide'
import chunkcaption from './chunkCaption'

export default {
  data: function() {
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
      return this.status.block ? '#404040' : '#AAAAAA'
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
    cleartrack: function() {
      if (this.status.block) {
        return
      }
      const that = this
      $.post(
        window.NCES.DOMAIN + '/api/caption',
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
  mounted: function() {
    this.UPDATE_CAPTIONPOSITION()
  }
}
</script>

<style lang="scss" scoped>
.caption-box {
  .edit_track_content {
    border-bottom: 1px solid #141414;
  }
  .edit_track_title {
    position: relative;
    .track-caption-mask {
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      z-index: 9999;
    }
  }
}
</style>
