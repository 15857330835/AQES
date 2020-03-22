<template>
  <div class="setContent-sel2 setContent-sel">
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
              <input
                type="number"
                min="0"
                v-model="activechunk.chunk.filter[0].size"
                @input="fontsizeinput(0, $event.currentTarget)"
                class="font-size-set"
              />
              <div class="font-options">
                <div
                  class="font-width font-option"
                  :class="
                    this.activechunk.chunk.filter[0].weight > 500
                      ? 'active'
                      : ''
                  "
                  @click="togglefont(0, 'weight')"
                ></div>
                <div
                  class="font-style font-option"
                  :class="
                    this.activechunk.chunk.filter[0].style != 'normal'
                      ? 'active'
                      : ''
                  "
                  @click="togglefont(0, 'style')"
                ></div>
                <div
                  class="font-position font-option"
                  @click="toggleposition()"
                  v-if="
                    this.activechunk.chunk.filter[0].geometry_template ==
                      undefined
                  "
                >
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
              <div class="font-text-color">
                <span>字体颜色：</span>
                <colorpick :index="0" :type="'font'"></colorpick>
              </div>
              <div class="font-box-color">
                <span>背景色：</span>
                <colorpick :index="0" :type="'backg'"></colorpick>
              </div>
            </div>
            <div class="text-content">
              <textarea
                name
                id
                cols="30"
                rows="6"
                :maxlength="
                  this.activechunk.chunk.filter[0].geometry_template ==
                  undefined
                    ? this.minlength
                    : this.maxlength
                "
                style="resize:none"
                v-model="activechunk.chunk.filter[0].text"
                @focus="focus"
                @input="putextchange(0, $event.currentTarget)"
                @blur="blur"
              ></textarea>
              <div class="length-mark">
                <span
                  class="textarealength"
                  v-html="this.activechunk.chunk.filter[0].text.length"
                ></span
                >/
                <span
                  v-html="
                    this.activechunk.chunk.filter[0].geometry_template ==
                    undefined
                      ? this.minlength
                      : this.maxlength
                  "
                ></span>
              </div>
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
                    <input type="number"  step = 1 class = "sty" style = "color:#61ded0;background-color:transparent;border:none;top:0;height:100%"  v-model='textTransparency' @blur="geoPost" />
                    <span style = "float:right;color:#61ded0">%</span>
                </div>
                <div style = "position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)">
                    <el-slider v-model='textTransparency'  @change = "geoPost"   mini :max = '100' :min = '0' :step = '1'></el-slider>
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
import { chunkUpdateFilterApi } from '@/api/Chunk'

export default {
  data() {
    return {
      classname: 'content-sel_O1',
      minlength: 100,
      maxlength: 1000,
      setproperty: true,
      quickposi: true,
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
    propertyOfnum() {
      return this.activeProperty[this.propertyNum]
    },
    textTransparency: {
      get() {
        return this.propertyOfnum.transparency
      },
      set(newValue) {
        this.propertyOfnum.transparency = parseInt(newValue, 10)
      }
    },
    textTop: {
      get() {
        const top = this.activechunk.chunk.filter[0].geometry_top
        return top
      },
      set(newValue) {
        this.activechunk.chunk.filter[0].geometry_top = parseInt(newValue, 10)
      }
    },
    textW: {
      get() {
        return this.propertyOfnum.w
      },
      set(newValue) {
        this.propertyOfnum.w = parseInt(newValue, 10)
      }
    },
    bili: {
      get() {
        if (this.isAsyncSetchart) {
          this.biliVal =
            this.wh >= 1 ? this.propertyOfnum.w : this.propertyOfnum.h
          // this.billVal =  this.wh>=1?this.activeProperty[this.propertyNum].w:this.activeProperty[this.propertyNum].h
          return this.biliVal
        }
        return this.biliVal
      },
      set(newValue) {
        if (this.wh >= 1) {
          this.propertyOfnum.w = parseInt(newValue, 10)
          this.propertyOfnum.h = parseInt(newValue / this.wh, 10)
        } else {
          this.propertyOfnum.h = parseInt(newValue, 10)
          this.propertyOfnum.w = parseInt(newValue * this.wh, 10)
        }
      }
    },
    propertyOfbili() {
      return this.propertyOfnum.w
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'geoPost']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW',
      'SET_NEWCHART_BILI',
      'CHANGE_ACTIVEPROPERTY',
      'CHANGE_PROPERTYNUM',
      'CHANGE_POSITION',
      'ACTIVE_CHUNK'
    ]),
    tabChange(name) {
      this.classname = name
    },
    focus() {
      window.zindex = 0
    },
    blur() {
      window.zindex = 2
    },
    putextchange: _.debounce(function(e) {
      this.sendmessage()
    }, 300),
    wChange(value) {
      this.geoPost()
    },
    hChange(value) {
      this.sendmessage()
      // this.geoPost()
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
      this.CHANGE_POSITION({ way, target })
      this.geoPost()
    },
    togglefont(index, style) {
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
    async sendmessage() {
      this.ACTIVE_CHUNK({ chunk: this.activechunk.chunk })
      const res = await chunkUpdateFilterApi({
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.activechunk.chunk.filter
      })
      if (res.code !== 0) {
        this.$notify({
          title: '提示',
          type: 'error',
          message: '滤镜更新失败！',
          position: 'bottom-right',
          duration: this.notify.time
        })
      }
    }
  },
  mounted() {
    //   console.log(this.activechunk.chunk.filter)
    this.wh =
      this.activeProperty[this.propertyNum].w /
      this.activeProperty[this.propertyNum].h
    this.SET_NEWCHART_BILI(this.wh)
  }
}
</script>

<style></style>
