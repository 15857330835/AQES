<template>
  <div class="setContent-sel3 setContent-sel">
    <div class="content-sel-title">
      <div class="title-left">
        <span
          class="u-icon writepng"
          style="cursor:pointer"
          :class="this.classname == 'content-sel_O1' ? 'active' : ''"
          @click="tabChange('content-sel_O1')"
          title="动画"
        ></span>
        <span
          class="u-icon setpng"
          style="cursor:pointer"
          :class="this.classname == 'content-sel_O2' ? 'active' : ''"
          @click="tabChange('content-sel_O2')"
          title="变换"
        ></span>
      </div>
    </div>
    <div
      class="content-sel_O1 animate-container"
      v-if="this.classname == 'content-sel_O1'"
    >
      <div class="animate-content">
        <div class="animate-option-groups">
          <div class="option-text">
            <div class="text-title">文字</div>
            <div class="text-style">
              <fontpick :index="0"></fontpick>
              <!-- <input
                type="number"
                min="0"
                v-model="activechunk.chunk.filter[0].size"
                @input="fontsizeinput(0, $event.currentTarget)"
                class="font-size-set"
              /> -->
              <div class="font-options">
                <div
                  title="粗体"
                  class="font-width font-option"
                  :class="parameter.weight > 500 ? 'active' : ''"
                  @click="togglefont('weight')"
                ></div>
                <div
                  title="斜体"
                  class="font-style font-option"
                  :class="parameter.style != 'normal' ? 'active' : ''"
                  @click="togglefont('style')"
                ></div>
              </div>
              <div class="dynamic-text-colorpicker">
                <span>字体颜色：</span>
                <colorpick type="textColor" title="文字颜色"></colorpick>
              </div>
              <template v-if="isBgColorLinked">
                <div class="dynamic-text-colorpicker">
                  <span>背景色：</span>
                  <colorpick
                    type="iconBgColor"
                    type2="textBgColor"
                    title="背景色"
                  ></colorpick>
                </div>
              </template>
              <template v-else>
                <div class="dynamic-text-colorpicker" v-if="hasIconBgColor">
                  <span>图标背景色：</span>
                  <colorpick type="iconBgColor" title="图标背景色"></colorpick>
                </div>
                <div class="dynamic-text-colorpicker" v-if="hasTextBgColor">
                  <span>文字背景色：</span>
                  <colorpick type="textBgColor" title="文字背景色"></colorpick>
                </div>
              </template>
            </div>
            <div class="text-content">
              <template v-if="parameter.text !== undefined">
                <textarea
                  name
                  id
                  cols="30"
                  rows="2"
                  :maxlength="maxlength"
                  style="resize:none"
                  v-model="parameter.text"
                  @focus="focus"
                  @blur="tetextchange($event.currentTarget, 'text')"
                ></textarea>
                <div class="length-mark">
                  <span
                    class="textarealength"
                    v-html="parameter.text.length"
                  ></span
                  >/ <span v-html="maxlength"></span>字
                </div>
              </template>
              <template v-if="parameter.text_1 !== undefined">
                <textarea
                  name
                  id
                  cols="30"
                  rows="2"
                  :maxlength="maxlength"
                  style="resize:none"
                  v-model="parameter.text_1"
                  @focus="focus"
                  @blur="tetextchange($event.currentTarget, 'text_1')"
                ></textarea>
                <div class="length-mark">
                  <span
                    class="textarealength"
                    v-html="parameter.text_1.length"
                  ></span
                  >/ <span v-html="maxlength"></span>字
                </div>
              </template>
              <template v-if="parameter.text_2 !== undefined">
                <textarea
                  name
                  id
                  cols="30"
                  rows="2"
                  :maxlength="maxlength"
                  style="resize:none"
                  v-model="parameter.text_2"
                  @focus="focus"
                  @blur="tetextchange($event.currentTarget, 'text_2')"
                ></textarea>
                <div class="length-mark">
                  <span
                    class="textarealength"
                    v-html="parameter.text_2.length"
                  ></span
                  >/ <span v-html="maxlength"></span>字
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="content-sel_O2 transform-container"
      v-if="this.classname == 'content-sel_O2'"
    >
      <div class="content-sel-option transform-content clearfix">
        <div class="sel-option">
          <div class="sel-option-name">比例</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                :value="parseFloat(parameter.geometry_h).toFixed(0)"
                @change="handleBiliInputChange"
                @blur="wChange"
              />
              <span style="float:right;color:#61ded0">%</span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="parameter.geometry_h"
                :format-tooltip="formatGeometryH"
                @change="wChange"
                mini
                :max="100"
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
                    (this.systemmessage.player.w * parameter.geometry_left) /
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
                    (this.systemmessage.player.h * parameter.geometry_top) / 100
                  )
                "
                @blur="changePosition('y', $event.currentTarget)"
                class="sty"
              />
            </div>
          </div>
        </div>
        <!-- <div>
        <span style="position:relative;top:2px;margin-right:10px">
          <input type="checkbox" id="check3" v-model="quickposi">
          <label for="check3"></label>
        </span>
        <span>快速定位</span>
        <quickposition v-if="this.quickposi"></quickposition>
      </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'
