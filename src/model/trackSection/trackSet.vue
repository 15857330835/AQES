<template>
  <div class="dolist" @click="tracksetShow">
    <div class="dolist_prop" v-if="this.show && !this.track.block">
      <div class="rename" @click="renameTrack">
        <span></span>
        <span>重命名</span>
      </div>
      <div class="scgd" @click="delTrack">
        <span></span>
        <span>删除轨道</span>
      </div>
      <div class="movetgd" @click="movetoTop" v-if="this.index != 0">
        <span></span>
        <span>置顶</span>
      </div>
      <div class="movelgd" @click="movetoLast" v-if="this.index != 0">
        <span></span>
        <span>上移</span>
      </div>
      <div
        class="movengd"
        @click="movetoNext"
        v-if="this.index != this.tracks.length - 1"
      >
        <span></span>
        <span>下移</span>
      </div>
      <div
        class="movebgd"
        @click="movetoBottom"
        v-if="this.index != this.tracks.length - 1"
      >
        <span></span>
        <span>置底</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { trackRenameApi } from '@/api/Track'

export default {
  data: function() {
    return {
      show: false
    }
  },
  props: ['track', 'index', 'tracks'],
  updated() {
    this.CHANGE_IS_REFRESH_TRACK_BOX_BS(true)
  },
  methods: {
    ...mapActions(['Post', 'changeLoading']),
    ...mapMutations(['UPDATE_TRACKPOSITION', 'CHANGE_IS_REFRESH_TRACK_BOX_BS']),
    tracksetShow(e) {
      e.stopPropagation()
      if (this.track.block) {
        return
      }
      this.show = !this.show
    },
    movetoTop: function() {
      const that = this
      const data = {}
      data.type = 'track'
      data.data = {
        cmd: 'top',
        track_id: this.track.track_id,
        track_type: this.track.track_type
      }
      data.success = function() {
        setTimeout(() => {
          that.UPDATE_TRACKPOSITION()
        }, 500)
        that.changeLoading()
      }
      this.Post(data)
    },
    movetoBottom: function() {
      const that = this
      const data = {}
      data.type = 'track'
      data.data = {
        cmd: 'bottom',
        track_id: this.track.track_id,
        track_type: this.track.track_type
      }
      data.success = function() {
        setTimeout(() => {
          that.UPDATE_TRACKPOSITION()
        }, 500)
        that.changeLoading()
      }
      this.Post(data)
    },
    moveTrack: function(id) {
      const that = this
      const data = {}
      data.type = 'track'
      data.data = {
        cmd: 'move',
        track_id: this.track.track_id,
        track_type: this.track.track_type,
        follow_track_id: id
      }
      data.success = function() {
        setTimeout(() => {
          that.UPDATE_TRACKPOSITION()
        }, 500)
        that.changeLoading()
      }
      this.Post(data)
    },
    movetoLast: function() {
      if (this.index === 1) {
        this.movetoTop()
      } else {
        this.moveTrack(this.tracks[this.index - 2].track_id)
      }
    },
    movetoNext: function() {
      this.moveTrack(this.tracks[this.index + 1].track_id)
    },
    renameTrack: function() {
      const tracks = this.track
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
    delTrack: function() {
      const that = this
      if (this.tracks.length <= 1) {
        window.zindex = 0

        that.$alert('该轨道不能删除！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      const data = {}
      data.type = 'track'
      data.data = {
        cmd: 'del',
        track_id: this.track.track_id,
        track_type: this.track.track_type
      }
      data.success = function() {
        setTimeout(() => {
          that.UPDATE_TRACKPOSITION()
        }, 500)
        that.changeLoading()
      }
      this.Post(data)
    }
  },
  mounted: function() {
    const that = this
    $(document).on('click', function() {
      that.show = false
    })
  }
}
</script>

<style lang="scss" scoped>
.dolist {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 3px;
  right: 3px;
  background-image: url(../../img/caidan.png);
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 3px;
  cursor: pointer;

  .dolist_prop {
    position: absolute;
    top: 20px;
    width: 100px;
    background-color: #151a20;
    z-index: 1004;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    > div {
      padding: 0 8px;
      height: 24px;
      cursor: pointer;
      font-size: 0px;
      line-height: 0;
      position: relative;

      &:hover {
        background-color: #100c0c;
      }

      > span {
        &:nth-child(1) {
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center;
          width: 14px;
          height: 18px;
          display: inline-block;
          position: relative;
          top: 50%;
          transform: translate(0, -50%);
          margin: 0 7px;
        }

        &:nth-child(2) {
          font-size: 12px;
          width: 60px;
          display: inline-block;
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
        }
      }

      &.scgd > span:nth-child(1) {
        background-image: url(../../img/del.png);
      }

      &.movetgd > span:nth-child(1) {
        background-image: url(../../img/movett.png);
        background-size: 80%;
      }

      &.movebgd > span:nth-child(1) {
        background-image: url(../../img/movetb.png);
        background-size: 80%;
      }

      &.movelgd > span:nth-child(1) {
        background-image: url(../../img/movetl.png);
        background-size: 80%;
      }

      &.movengd > span:nth-child(1) {
        background-image: url(../../img/movetn.png);
        background-size: 80%;
      }

      &.rename > span:nth-child(1) {
        background-image: url(../../img/rename2.png);
        background-size: 100%;
      }
    }
  }
}
</style>
