<template>
  <div class="setvol">
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
  data() {
    return {}
  },
  props: ['track', 'index', 'type'],
  methods: {
    ...mapActions(['Post']),
    volChange(value) {
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
    quickClock() {
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
          callback() {
            window.zindex = 1
          }
        })
      }
      this.Post(data)
    }
  },
  mounted() {
    //   this.index = 9
  }
}
</script>

<style lang="scss" scoped>
.setvol {
  width: calc(100% - 0.12rem);
  height: 31px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .vol_clock {
    height: 0.24rem;
    width: 0.24rem;
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
    padding-right: 0.1rem;
  }
}
</style>
<style lang="scss">
.vol_content {
  .el-slider {
    font-size: 0.16rem;
    .el-slider__runway {
      background-color: #636363;
      height: 5px;
      margin: 13px 0;
      .el-slider__bar {
        height: 5px;
      }
      .el-slider__button-wrapper {
        height: 0.54rem;
        width: 0.54rem;
        top: -0.23rem;
        .el-slider__button {
          border: 0.02rem solid #aaa;
          background-color: #aaa;
          width: 0.1rem;
          height: 0.1rem;
        }
      }
    }
  }
}
</style>
