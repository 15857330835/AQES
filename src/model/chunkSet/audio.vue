<template>
  <div class="setContent-sel4 setContent-sel">
    <div class="content-sel-title">
      <div class="title-left">
        <span class="u-icon setpng"></span>
        <span>设置</span>
      </div>
    </div>
    <div class="content-sel-option">
      <div class="sel-option" v-if="this.filterList.volume != undefined">
        <div
          v-if="this.filterList.volume"
          class="sel-option-name u-icon volumeset_quick"
          :class="this.filterList.volume.parameter.value == 0 ? 'active' : ''"
          @click="closeVol"
        ></div>
        <div v-if="this.filterList.volume" class="sel-option-con">
          <div style="float:right;position: relative;width:60px;height:100%">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              class="sty"
              style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
              :value="parseInt(this.filterList.volume.parameter.value * 100)"
              @blur="filterInputblur('volume', $event.currentTarget)"
            />
            <span style="float:right;color:#61ded0">%</span>
          </div>
          <div
            style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
          >
            <el-slider
              v-model="filterList.volume.parameter.value"
              :show-tooltip="false"
              @change="volumeChange"
              mini
              :max="1"
              :min="0"
              :step="0.01"
            ></el-slider>
          </div>
        </div>
      </div>
      <div
        class="sel-option"
        v-if="
          this.activechunk.chunk.chunk_type == 1 ||
            this.activechunk.chunk.chunk_type == 2
        "
      >
        <div class="sel-option-name">播放速率</div>
        <div class="sel-option-con">
          <div style="float:right;position: relative;width:60px;height:100%">
            <input
              type="number"
              class="sty"
              max="5"
              min="0.2"
              step="0.2"
              style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
              :value="speed"
              disabled
            />
            <span style="float:right;color:#61ded0"></span>
          </div>
          <div
            style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
          >
            <el-slider
              v-model="speed"
              @change="speedChange"
              mini
              :max="5"
              :min="0.2"
              :step="0.2"
            ></el-slider>
          </div>
        </div>
      </div>
      <div class="sel-option">
        <div class="sel-option-name">倒播</div>
        <div class="sel-option-con">
          <div
            class="u-icon con_filter backplay"
            style="width:80px"
            @click="speedwayChange"
          ></div>
        </div>
      </div>
      <div class="sel-option" v-if="this.filterList.volume != undefined">
        <div class="sel-option-name">淡入</div>
        <div class="sel-option-con">
          <div style="float:right;position: relative;width:60px;height:100%">
            <input
              type="number"
              class="sty"
              max="10"
              min="0"
              step="0.1"
              style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
              v-model="fade_in"
              @blur="filterInputblur('volume_fade_in', $event.currentTarget)"
            />
            <span style="float:right;color:#61ded0">s</span>
          </div>
          <div
            style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
          >
            <el-slider
              v-model="fade_in"
              :show-tooltip="false"
              @change="volumeFadeInChange"
              mini
              :max="10"
              :min="0"
              :step="0.1"
            ></el-slider>
          </div>
        </div>
      </div>
      <div class="sel-option" v-if="this.filterList.volume != undefined">
        <div class="sel-option-name">淡出</div>
        <div class="sel-option-con">
          <div style="float:right;position: relative;width:60px;height:100%">
            <input
              type="number"
              class="sty"
              max="10"
              min="0"
              step="0.1"
              style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
              v-model="fade_out"
              @blur="filterInputblur('volume_fade_out', $event.currentTarget)"
            />
            <span style="float:right;color:#61ded0">s</span>
          </div>
          <div
            style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
          >
            <el-slider
              v-model="fade_out"
              :show-tooltip="false"
              @change="volumeFadeOutChange"
              mini
              :max="10"
              :min="0"
              :step="0.1"
            ></el-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data: function() {
    return {
      speed: 0
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum'
    ]),
    filterList: function() {
      // 格式化滤镜数据
      const filter = this.activechunk.chunk.filter
      const data = {}
      for (let i = 0; i < filter.length; i++) {
        switch (filter[i].service) {
          case 'mirror': {
            if (!data.mirror) {
              data.mirror = {}
              data.mirror[i] = filter[i]
            } else {
              data.mirror[i] = filter[i]
            }
            break
          }
          case 'mosaic': {
            if (!data.mosaic) {
              data.mosaic = {}
              data.mosaic[i] = filter[i]
            } else {
              data.mosaic[i] = filter[i]
            }
            break
          }
          default: {
            data[filter[i].service] = filter[i]
          }
        }
      }
      return data
    },
    fade_in: {
      get: function() {
        return parseFloat(
          (
            this.filterList.volume.parameter.fade_in /
            this.systemmessage.player.fps
          ).toFixed(1)
        )
      },
      set: function(newValue) {
        this.filterList.volume.parameter.fade_in = parseInt(
          newValue * this.systemmessage.player.fps,
          10
        )
      }
    },
    fade_out: {
      get: function() {
        return parseFloat(
          (
            this.filterList.volume.parameter.fade_out /
            this.systemmessage.player.fps
          ).toFixed(1)
        )
      },
      set: function(newValue) {
        this.filterList.volume.parameter.fade_out = parseInt(
          newValue * this.systemmessage.player.fps,
          10
        )
      }
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW'
    ]),
    filterInputblur(type, target) {
      switch (type) {
        case 'brightness': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.brightness =
            parseInt(target.value, 10) / 100
          break
        }
        case 'contrast': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.contrast =
            parseInt(target.value, 10) / 100
          break
        }
        case 'saturation': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.saturation =
            parseInt(target.value, 10) / 100
          break
        }
        case 'coloring': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.brightness = parseInt(target.value, 10)
          break
        }
        case 'volume': {
          this.filterList.volume.parameter.disable = 0
          this.filterList.volume.parameter.value =
            parseInt(target.value, 10) / 100
          break
        }
        case 'volume_fade_in': {
          this.filterList.volume.parameter.disable = 0
          // this.filterList.volume.parameter.fade_in = parseInt(target.value) / 100
          break
        }
        case 'volume_fade_out': {
          this.filterList.volume.parameter.disable = 0
          // this.filterList.volume.parameter.fade_out = parseInt(target.value) / 100
          break
        }
        default: {
          console.log('no such filterInputblur')
        }
      }
      this.sendmessage()
    },
    speedwayChange() {
      this.activechunk.chunk.speed = -this.activechunk.chunk.speed
      this.speedChange(this.activechunk.chunk.speed)
    },
    speedChange(value) {
      // 改变播放速率
      this.activechunk.chunk.speed = value
      const that = this
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_speed',
        chunk_id: this.activechunk.chunk.chunk_id,
        speed: this.activechunk.chunk.speed
      }
      data.error = function() {
        that.$notify({
          title: '提示',
          type: 'error',
          message: '播放速率失败！',
          position: 'bottom-right',
          duration: that.notify.time
        })
      }

      this.Post(data)
      // this.sendmessage()
    },
    closeVol() {
      // 一键静音
      if (this.filterList.volume.parameter.value === 0) {
        this.filterList.volume.parameter.value = 1
      } else {
        this.filterList.volume.parameter.value = 0
      }
      this.filterList.volume.parameter.disable = 0
      this.sendmessage()
    },
    volumeChange(value) {
      // 轨道音量改变事件
      this.filterList.volume.parameter.value = value
      this.filterList.volume.parameter.disable = 0
      this.sendmessage()
    },
    volumeFadeInChange(value) {
      // 轨道声音淡入改变事件
      // this.filterList.volume.parameter.fade_in = value
      this.filterList.volume.parameter.disable = 0
      this.sendmessage()
    },
    volumeFadeOutChange(value) {
      // 轨道声音淡出改变事件
      // this.filterList.volume.parameter.fade_out = value
      this.filterList.volume.parameter.disable = 0
      this.sendmessage()
    },
    sendmessage: function() {
      // if(this.chunk.geometry){
      //     this.chunk.geometry = this.propertyTostr(this.textpositionArr)
      // }
      const that = this
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_filter',
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.activechunk.chunk.filter
      }
      data.error = function() {
        that.$notify({
          title: '提示',
          type: 'error',
          message: '滤镜更新失败！',
          position: 'bottom-right',
          duration: that.notify.time
        })
      }
      this.Post(data)
    }
  },
  mounted: function() {
    this.speed = Math.abs(this.activechunk.chunk.speed)
  }
}
</script>

<style></style>
