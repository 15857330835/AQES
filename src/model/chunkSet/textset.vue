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
      ref="bscroll"
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
              <fontpick :index="filter.fromIndex"></fontpick>
              <input
                type="number"
                min="0"
                v-model="filter.size"
                @input="fontsizeinput(filter.fromIndex, $event.currentTarget)"
                class="font-size-set"
              />
              <div class="font-options">
                <div
                  class="font-width font-option"
                  :class="filter.weight > 500 ? 'active' : ''"
                  @click="togglefont(filter.fromIndex, 'weight')"
                ></div>
                <div
                  class="font-style font-option"
                  :class="filter.style != 'normal' ? 'active' : ''"
                  @click="togglefont(filter.fromIndex, 'style')"
                ></div>
              </div>
              <div class="font-text-color">
                <span>字体颜色：</span>
                <colorpick :index="filter.fromIndex" :type="'font'"></colorpick>
              </div>
              <div class="font-box-color">
                <span>背景色：</span>
                <colorpick
                  :index="filter.fromIndex"
                  :type="'backg'"
                ></colorpick>
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
                @input="tetextchange(filter.fromIndex, $event.currentTarget)"
                @blur="blur"
              ></textarea>
              <div class="length-mark">
                <span v-html="filterTextData[index].text.length"></span>/
                <span v-html="maxlength"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="animate-option-groups">
          <div
            class="option-text"
            v-for="(filter, index) in filterRectData"
            :key="index"
          >
            <div class="text-title">元素{{ index + 1 }}</div>
            <div class="text-style">
              <div class="font-box-color">
                <span>{{ filter.name }}：</span>
                <colorpick
                  :index="filter.fromIndex"
                  :type="'srcFrom'"
                ></colorpick>
              </div>
            </div>
          </div>
        </div>
        <div class="animate-option-groups">
          <div
            class="option-text"
            v-for="(filter, index) in filterLineData"
            :key="index"
          >
            <div class="text-title">
              元素{{ index + 1 + lineBaseFromCount }}
            </div>
            <div class="text-style">
              <div class="font-box-color">
                <span>{{ filter.name }}：</span>
                <colorpick
                  :index="filter.fromIndex"
                  :type="'srcFrom'"
                ></colorpick>
              </div>
            </div>
          </div>
        </div>
        <div class="animate-option-groups">
          <div
            class="option-text"
            v-for="(filter, index) in filterImgData"
            :key="index"
          >
            <div class="text-title">元素{{ index + 1 + imgBaseFromCount }}</div>
            <div class="image-box">
              <img
                class="image-box-content"
                :src="'https://' + filter.from"
                alt=""
              />
              <button
                class="image-box-button"
                @click="myDirDialogHandler(true, filter.fromIndex)"
              >
                更换图片
              </button>
              <div
                class="image-reback"
                @click="rebackHandler(index)"
                title="重置图片"
              ></div>
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
            <div class="sel-option-name">宽度</div>
            <div class="sel-option-con">
              <div
                style="float:right;position: relative;width:60px;height:100%"
              >
                <input
                  type="number"
                  class="sty"
                  style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                  max="200"
                  min="0"
                  v-model.number="activeGeo.w"
                  @blur="wChange"
                />
                <span style="float:right;color:#61ded0">%</span>
              </div>
              <div
                style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
              >
                <el-slider
                  v-model="activeGeo.w"
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
            <div class="sel-option-name">高度</div>
            <div class="sel-option-con">
              <div
                style="float:right;position: relative;width:60px;height:100%"
              >
                <input
                  type="number"
                  class="sty"
                  style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                  max="200"
                  min="0"
                  v-model.number="activeGeo.h"
                  @blur="hChange"
                />
                <span style="float:right;color:#61ded0">%</span>
              </div>
              <div
                style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
              >
                <el-slider
                  v-model="activeGeo.h"
                  @change="hChange"
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
import BScroll from 'better-scroll'

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
      activeSetTab: 'animate',
      aBScroll: null
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
    activeGeo() {
      return this.activeProperty[this.propertyNum]
    },
    filterData() {
      return this.activechunk.chunk.filter
    },
    filterImgData() {
      return this.filterData.filter(item => item.module_type === 1)
    },
    filterVideoData() {
      return this.filterData.filter(item => item.module_type === 2)
    },
    filterTextData() {
      return this.filterData.filter(item => item.type === 2)
    },
    filterRectData() {
      return this.filterData.filter(item => item.module_type === 4)
    },
    filterLineData() {
      return this.filterData.filter(item => item.module_type === 5)
    },
    lineBaseFromCount() {
      return this.filterRectData.length
    },
    imgBaseFromCount() {
      return this.filterRectData.length + this.filterLineData.length
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
      'UPDATE_ALLOW_HISTORY_BACK',
      'CHANGE_POSITION',
      'CHANGE_MY_DIR_DIALOG_SHOW',
      'CHANGE_FILTER_INDEX'
    ]),
    myDirDialogHandler(flag, index) {
      this.CHANGE_MY_DIR_DIALOG_SHOW(flag)
      this.CHANGE_FILTER_INDEX(index)
    },
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
      this.filterData[index].text = target.value
      this.sendmessage()
    }, 500),
    wChange(value) {
      if (this.activeGeo.w <= 1) {
        this.activeGeo.w = 1
      }
      this.geoPost()
    },
    hChange(value) {
      if (this.activeGeo.h <= 1) {
        this.activeGeo.h = 1
      }
      this.geoPost()
    },
    fontsizeinput(index, target) {
      if (target.value === '') {
        this.filterData[index].size = 0
      } else {
        this.filterData[index].size = parseInt(target.value, 10)
      }
      this.sendmessage()
    },
    changePosition(way, target) {
      this.CHANGE_POSITION({ way, target })
      this.geoPost()
    },
    togglefont(index, style) {
      if (style === 'weight') {
        if (this.filterData[index].weight === 500) {
          this.filterData[index].weight = 600
        } else {
          this.filterData[index].weight = 500
        }
      }
      if (style === 'style') {
        if (this.filterData[index].style === 'normal') {
          this.filterData[index].style = 'italic'
        } else {
          this.filterData[index].style = 'normal'
        }
      }
      this.sendmessage()
    },
    sendmessage(callback) {
      this.UPDATE_ALLOW_HISTORY_BACK(false)
      chunkUpdateFilterApi({
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.activechunk.chunk.filter
      })
        .then(res => {
          if (res.code === 0) {
            this.UPDATE_ALLOW_HISTORY_BACK(true)
          } else {
            console.warn(res.msg)
          }
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            type: 'error',
            message: '操作失败！',
            position: 'bottom-right',
            duration: this.notify.time
          })
        })
    },
    restore() {
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
          this.$notify({
            title: '提示',
            type: 'error',
            message: '操作失败！',
            position: 'bottom-right',
            duration: this.notify.time
          })
        })
    },
    rebackHandler(index) {
      this.filterImgData[index].from = this.filterImgData[
        index
      ].extend_parameter[0].src_img
      this.sendmessage()
    }
  },
  mounted() {
    this.copyFilter = JSON.parse(JSON.stringify(this.activechunk.chunk.filter))

    this.$nextTick(() => {
      const bscrollDom = this.$refs.bscroll
      this.aBScroll = new BScroll(bscrollDom, {
        mouseWheel: true,
        click: true,
        tap: true,
        scrollbar: {
          fade: true,
          interactive: true
        }
      })
    })
  }
}
</script>

<style></style>
