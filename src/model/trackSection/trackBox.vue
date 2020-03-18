<template>
  <div
    id="trackbox"
    @mousedown="clearActiveChunks"
    class="track-box bscroll"
    ref="bscroll"
    :style="{
      maxHeight: editHeight
    }"
  >
    <div class="edit_track bscroll-container">
      <div class="edit_track_titles" @mousedown="failClick">
        <div
          class="edit_track_title"
          v-for="(tracks, index) in this.track.v_track_list"
          :key="tracks.track_id"
        >
          <div class="track-up-content">
            <div class="track-icon-content">
              <span class="vicon"></span>
              <span
                class="vtitle"
                :title="tracks.name"
                @dblclick="handleTitleClick(tracks)"
                >{{ tracks.name }}</span
              >
            </div>
            <div class="track-set-content">
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
            </div>
          </div>
          <trackvolue
            :track="tracks"
            :type="'v_track_list'"
            :index="index"
          ></trackvolue>
        </div>
        <div
          class="edit_track_title"
          v-for="(tracks, index) in this.track.a_track_list"
          :key="tracks.track_id"
        >
          <div class="track-up-content">
            <div class="track-icon-content">
              <span class="aicon"></span>
              <span
                class="atitle"
                :title="tracks.name"
                @dblclick="handleTitleClick(tracks)"
                >{{ tracks.name }}</span
              >
            </div>
            <div class="track-set-content">
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
            </div>
          </div>
          <trackvolue
            :track="tracks"
            :type="'a_track_list'"
            :index="index"
          ></trackvolue>
        </div>
        <div class="track-box-left-mask" v-if="modalVoiceApplyIsShow"></div>
      </div>
      <div class="bg-container">
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
                :key="chunk.chunk_id + chunk.src_id"
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
                :key="chunk.chunk_id + chunk.src_id"
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
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import BScroll from 'better-scroll'
import trackstatus from './trackStatus'
import trackset from './trackSet'
import trackvolue from './trackVolue'
import chunkdx from './chunkDx'
import chunkbox from './chunkBox'
import trackhide from './trackHide'
import TrackMask from './TrackMask.vue'
import { trackRenameApi } from '@/api/Track'
import { TIP_HEIGHT_NUMBER } from '@/config'

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
  props: {
    editHeight: {
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState([
      'openway',
      'slidernum',
      'moveResultFlag',
      'modalVoiceApplyIsShow',
      'isTrackSelect',
      'isRefreshTrackBoxBS'
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
      'UPDATE_CHUNK_POSITION',
      'CHANGE_IS_REFRESH_TRACK_BOX_BS'
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
        customClass: 'rename-decide-box'
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
    tracknum() {
      const that = this
      setTimeout(function() {
        that.UPDATE_TRACKBOX()
        that.UPDATE_TRACKPOSITION(5)
        that.UPDATE_CAPTIONPOSITION()
        $('#edit_tip_line').height($('.nces_edit').height() + TIP_HEIGHT_NUMBER)
      }, 0)
      // this.aBScroll.refresh()
      setTimeout(() => {
        $('#trackbox')
          .getNiceScroll()
          .resize()
      }, 0)
    },
    isRefreshTrackBoxBS(newVal) {
      if (newVal) {
        this.CHANGE_IS_REFRESH_TRACK_BOX_BS(false)
        // this.aBScroll.refresh()
        setTimeout(() => {
          $('#trackbox')
            .getNiceScroll()
            .resize()
        }, 0)
      }
    }
  },
  mounted() {
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

    $('#trackbox').niceScroll({
      cursorcolor: '#AAAAAA',
      cursorborder: '1px solid #AAAAAA',
      enablekeyboard: false,
      horizrailenabled: false,
      enablescrollonselection: false
    })
    // const bscrollDom = this.$refs.bscroll
    // this.aBScroll = new BScroll(bscrollDom, {
    //   mouseWheel: true,
    //   click: true,
    //   tap: true,
    //   scrollbar: {
    //     fade: true,
    //     interactive: true
    //   }
    // })
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
.rename-decide-box {
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
</style>
<style lang="scss" scoped>
.track-box {
  max-height: calc(100vh - 50vw * 9 / 16 - 1.4rem);
  overflow: hidden;
  width: 100%;
  font-size: 12px;
  border-bottom: 2px solid #151a20;
  .edit_track {
    width: 100%;
    .edit_track_titles {
      width: 160px;
      height: 100%;
      .edit_track_title {
        width: 160px;
        height: 63px;
        box-sizing: border-box;
        border-right: 1px solid #151a20;
        border-bottom: 1px solid #151a20;
        position: relative;
        &:last-of-type {
          border-bottom: none;
        }
        .track-up-content {
          width: 159px;
          height: 31px;
          display: flex;
          justify-content: space-between;
          .track-icon-content {
            display: flex;
            align-items: center;
            .vicon {
              background-image: url(../../img/vtrack.png);
              background-repeat: no-repeat;
              background-size: 100%;
              width: 0.2rem;
              height: 0.2rem;
              margin: 0 0.06rem;
            }

            .aicon {
              background-image: url(../../img/atrack.png);
              background-repeat: no-repeat;
              background-size: 95%;
              width: 0.2rem;
              height: 0.2rem;
              margin: 0 0.06rem;
            }

            .vtitle,
            .atitle {
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
          }
        }
      }
    }
    .bg-container {
      flex: 1;
      height: 100%;
      padding: 0 25px 0 10px;
      background-image: repeating-linear-gradient(
        #151a20,
        #151a20 63px,
        #1c232a 63px,
        #1c232a 126px
      );
      .edit_track_contents {
        width: 100%;
        height: 100%;
        overflow: hidden;

        .edit_track_content {
          float: left;
          width: 100%;
          height: 100%;
          position: relative;
          border: 1px solid transparent;
          box-sizing: border-box;

          .track_able_content {
            min-width: 100%;
            width: 100%;
            height: 62px;
            position: absolute;
            left: 0;
          }
        }
      }
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
}
</style>
