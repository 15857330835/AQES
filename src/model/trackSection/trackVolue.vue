<template>
  <div sytle="width:120px;height:30px;" class="setvol">
    <div
      class="u-icon vol_clock"
      @click="quickClock"
      :class="track.volume == 0 ? 'active' : ''"
    ></div>
    <div class="vol_content">
      <el-slider
        v-model="track.volume"
        @change="volChange"
        small
        :max="1"
        :min="0"
        :step="0.1"
        :disabled="track.bhidden || track.block"
      ></el-slider>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data: function() {
    return {}
  },
  props: ['track', 'index', 'type'],
  methods: {
    ...mapActions(['Post']),
    volChange: function(value) {
      const that = this
      $.post(
        window.NCES.DOMAIN + '/api/track',
        JSON.stringify({
          cmd: 'volume',
          track_id: that.track.track_id,
          track_type: that.track.track_type,
          value: value
        }),
        function(res) {
          // Hub.$emit('changeM','')
        },
        'json'
      )
    },
    quickClock: function() {
      const that = this
      if (this.track.bhidden || this.track.block) {
        return
      }

      if (this.track.volume === 0) {
        this.track.volume = 1
      } else {
        this.track.volume = 0
      }
      const data = {}
      data.type = 'track'
      data.data = {
        cmd: 'volume',
        track_id: this.track.track_id,
        track_type: this.track.track_type,
        value: this.track.volume
      }
      data.error = function() {
        window.zindex = 0
        that.$alert('音量切换失败！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
      }
      this.Post(data)
    }
  },
  mounted: function() {
    //   this.index = 9
  }
}
</script>

<style lang="scss" scoped>
.setvol {
  width: 150px;
  height: 30px;
  margin: 0 auto;
  .vol_clock {
    height: 30px;
    width: 18px;
    float: left;
    margin-right: 12px;
    background-image: url(../../img/volumeOpen.png);
    background-size: 100%;
    cursor: pointer;
    &.active {
      background-image: url(../../img/volumeClose.png);
    }
  }
  .vol_content {
    height: 30px;
    width: 110px;
    box-sizing: border-box;
    float: left;
    position: relative;
    transform: scale(0.7);
  }
}
</style>
