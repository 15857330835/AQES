<template>
  <div class="setContent-sel3 setContent-sel">
    <div class="content-sel-title">
      <div class="title-left">
        <span class="u-icon textpng"></span>
        <span>文本</span>
      </div>
    </div>
    <div class="content-sel-option">
      <div
        class="sel-option1 clearfix"
        v-for="(filter, index) in this.activechunk.chunk.filter.filter(
          item => item.type === 2
        )"
        :key="index"
      >
        <div class="clearfix">
          <textarea
            name
            id
            cols="30"
            rows="2"
            :maxlength="maxlength"
            style="resize:none"
            v-model="filter.text"
            @focus="focus"
            @input="tetextchange(index, $event.currentTarget)"
            @blur="blur"
          ></textarea>
          <span style="float:right">
            <span class="textarealength">{{ filter.text.length }}</span
            >/<span>{{ maxlength }}</span>
          </span>
        </div>
        <div
          style="position:relative;height:30px;float:left;padding-top:5px"
          class="clearfix"
        >
          <fontpick :index="index"></fontpick>
          <input
            type="number"
            style="left:230px"
            class="sty"
            min="0"
            v-model="filter.size"
            @input="fontsizeinput(index, $event.currentTarget)"
          />
        </div>
        <div class="clearfix" style="float:right">
          <div class="font-textcolor" :style="{ float: 'left' }">
            <colorpick :index="index" :type="'font'"></colorpick>
          </div>
          <div
            class="font-width font-option"
            :class="filter.weight > 500 ? 'active' : ''"
            @click="togglefont(index, 'weight')"
          >
            <div></div>
          </div>
          <div
            class="font-style font-option"
            :class="filter.style != 'normal' ? 'active' : ''"
            @click="togglefont(index, 'style')"
          >
            <div></div>
          </div>
        </div>
      </div>
      <div class="sel-option">
        <span style="position:relative;top:2px;margin-right:10px">
          <input type="checkbox" id="check1" v-model="setproperty" />
          <label for="check1"></label>
        </span>
        <span>同时设置基础动画</span>
      </div>
      <div class="sel-option" v-if="setproperty">
        <div class="sel-option-name">时间</div>
        <div class="sel-option-con">
          <div
            style="float:right;position: relative;width:60px;height:100%"
          ></div>
          <div
            style="position: relative;width:calc(100% - 80px);height:2px;top:calc(50% - 1px);background-color:#d7d7d7"
          >
            <timerdian
              v-for="(pro, index) in this.activeProperty"
              :key="index"
              :index="index"
            ></timerdian>
          </div>
        </div>
      </div>
      <!-- 文本透明度设置  不需要了 -->
      <!-- <div class = "sel-option" >
            <div class = "sel-option-name">透明度</div>
            <div class = "sel-option-con">
                <div style = "float:right;position: relative;width:60px;height:100%">
                    <input type="number"  step = 1 class = "sty" style = "color:#00A9FF;background-color:transparent;border:none;top:0;height:100%" v-model.number="activeProperty[propertyNum].transparency"  @blur="tmdChange"/>
                    <span style = "float:right;color:#00A9FF">%</span>
                </div>
                <div style = "position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)">
                    <el-slider v-model='activeProperty[propertyNum].transparency'  @change = "tmdChange"   mini :max = '100' :min = '0' :step = '1'></el-slider>
                </div>
            </div>
      </div>-->
      <div class="sel-option">
        <div class="sel-option-name">比例</div>
        <div class="sel-option-con">
          <div style="float:right;position: relative;width:60px;height:100%">
            <input
              type="number"
              class="sty"
              style="color:#00A9FF;background-color:transparent;border:none;top:0;height:100%"
              v-model="bili"
              @blur="wChange"
            />
            <span style="float:right;color:#00A9FF">%</span>
          </div>
          <div
            style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
          >
            <el-slider
              v-model="bili"
              @change="wChange"
              mini
              :max="200"
              :min="0"
              :step="1"
            ></el-slider>
          </div>
        </div>
      </div>
      <div class="sel-option">
        <div class="sel-option-name">位置</div>
        <div class="sel-option-con">
          <div style="float:left;position: relative;height:100%;width:130px">
            <span style="padding:0 15px">X</span>
            <input
              style="top:50%;transform: translate(0,-50%);"
              type="number"
              :value="
                parseInt(
                  (this.systemmessage.player.w *
                    this.activeProperty[this.propertyNum].left) /
                    100
                )
              "
              @blur="changePosition('x', $event.currentTarget)"
              class="sty"
            />
          </div>
          <div style="float:left;position: relative;height:100%;width:130px">
            <span style="padding:0 15px">Y</span>
            <input
              style="top:50%;transform: translate(0,-50%);"
              type="number"
              :value="
                parseInt(
                  (this.systemmessage.player.h *
                    this.activeProperty[this.propertyNum].top) /
                    100
                )
              "
              @blur="changePosition('y', $event.currentTarget)"
              class="sty"
            />
          </div>
        </div>
      </div>
      <div>
        <span style="position:relative;top:2px;margin-right:10px">
          <input type="checkbox" id="check3" v-model="quickposi" />
          <label for="check3"></label>
        </span>
        <span>快速定位</span>
        <quickposition v-if="this.quickposi"></quickposition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'
import timerdian from './timerdian'
import quickposition from './quickPosition'
import fontpick from './fontpick'
import colorpick from './colorPick'
import { chunkUpdateFilterApi } from '@/api/Chunk'
import _ from 'lodash'