// import timerdian from './timerdian'
// import quickposition from './quickPosition'
import fontpick from './fontpick'
import colorpick from './dynamicTextColorPick'
export default {
  data() {
    return {
      classname: 'content-sel_O1',
      maxlength: 60,
      setproperty: true,
      quickposi: true,
      wh: 1,
      billVal: 0,
      parameter: null,
      textColor: this.$store.state.activechunk.chunk.template_parameter.color,
      isBgColorLinked: false,
      hasIconBgColor: false,
      hasTextBgColor: false
    }
  },
  components: {
    // timerdian,
    fontpick,
    colorpick
  },

  mounted() {
    this.wh =
      this.activeProperty[this.propertyNum].w /
      this.activeProperty[this.propertyNum].h
    this.SET_NEWCHART_BILI(this.wh)
    this.hasIconBgColor = !!this.activechunk.chunk.template_parameter
      .icon_bg_color
    this.hasTextBgColor = !!this.activechunk.chunk.template_parameter.color
    this.CHANGE_FILTERSHOW('dynamicText')
  },
  created() {
    this.parameter = this.activechunk.chunk.template_parameter
    this.SET_SCALE(this.parameter.geometry_w / this.parameter.geometry_h)
    this.geometry_h = this.parameter.geometry_h
  },
  destroyed() {
    this.CHANGE_PROPERTYNUM(0)
    this.CHANGE_FILTERSHOW('normal') // 顶层编辑框恢复原状
  },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum',
      'isAsyncSetchart',
      'scale'
    ]),
    // geometry_h: {
    //   get:function(){
    //     return parseInt(this.parameter.geometry_h);
    //   },
    //   set:function(val){
    //     this.parameter.geometry_h = val;
    //   }
    // },
    propertyOfnum() {
      return this.activeProperty[this.propertyNum]
    }
  },
  watch: {
    parameter: {
      handler(newVal, oldVal) {
        // console.log({newVal, oldVal})
        let w = this.scale * newVal.geometry_h
        if (w > 100) w = 100
        this.parameter.geometry_w = w
      },
      deep: true
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
      'CHANGE_FILTERSHOW',
      'SET_SCALE',
      'CHANGE_POSITION'
    ]),
    tabChange(name) {
      this.classname = name
    },
    formatGeometryH(value) {
      return parseInt(value, 10)
    },
    // handleTextColorChange() {},
    handleBiliInputChange(e) {
      this.parameter.geometry_h = parseFloat(e.target.value)
    },
    textareaChange(target) {
      // if(this.activechunk.chunk.filter[0].geometry_template == undefined){
      //     target.value = target.value.substr(0,100)
      // }else{
      //     target.value = target.value.substr(0,1000)
      // }
    },
    focus() {
      window.zindex = 0
    },
    getChunkInfo(id) {
      return this.$axios.post(
        window.NCES.DOMAIN + '/api/chunk',
        JSON.stringify({
          cmd: 'get',
          chunk_id: id
        })
      )
    },
    tetextchange(target, type) {
      window.zindex = 2
      this.parameter[type] = target.value
      this.sendmessage(async res => {
        if (res && res.code === 0) {
          const newChunk = await this.getChunkInfo(
            this.activechunk.chunk.chunk_id
          )
          this.parameter.geometry_w =
            newChunk.data.template_parameter.geometry_w
          this.SET_SCALE(this.parameter.geometry_w / this.parameter.geometry_h)
        } else {
          console.log('update_template_parameter 故障')
        }
      })
    },

    wChange(value) {
      this.sendmessage(async res => {
        if (res && res.code === 0) {
          const newChunk = await this.getChunkInfo(
            this.activechunk.chunk.chunk_id
          )
          this.parameter.geometry_w =
            newChunk.data.template_parameter.geometry_w
          this.SET_SCALE(this.parameter.geometry_w / this.parameter.geometry_h)
        }
      })
    },
    fontsizeinput(target) {
      if (target.value === '') {
        this.parameter.size = 0
      } else {
        this.parameter.size = parseInt(target.value, 10)
      }
      this.sendmessage()
    },
    changePosition(way, target) {
      this.CHANGE_POSITION({ way, target })
      this.sendmessage()
    },
    togglefont(style) {
      if (style === 'weight') {
        if (this.parameter.weight === 500) {
          this.parameter.weight = 600
        } else {
          this.parameter.weight = 500
        }
      }
      if (style === 'style') {
        if (this.parameter.style === 'normal') {
          this.parameter.style = 'italic'
        } else {
          this.parameter.style = 'normal'
        }
      }
      this.sendmessage()
    },
    sendmessage(onSuccess) {
      const that = this
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_template_parameter',
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.parameter
      }
      data.success = onSuccess
      data.error = function() {
        that.$notify({
          title: '提示',
          type: 'error',
          message: '操作失败！',
          position: 'bottom-right',
          duration: that.notify.time
        })
      }
      this.Post(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.split-line {
  width: 2px;
  height: 30px;
  background-color: #fff;
  margin: 5px;
}
</style>
