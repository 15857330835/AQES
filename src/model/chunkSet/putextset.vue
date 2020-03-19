<template>
  <div class="setContent-sel2 setContent-sel">
    <div class="content-sel-title">
      <div class="title-left">
        <span class="u-icon textpng"></span>
        <span>文本put</span>
      </div>
    </div>
    <div class="content-sel-option">
      <div class="sel-option1 clearfix">
        <textarea
          name
          id
          cols="30"
          rows="6"
          :maxlength="
            this.activechunk.chunk.filter[0].geometry_template == undefined
              ? this.minlength
              : this.maxlength
          "
          style="resize:none"
          v-model="activechunk.chunk.filter[0].text"
          @focus="focus"
          @input="putextchange(0, $event.currentTarget)"
          @blur="blur"
        ></textarea>
        <span style="float:right">
          <span
            class="textarealength"
            v-html="this.activechunk.chunk.filter[0].text.length"
          ></span
          >/
          <span
            v-html="
              this.activechunk.chunk.filter[0].geometry_template == undefined
                ? this.minlength
                : this.maxlength
            "
          ></span>
        </span>
      </div>
      <div class="sel-option1 clearfix">
        <div
          style="position:relative;height:30px;padding-top:5px;float:left"
          class="clearfix"
        >
          <fontpick :index="0"></fontpick>
          <input
            type="number"
            style="left:230px"
            class="sty"
            min="0"
            v-model="activechunk.chunk.filter[0].size"
            @input="fontsizeinput(0, $event.currentTarget)"
          />
        </div>
        <div style="float:right">
          <div
            class="font-width font-option"
            :class="
              this.activechunk.chunk.filter[0].weight > 500 ? 'active' : ''
            "
            @click="togglefont(0, 'weight')"
          >
            <div></div>
          </div>
          <div
            class="font-style font-option"
            :class="
              this.activechunk.chunk.filter[0].style != 'normal' ? 'active' : ''
            "
            @click="togglefont(0, 'style')"
          >
            <div></div>
          </div>
          <div class="font-textcolor" :style="{ float: 'left' }">
            <colorpick :index="0" :type="'font'"></colorpick>
          </div>
          <div class="font-boxcolor" :style="{ float: 'left' }">
            <colorpick :index="0" :type="'backg'"></colorpick>
          </div>
          <div
            class="font-position font-option"
            @click="toggleposition()"
            v-if="
              this.activechunk.chunk.filter[0].geometry_template == undefined
            "
          >
            <div style="position:relative">
              <div class="font-positionleft"></div>
              <div class="sp-dd" style="margin-top:4px">▼</div>
              <div class="font-positioncontent" v-show="this.flag">
                <div class="ldq" @click="movetext('ldq')"></div>
                <div class="cdq" @click="movetext('cdq')"></div>
                <div class="rdq" @click="movetext('rdq')"></div>
                <div class="tdq" @click="movetext('tdq')"></div>
                <div class="mdq" @click="movetext('mdq')"></div>
                <div class="bdq" @click="movetext('bdq')"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="sel-option"
        v-if="
          this.activechunk.chunk.filter[0].geometry_template == 'rl_roll' ||
            this.activechunk.chunk.filter[0].geometry_template == 'lr_roll'
        "
      >
        <div class="sel-option-name">顶部间距</div>
        <div class="sel-option-con">
          <div style="float:right;position: relative;width:60px;height:100%">
            <input
              type="number"
              max="100"
              min="0"
              class="sty"
              style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
              v-model="textTop"
              @blur="hChange"
            />
            <span style="float:right;color:#61ded0;">%</span>
          </div>
          <div
            style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
          >
            <el-slider
              v-model="textTop"
              @change="hChange"
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
      <div
        v-if="activechunk.chunk.filter[0].geometry_template === undefined"
        class="sel-option"
      >
        <span style="position:relative;top:2px;margin-right:10px">
          <input type="checkbox" id="check1" v-model="setproperty" />
          <label for="check1"></label>
        </span>
        <span>同时设置基础动画</span>
      </div>
      <div class="sel-option" v-if="this.setproperty">
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
      <!-- <div class = "sel-option" >
            <div class = "sel-option-name">透明度</div>
            <div class = "sel-option-con">
                <div style = "float:right;position: relative;width:60px;height:100%">
                    <input type="number"  step = 1 class = "sty" style = "color:#61ded0;background-color:transparent;border:none;top:0;height:100%"  v-model='textTransparency' @blur="tmdChange" />
                    <span style = "float:right;color:#61ded0">%</span>
                </div>
                <div style = "position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)">
                    <el-slider v-model='textTransparency'  @change = "tmdChange"   mini :max = '100' :min = '0' :step = '1'></el-slider>
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
              style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
              :max="200"
              :min="0"
              v-model="bili"
              @blur="wChange"
            />
            <span style="float:right;color:#61ded0">%</span>
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
import _ from 'lodash'
export default {
  data: function() {
    return {
      minlength: 100,
      maxlength: 1000,
      setproperty: false,
      quickposi: false,
      flag: false,
      biliVal: 0
    }
  },
  components: {
    timerdian,
    quickposition,
    fontpick,
    colorpick
  },
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
    textTransparency: {
      get: function() {
        return this.propertyOfnum.transparency
      },
      set: function(newValue) {
        this.propertyOfnum.transparency = parseInt(newValue, 10)
      }
    },
    textTop: {
      get: function() {
        const top = this.activechunk.chunk.filter[0].geometry_top
        return top
      },
      set: function(newValue) {
        this.activechunk.chunk.filter[0].geometry_top = parseInt(newValue, 10)
      }
    },
    textW: {
      get: function() {
        return this.propertyOfnum.w
      },
      set: function(newValue) {
        this.propertyOfnum.w = parseInt(newValue, 10)
      }
    },
    bili: {
      get: function() {
        if (this.isAsyncSetchart) {
          this.biliVal =
            this.wh >= 1 ? this.propertyOfnum.w : this.propertyOfnum.h
          // this.billVal =  this.wh>=1?this.activeProperty[this.propertyNum].w:this.activeProperty[this.propertyNum].h
          return this.biliVal
        }
        return this.biliVal
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
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW',
      'SET_NEWCHART_BILI',
      'CHANGE_ACTIVEPROPERTY',
      'CHANGE_PROPERTYNUM'
    ]),
    focus() {
      window.zindex = 0
    },
    blur() {
      window.zindex = 2
    },
    putextchange: _.debounce(function(e) {
      this.sendmessage()
    }, 300),
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
      ;(data.success = function() {}), (data.error = function() {})
      this.Post(data)
    },
    wChange(value) {
      this.tmdChange()
    },
    hChange(value) {
      this.sendmessage()
      // this.tmdChange()
    },
    toggleposition() {
      this.flag = !this.flag
    },
    movetext(position) {
      if (position === 'ldq') {
        this.activechunk.chunk.filter[0].halign = 0
      }
      if (position === 'cdq') {
        this.activechunk.chunk.filter[0].halign = 1
      }
      if (position === 'rdq') {
        this.activechunk.chunk.filter[0].halign = 2
      }
      if (position === 'tdq') {
        this.activechunk.chunk.filter[0].valign = 0
      }
      if (position === 'mdq') {
        this.activechunk.chunk.filter[0].valign = 1
      }
      if (position === 'bdq') {
        this.activechunk.chunk.filter[0].valign = 2
      }
      this.sendmessage()
    },
    fontsizeinput(index, target) {
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
        const num =
          (parseInt(target.value, 10) * 100) / this.systemmessage.player.w
        this.activeProperty[this.propertyNum].left = num
      }
      if (way === 'y') {
        const num =
          (parseInt(target.value, 10) * 100) / this.systemmessage.player.h
        this.activeProperty[this.propertyNum].top = num
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
    sendmessage: function() {
      // if(this.chunk.geometry){
      //     this.chunk.geometry = this.propertyTostr(this.textpositionArr)
      // }
      const that = this
      const data = {}
      ;(data.type = 'chunk'),
        (data.data = {
          cmd: 'update_filter',
          chunk_id: this.activechunk.chunk.chunk_id,
          property: this.activechunk.chunk.filter
        })
      data.error = function() {
        that.$notify({
          title: '提示',
          type: 'error',
          message: '操作失败！',
          position: 'bottom-right',
          duration: this.notify.time
        })
      }
      this.Post(data)
    }
  },
  mounted: function() {
    //   console.log(this.activechunk.chunk.filter)
    this.wh =
      this.activeProperty[this.propertyNum].w /
      this.activeProperty[this.propertyNum].h
    this.SET_NEWCHART_BILI(this.wh)
  }
}
</script>

<style></style>