export default {
  data: function() {
    return {
      maxlength: 100,
      setproperty: false,
      quickposi: false,
      wh: 1,
      billVal: 0,
      blocked: false,
      copyFilter: {}
    }
  },
  components: {
    timerdian,
    quickposition,
    fontpick,
    colorpick
  },
  // created: function() {},
  destroyed() {
    this.CHANGE_PROPERTYNUM(0)
  },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum',
      'isAsyncSetchart'
    ]),
    propertyOfnum: function() {
      return this.activeProperty[this.propertyNum]
    },
    bili: {
      get: function() {
        return this.billVal
      },
      set: function(newValue) {
        if (this.wh >= 1) {
          this.propertyOfnum.w = parseInt(newValue, 10)
          this.propertyOfnum.h = parseInt(newValue / this.wh, 10)
        } else {
          this.propertyOfnum.h = parseInt(newValue, 10)
          this.propertyOfnum.w = parseInt(newValue * this.wh, 10)
        }
      }
    },
    propertyOfbili: function() {
      return this.propertyOfnum.w
    }
  },
  watch: {
    isAsyncSetchartL: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          // this.billVal =  this.wh>=1?this.activeProperty[this.propertyNum].w:this.activeProperty[this.propertyNum].h
          this.billVal =
            this.wh >= 1 ? this.propertyOfnum.w : this.propertyOfnum.h
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW',
      'CHANGE_ACTIVEPROPERTY',
      'CHANGE_PROPERTYNUM',
      'SET_NEWCHART_BILI',
      'UPDATE_ALLOW_HISTORY_BACK'
    ]),
    textareaChange: function(target) {
      // if(this.activechunk.chunk.filter[0].geometry_template == undefined){
      //     target.value = target.value.substr(0,100)
      // }else{
      //     target.value = target.value.substr(0,1000)
      // }
    },
    focus() {
      window.zindex = 0
    },
    blur() {
      window.zindex = 2
    },
    tetextchange: _.debounce(function(index, target) {
      this.activechunk.chunk.filter[index].text = target.value
      this.sendmessage()
    }, 500),
    tmdChange(value) {
      const geo_arr = this.activeProperty
      this.CHANGE_ACTIVEPROPERTY(geo_arr)
      let geo = ''
      for (let i = 0; i < geo_arr.length; i++) {
        const f = geo_arr[i]
        if (f.top < 0) {
          geo =
            geo +
            f.f +
            '=' +
            f.left +
            '%/' +
            f.top +
            '%:' +
            f.w +
            '%x' +
            f.h +
            '%:' +
            f.transparency +
            ';'
        } else {
          geo =
            geo +
            f.f +
            '=' +
            f.left +
            '%/' +
            f.top +
            '%:' +
            f.w +
            '%x' +
            f.h +
            '%:' +
            f.transparency +
            ';'
        }
      }
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_property',
        chunk_id: this.activechunk.chunk.chunk_id,
        geometry: geo.substr(0, geo.length - 1)
      }
      this.Post(data)
    },
    wChange(value) {
      this.tmdChange()
    },
    hChange(value) {
      this.tmdChange()
    },
    fontsizeinput: function(index, target) {
      if (target.value === '') {
        this.activechunk.chunk.filter[index].size = 0
      } else {
        this.activechunk.chunk.filter[index].size = parseInt(target.value, 10)
      }
      this.sendmessage()
    },
    changePosition(way, target) {
      if (target.value === '') {
        target.value = 0
      } else {
        target.value = parseInt(target.value, 10)
      }

      if (way === 'x') {
        const num1 =
          (parseInt(target.value, 10) * 100) / this.systemmessage.player.w
        this.activeProperty[this.propertyNum].left = num1
      }
      if (way === 'y') {
        const num2 =
          (parseInt(target.value, 10) * 100) / this.systemmessage.player.h
        this.activeProperty[this.propertyNum].top = num2
      }
      this.tmdChange()
    },
    togglefont: function(index, style) {
      if (style === 'weight') {
        if (this.activechunk.chunk.filter[index].weight === 500) {
          this.activechunk.chunk.filter[index].weight = 600
        } else {
          this.activechunk.chunk.filter[index].weight = 500
        }
      }
      if (style === 'style') {
        if (this.activechunk.chunk.filter[index].style === 'normal') {
          this.activechunk.chunk.filter[index].style = 'italic'
        } else {
          this.activechunk.chunk.filter[index].style = 'normal'
        }
      }
      this.sendmessage()
    },
    sendmessage: function(callback) {
      this.UPDATE_ALLOW_HISTORY_BACK(false)
      const that = this
      chunkUpdateFilterApi({
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.activechunk.chunk.filter
      })
        .then(res => {
          if (res.code === 0) {
            this.UPDATE_ALLOW_HISTORY_BACK(true)
          } else {
            console.log(new Error('error'))
          }
        })
        .catch(() => {
          that.$notify({
            title: '提示',
            type: 'error',
            message: '操作失败！',
            position: 'bottom-right',
            duration: that.notify.time
          })
        })
    },
    restore: function() {
      const that = this
      chunkUpdateFilterApi({
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.copyFilter
      })
        .then(res => {
          if (res.code !== 0) {
            console.log(new Error('error'))
          }
        })
        .catch(() => {
          that.$notify({
            title: '提示',
            type: 'error',
            message: '操作失败！',
            position: 'bottom-right',
            duration: that.notify.time
          })
        })
    }
  },
  mounted: function() {
    this.wh =
      this.activeProperty[this.propertyNum].w /
      this.activeProperty[this.propertyNum].h
    this.SET_NEWCHART_BILI(this.wh)

    this.copyFilter = JSON.parse(JSON.stringify(this.activechunk.chunk.filter))
  }
}
</script>

<style></style>
