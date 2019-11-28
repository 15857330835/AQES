<template>
  <div id="trackbox" @mousedown="clearActiveChunks">
    <div class="edit_track clearfix">
      <div
        style="width:160px;float:left;position:relative"
        @mousedown="failClick"
      >
        <div
          v-for="(tracks, index) in this.track.v_track_list"
          :key="tracks.track_id"
          class="clearfix"
        >
          <div class="edit_track_title">
            <div class="icon">
              <span class="vicon"></span>
              <span
                class="vtitle"
                :title="tracks.name"
                @dblclick="handleTitleClick(tracks)"
                >{{ tracks.name }}</span
              >
            </div>
            <trackstatus
              :track="tracks"
              :type="'v_track_list'"
              :index="index"
            ></trackstatus>
            <trackset
              :track="tracks"
              :type="'v_track_list'"
              :index="index"
              :tracks="track.v_track_list"
            ></trackset>
            <trackvolue
              :track="tracks"
              :type="'v_track_list'"
              :index="index"
            ></trackvolue>
          </div>
        </div>
        <div
          v-for="(tracks, index) in this.track.a_track_list"
          :key="tracks.track_id"
          class="clearfix"
        >
          <div class="edit_track_title">
            <div class="icon">
              <span class="aicon"></span>
              <span
                class="atitle"
                :title="tracks.name"
                @dblclick="handleTitleClick(tracks)"
                >{{ tracks.name }}</span
              >
            </div>
            <trackstatus
              :track="tracks"
              :type="'a_track_list'"
              :index="index"
            ></trackstatus>
            <trackset
              :track="tracks"
              :type="'a_track_list'"
              :index="index"
              :tracks="track.a_track_list"
            ></trackset>
            <trackvolue
              :track="tracks"
              :type="'a_track_list'"
              :index="index"
            ></trackvolue>
          </div>
        </div>
        <div class="track-box-left-mask" v-if="modalVoiceApplyIsShow"></div>
      </div>
      <div style="float:left;width:calc(100% - 160px)" class="clearfix">
        <div class="edit_track_contents clearfix" ref="trackbox">
          <div
            v-for="(tracks, index) in track.v_track_list"
            :key="tracks.track_id"
            :id="tracks.track_id"
            class="clearfix edit_track_content"
            :track_type="tracks.track_type"
            :able="tracks.bhidden || tracks.block"
            style="height:63px"
          >
            <div
              class="track_able_content"
              :style="{
                width:
                  length / (slidernum.max - track_property.ratio) + 100 + 'px',
                left: -track_property.outLeft + 'px'
              }"
            >
              <chunkbox
                :trackMark="index"
                v-for="(chunk, index1) in tracks.chunks.filter(
                  chunk => chunk.chunk_type !== 5
                )"
                :key="chunk.chunk_id"
                :chunk="chunk"
                :trackid="tracks.track_id"
                :trackarr="tracks"
                :tracktype="tracks.track_type"
                :index="index1"
              ></chunkbox>
              <chunkdx
                v-for="chunk in tracks.chunks.filter(
                  chunk => chunk.chunk_type === 5
                )"
                :key="chunk.chunk_id"
                :trackarr="tracks"
                :trackid="tracks.track_id"
                :chunk="chunk"
              ></chunkdx>
            </div>
            <trackhide
              :track="tracks"
              :type="'v_track_list'"
              :index="index"
            ></trackhide>
            <track-mask
              :track="tracks"
              :type="'v_track_list'"
              :index="index"
            ></track-mask>
          </div>
          <div
            style="height:63px"
            v-for="(tracks, index) in this.track.a_track_list"
            :key="tracks.track_id"
            :id="tracks.track_id"
            class="clearfix edit_track_content"
            :track_type="tracks.track_type"
            :able="tracks.block || tracks.bhidden"
          >
            <div
              class="track_able_content"
              :style="{
                width:
                  length / (slidernum.max - track_property.ratio) + 100 + 'px',
                left: -track_property.outLeft + 'px'
              }"
            >
              <chunkbox
                v-for="(chunk, index1) in tracks.chunks.filter(
                  chunk => chunk.chunk_type !== 5
                )"
                :key="chunk.chunk_id"
                :trackid="tracks.track_id"
                :chunk="chunk"
                :trackarr="tracks"
                :tracktype="tracks.track_type"
                :index="index1"
              ></chunkbox>
              <chunkdx
                v-for="chunk in tracks.chunks.filter(
                  chunk => chunk.chunk_type === 5
                )"
                :key="chunk.chunk_id"
                :trackid="tracks.track_id"
                :trackarr="tracks"
                :chunk="chunk"
              ></chunkdx>
            </div>
            <trackhide
              :track="tracks"
              :type="'a_track_list'"
              :index="index"
            ></trackhide>
            <track-mask
              :track="tracks"
              :type="'v_track_list'"
              :index="index"
            ></track-mask>
          </div>
        </div>
      </div>
    </div>
    <!-- <div style="width: 100%;height: 2px;" @mousemove="changeTrackboxSize"></div> -->
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import trackstatus from './trackStatus'
import trackset from './trackSet'
import trackvolue from './trackVolue'
// import trackbox from "./trackBox";
import chunkdx from './chunkDx'
import chunkbox from './chunkBox'
import trackhide from './trackHide'
import TrackMask from './TrackMask.vue'
import { trackRenameApi } from '@/api/Track'

