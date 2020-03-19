<template>
  <div class="addTrackprop">
    <div class="trackProp_content">
      <div class="content_title">添加新的轨道</div>
      <div class="content_text">
        <span
          ><label
            ><input
              type="radio"
              checked="checked"
              name="tracktypes"
              value="1"
            />&nbsp;视频 / 文本 / 图片</label
          ></span
        >
        <span
          ><label
            ><input type="radio" name="tracktypes" value="2" />&nbsp;音频</label
          ></span
        >
      </div>
      <div class="content_input">
        <span>轨道名称 : </span><input type="text" class="trackname" />
      </div>
      <div class="content_bottom">
        <span class="content_click_cancel" @click="cel">取消</span>
        <span class="content_click_make" @click="add">确认</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data: function() {
    return {}
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState(['systemmessage']),
    loadingShow: function() {
      return this.startloading || this.onloading
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'changeLoading']),
    ...mapMutations(['CHANGE_BOXSET', 'UPDATE_TRACKPOSITION']),
    add() {
      const that = this
      // if(!this.clock){
      //     this.clock = true
      // } else {
      //     return
      // }
      const track_type = parseInt($('.addTrackprop input:checked').val(), 10)
      const max_tracks = this.systemmessage.melt.max_tracks
      if (
        track_type === 1 &&
        this.$store.state.all.tracks.v_track_list.length >= max_tracks
      ) {
        console.log(
          '视频轨道数:' + this.$store.state.all.tracks.v_track_list.length
        )
        this.$alert(
          '您添加的视频轨道数已超出上限:' + max_tracks + '，无法继续添加！',
          '错误'
        )
        return
      }
      if (
        track_type === 2 &&
        this.$store.state.all.tracks.a_track_list.length >= max_tracks
      ) {
        console.log(
          '音频轨道数:' + this.$store.state.all.tracks.a_track_list.length
        )
        this.$alert(
          '您添加的音频轨道数已超出上限:' + max_tracks + '，无法继续添加！',
          '错误'
        )
        return
      }
      const data = {}
      data.type = 'track'
      data.data = {
        cmd: 'add',
        track_type: track_type,
        name: $('.trackname').val()
      }
      data.success = function() {
        setTimeout(() => {
          that.UPDATE_TRACKPOSITION()
        }, 500)
        that.changeLoading()
      }
      this.Post(data)
      this.CHANGE_BOXSET('')
    },
    cel() {
      this.CHANGE_BOXSET('')
    }
  }
}
</script>

<style lang="scss" scoped>
/* 添加轨道的弹窗样式*/
.trackProp_content {
  .content_text {
    font-size: 13px;
    height: 70px;
    text-align: center;
    position: relative;
    span {
      position: absolute;
      margin: 0;
      left: 50%;
      top: 50%;
      /*transform: translate(-50%,-50%);*/
      width: 25%;
      &:nth-child(1) {
        left: 30%;
      }
      &:nth-child(2) {
        left: 50%;
      }
    }
  }
  .content_input {
    height: 60px;
    text-align: center;
    position: relative;
    span {
      margin-right: 10px;
    }
    input[type='text'] {
      width: 160px;
    }
  }
}
</style>
