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
          <div
            class="option-text"
            v-for="(filter, index) in filterTextData"
            :key="index"
          >
            <div class="text-title">文字{{ index + 1 }}</div>
            <div class="text-style">
              <fontpick :index="index"></fontpick>
              <input
                type="number"
                min="0"
                v-model="filter.size"
                @input="fontsizeinput(index, $event.currentTarget)"
                class="font-size-set"
              />
              <div class="font-options">
                <div
                  class="font-width font-option"
                  :class="filter.weight > 500 ? 'active' : ''"
                  @click="togglefont(index, 'weight')"
                ></div>
                <div
                  class="font-style font-option"
                  :class="filter.style != 'normal' ? 'active' : ''"
                  @click="togglefont(index, 'style')"
                ></div>
              </div>
              <div class="font-text-color">
                <span>字体颜色：</span>
                <colorpick :index="index" :type="'font'"></colorpick>
              </div>
            </div>
            <div class="text-content">
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
              <div class="length-mark">
                <span v-html="filterTextData[index].text.length"></span>/
                <span v-html="maxlength"></span>
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
        <div class="sel-option">
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
          <div class="sel-option">
            <div class="sel-option-name">比例</div>
            <div class="sel-option-con">
              <div
                style="float:right;position: relative;width:60px;height:100%"
              >
                <input
                  type="number"
                  class="sty"
                  style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
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
          <div class="sel-option">
            <div class="sel-option-name">透明度</div>
            <div class="sel-option-con">
              <div
                style="float:right;position: relative;width:60px;height:100%"
              >
                <input
                  type="number"
                  step="1"
                  class="sty"
                  style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                  v-model.number="activeProperty[propertyNum].transparency"
                  @blur="geoPost"
                />
                <span style="float:right;color:#61ded0">%</span>
              </div>
              <div
                style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
              >
                <el-slider
                  v-model="activeProperty[propertyNum].transparency"
                  @change="geoPost"
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
              <div
                style="float:left;position: relative;height:100%;width:130px"
              >
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
              <div
                style="float:left;position: relative;height:100%;width:130px"
              >
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
  data() {
    return {
      classname: 'content-sel_O1',
      maxlength: 100,
      setproperty: true,
      quickposi: true,
      wh: 1,
      billVal: 0,
      blocked: false,
      copyFilter: {},
      activeSetTab: 'animate'
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
    bili: {
      get() {
        if (this.isAsyncSetchart) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.billVal =
            this.wh >= 1 ? this.propertyOfnum.w : this.propertyOfnum.h
          return this.billVal
        }
        return this.billVal
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
    },
    filterTextData() {
      return this.activechunk.chunk.filter.filter(item => item.type === 2)
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'geoPost']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW',
      'CHANGE_ACTIVEPROPERTY',
      'CHANGE_PROPERTYNUM',
      'SET_NEWCHART_BILI',
      'UPDATE_ALLOW_HISTORY_BACK',
      'CHANGE_POSITION'
    ]),
    textareaChange(target) {
      // if(this.activechunk.chunk.filter[0].geometry_template == undefined){
      //     target.value = target.value.substr(0,100)
      // }else{
      //     target.value = target.value.substr(0,1000)
      // }
    },
    tabChange(name) {
      this.classname = name
    },
    focus() {
      window.zindex = 0
    },
    blur() {
      window.zindex = 2
    },
    tetextchange: _.debounce(function(index, target) {
      this.filterTextData[index].text = target.value
      this.sendmessage()
    }, 500),
    wChange(value) {
      this.geoPost()
    },
    hChange(value) {
      this.geoPost()
    },
    fontsizeinput(index, target) {
      if (target.value === '') {
        this.filterTextData[index].size = 0
      } else {
        this.filterTextData[index].size = parseInt(target.value, 10)
      }
      this.sendmessage()
    },
    changePosition(way, target) {
      this.CHANGE_POSITION({ way, target })
      this.geoPost()
    },
    togglefont(index, style) {
      if (style === 'weight') {
        if (this.filterTextData[index].weight === 500) {
          this.filterTextData[index].weight = 600
        } else {
          this.filterTextData[index].weight = 500
        }
      }
      if (style === 'style') {
        if (this.filterTextData[index].style === 'normal') {
          this.filterTextData[index].style = 'italic'
        } else {
          this.filterTextData[index].style = 'normal'
        }
      }
      this.sendmessage()
    },
    sendmessage(callback) {
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
            duration: this.notify.time
          })
        })
    },
    restore() {
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
  mounted() {
    this.wh =
      this.activeProperty[this.propertyNum].w /
      this.activeProperty[this.propertyNum].h
    this.SET_NEWCHART_BILI(this.wh)
    this.copyFilter = JSON.parse(JSON.stringify(this.activechunk.chunk.filter))
  }
}
</script>

<style></style>