export default {
  components: {
    trackstatus,
    trackset,
    trackvolue,
    // trackbox,
    chunkdx,
    chunkbox,
    trackhide,
    TrackMask
  },
  data: function() {
    return {}
  },
  computed: {
    ...mapState([
      'openway',
      'slidernum',
      'moveResultFlag',
      'modalVoiceApplyIsShow',
      'isTrackSelect'
    ]),
    track() {
      return this.$store.state.all.tracks
    },
    length() {
      return this.$store.state.all.curr_track_len
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    width() {
      return this.$refs.trackbox.offsetWidth
    },
    tracknum() {
      return (
        this.$store.state.all.tracks.a_track_list +
        this.$store.state.all.tracks.v_track_list
      )
    }
  },
  methods: {
    ...mapActions(['getnowimg']),
    ...mapMutations([
      'UPDATE_TRACKBOX',
      'UPDATE_TRACKPOSITION',
      'UPDATE_CAPTIONPOSITION',
      'CLEAR_REST_ACTIVE_CHUNKS',
      'EMPTY_ACTIVE_CHUNK',
      'UPDATE_CHUNK_POSITION'
    ]),
    // mouseenter(e) {},
    changeTrackboxSize() {
      // document.getElementById("trackbox").style.maxHeight
    },
    handleTitleClick(tracks) {
      console.log(tracks)
      const track_id = tracks.track_id
      const track_type = tracks.track_type
      window.zindex = 2 // 屏蔽全局的按键事件
      this.$prompt('请输入轨道名称', '轨道重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'rename-track-box'
      })
        .then(({ value }) => {
          trackRenameApi({
            track_id,
            track_type,
            name: value
          }).then(res => {
            if (res.code === 0) {
              tracks.name = value
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            } else {
              this.$message({
                // type: 'danger',
                message: '修改失败'
              })
            }
            window.zindex = 1 // 恢复屏蔽全局的按键事件
          })
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "取消重命名"
          // });
          window.zindex = 1 // 恢复屏蔽全局的按键事件
        })
    },
    clearActiveChunks(e) {
      e.stopPropagation()
      if (this.isTrackSelect) {
        return
      }
      this.CLEAR_REST_ACTIVE_CHUNKS()
      this.EMPTY_ACTIVE_CHUNK()
    },
    failClick(e) {
      e.stopPropagation()
    }
  },
  updated() {
    if (this.moveResultFlag === 1 || this.moveResultFlag === 2) {
      // console.log('updatePosition');
      this.UPDATE_CHUNK_POSITION()
    }
  },
  watch: {
    tracknum: function() {
      const that = this
      setTimeout(function() {
        that.UPDATE_TRACKBOX()
        that.UPDATE_TRACKPOSITION(5)
        that.UPDATE_CAPTIONPOSITION()
        $('#edit_tip_line').height($('.nces_edit').height() + 32 - 58)
      }, 0)
    },
    track: {
      handler: function(newVal) {
        setTimeout(() => {
          $('#trackbox')
            .getNiceScroll()
            .resize()
        }, 0)
      },
      immediate: true
    }
  },
  mounted: function() {
    // 获取可视区域图片的方法
    this.getnowimg()
    // 初始化获取轨道有效区域
    // let num
    // if (this.openway === 'pc') {
    //   num = 197
    // }
    // if (this.openway === 'ios') {
    //   num = 600
    // }
    // $("#trackbox").css('height',$('body').height() - $('.lh').height() -num - 5);
    this.UPDATE_TRACKBOX()
    this.UPDATE_TRACKPOSITION(5)
    this.UPDATE_CAPTIONPOSITION()

    // 轨道区域滚动条
    $('#trackbox').niceScroll({
      cursorcolor: '#AAAAAA',
      cursorborder: '1px solid #AAAAAA',
      enablekeyboard: false,
      horizrailenabled: false,
      enablescrollonselection: false
    })
    // 可视区域的配置选项
    // const data = {
    //   track_start: 0,
    //   track_end: 1000,
    //   r_interval: (this.slidernum.max - this.track_property.ratio) * 100,
    //   pixel_ratio: parseFloat(
    //     (this.slidernum.max - this.track_property.ratio).toFixed(2)
    //   ),
    //   height: 56
    // }
  }
}
</script>

<style lang="scss">
.rename-track-box {
  background-color: #222;
  color: #fff;
  border: none;

  .el-message-box__header {
    background-color: #2e2e2e;

    .el-message-box__title {
      color: inherit;
    }
  }

  .el-message-box__content {
    color: inherit;
  }
}

.track-box-left-mask {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  z-index: 9999;
}
</style>
