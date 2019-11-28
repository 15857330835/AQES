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

<style>
.el-slider__runway.disabled .el-slider__button {
  border: 2px solid #575050;
  background-color: #575050;
  width: 12px;
  height: 12px;
}
.el-slider__button {
  border: 2px solid #aaa;
  background-color: #aaa;
  width: 12px;
  height: 12px;
}
.el-slider__bar {
  background-color: #088fd3;
}
.el-slider__runway.disabled .el-slider__bar {
  background-color: #1d5572;
}

.el-slider__runway {
  background-color: #636363;
}
.el-slider__runway.disabled {
  background-color: #3b3939;
}
.vol_content .el-slider__runway {
  margin: 12px 0;
}
</style>
