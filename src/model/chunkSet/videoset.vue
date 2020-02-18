<template>
  <div class="setContent-sel1 setContent-sel">
    <div class="content-sel-title">
      <div class="title-left">
        <span
          class="u-icon writepng"
          style="cursor:pointer"
          :class="this.classname == 'content-sel_O1' ? 'active' : ''"
          @click="tabChange('content-sel_O1')"
        ></span>
        <span
          class="u-icon setpng"
          style="cursor:pointer"
          :class="this.classname == 'content-sel_O2' ? 'active' : ''"
          @click="tabChange('content-sel_O2')"
        ></span>
        <span
          class="u-icon filterpng"
          style="cursor:pointer"
          :class="this.classname == 'content-sel_O3' ? 'active' : ''"
          @click="tabChange('content-sel_O3')"
        ></span>
      </div>
    </div>
    <div class="content-sel_O1" v-if="this.classname == 'content-sel_O1'">
      <div class="content-sel-option">
        <div class="sel-option">
          <div class="sel-option-name">旋转</div>
          <div class="sel-option-con ar">
            <div class="con_filter angle">
              <div
                class="u-icon xzfilter "
                style="width:60px;height:100%;float:left"
                @click="xzFilter"
              ></div>
              <input
                type="number"
                step="1"
                class="sty"
                style="width:40px;color:#61ded0;background-color:transparent;border:none;top:0;right:10px;height:100%"
                :value="this.filterList.rotate.parameter.value"
                @blur="rotateInputblur('value', $event.currentTarget)"
              />
              <i style="float:right;margin-right:5px;color:#61ded0">°</i>
            </div>
            <div class="con_filter ratio">
              <div class="sel-option-name" style="font-size:12px">缩放比</div>
              <div class="sel-option-con" style="width:calc(100% - 70px)">
                <div
                  style="float:right;position: relative;width:60px;height:100%"
                >
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    class="sty"
                    style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                    :value="this.filterList.rotate.parameter.scale"
                    @blur="rotateInputblur('scale', $event.currentTarget)"
                  />
                  <span style="float:right;color:#61ded0">%</span>
                </div>
                <div
                  style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
                >
                  <el-slider
                    v-model="filterList.rotate.parameter.scale"
                    @change="rotatescaleChange"
                    mini
                    :max="100"
                    :min="0"
                    :step="1"
                  ></el-slider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sel-option">
          <div class="sel-option-name">翻转</div>
          <div class="sel-option-con">
            <div
              class="u-icon con_filter jxfz"
              style="width:80px"
              @click="fzFilter('jx')"
            >
              <span>水平翻转</span>
            </div>
            <div
              class="u-icon con_filter czfz"
              style="width:80px"
              @click="fzFilter('cz')"
            >
              <span>垂直翻转</span>
            </div>
          </div>
        </div>
        <div class="sel-option">
          <div class="sel-option-name">马赛克</div>
          <div class="sel-option-con mosic-pos">
            <div
              class="u-icon con_filter mosaic"
              style="width:146px;height: 107px;background-size:135%;border-radius: 5px;display:flex;justify-content: flex-end;align-items: flex-end;"
              @click="mosaicShow"
            >
              <div
                style="width:26px;height:26px;background:#fff;border-radius: 13px;"
              >
                <div :class="this.filtershow == 'mosaic' ? 'active' : ''"></div>
              </div>
            </div>
            <div
              class="u-icon con_filter fastbur"
              style="width:146px;height: 107px;background-size:100%;display:flex;justify-content: flex-end;align-items: flex-end;"
              @click="fastblurShow"
            >
              <div
                style="width:26px;height:26px;background:#fff;border-radius: 13px;"
              >
                <div
                  :class="this.filtershow == 'fastblur' ? 'active' : ''"
                ></div>
              </div>
            </div>
          </div>
          <div
            v-if="filtershow == 'fastblur'"
            :style="{ padding: '0 0 0 126px' }"
          >
            <div class="sel-option">
              <div class="sel-option-name">模糊量</div>
              <div class="sel-option-con">
                <div
                  style="float:right;position: relative;width:60px;height:100%"
                >
                  <input
                    type="number"
                    class="sty"
                    max="100"
                    min="0"
                    step="1"
                    style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                    :value="blurV"
                    disabled
                  />
                  <span style="float:right;color:#61ded0"></span>
                </div>
                <div
                  style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
                >
                  <el-slider
                    v-model="blurV"
                    @change="fastblurVChange"
                    mini
                    :max="100"
                    :min="0"
                    :step="1"
                  ></el-slider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sel-option">
          <div class="sel-option-name">裁剪</div>
          <div class="sel-option-con">
            <div
              class="u-icon con_filter cutting"
              style="width:90px"
              @click="cuttingShow"
              :class="this.filtershow == 'cutting' ? 'active' : ''"
            ></div>
            <div
              style="height:100%;float:left"
              v-show="this.filtershow == 'cutting'"
            >
              <div
                style="borderLeft:2px solid #ccc;height:70%;position:relative;top:15%;width:0;float:left"
              ></div>
              <div
                class="u-icon con_filter cuttingWay"
                style="width:50px;margin: 0 0 0 15px"
                @click="cuttingsel(1)"
              >
                <span>形状</span>
              </div>
              <div
                class="u-icon con_filter cuttingSet"
                style="width:50px;margin: 0 0 0 15px"
                @click="cuttingsel(2)"
              >
                <span>参数</span>
              </div>
              <div
                class="u-icon con_filter delCutting"
                style="width:50px;margin: 0 0 0 15px"
                @click="cuttingsel(0)"
              >
                <span>取消</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-sel-option" style="padding:10px 100px 0">
        <div
          class="sel-option  sel-option-small"
          v-if="this.writeFlag == 1 && this.filtershow == 'cutting'"
        >
          <div class="sel-option-con">
            <div
              class="u-icon con_filter cuttingWay0"
              style="width:40px;margin:0 15px 0 38px"
              @click="changeCuttingway(0)"
            ></div>
            <div
              class="u-icon con_filter cuttingWay1"
              style="width:40px;margin:0 15px 0 0"
              @click="changeCuttingway(1)"
            ></div>
            <div
              class="u-icon con_filter cuttingWay2"
              style="width:40px;margin:0 15px 0 0"
              @click="changeCuttingway(2)"
            ></div>
            <div
              class="u-icon con_filter cuttingWay3"
              style="width:40px;margin:0 15px 0 0"
              @click="changeCuttingway(3)"
            ></div>
          </div>
        </div>
        <div
          class="sel-option sel-option-small"
          v-if="this.writeFlag == 2 && this.filtershow == 'cutting'"
        >
          <div class="sel-option-name" style="width:100px">边缘羽化度</div>
          <div
            class="sel-option-con"
            style="width:calc(100% - 100px);position:relative"
          >
            <span
              style="position:absolute;width:20px;float:left;text-align:center"
              >0</span
            >
            <div
              style="position: absolute;left:20px;width:calc(100% - 40px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.cutting.parameter.softness"
                :show-tooltip="false"
                @change="softnessChange"
                mini
                :max="1"
                :min="0"
                :step="0.01"
              ></el-slider>
            </div>
            <span
              style="position: absolute;width:20px;float:left;right:0;text-align:center"
              >1</span
            >
          </div>
        </div>
        <div class="sel-option sel-option-small" v-if="this.writeFlag == 10">
          <div class="sel-option-name" style="width:100px">裁剪框角度</div>
          <div
            class="sel-option-con"
            style="position:relative;width:calc(100% - 100px)"
          >
            <input
              type="number"
              step="1"
              class="sty"
              style="width:40px;color:#61ded0;background-color:transparent;top: 50%;transform: translate(0px, -50%);"
              :value="parseInt(this.filterList.cutting.parameter.rotate)"
              @blur="cutrotateInputblur($event.currentTarget)"
            />
            <i style="color:#61ded0;position:absolute;left:45px">°</i>
          </div>
        </div>
      </div>
      <div
        class="content-sel-option"
        v-if="
          this.activechunk.chunk.chunk_type == 1 ||
            this.activechunk.chunk.chunk_type == 2
        "
      >
        <div class="sel-option">
          <div class="sel-option-name">播放速率</div>
          <div
            class="sel-option-con"
            style="width:calc(100% - 132px);margin-left: 60px;"
          >
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
      </div>
    </div>
    <div class="content-sel_O2" v-if="this.classname == 'content-sel_O2'">
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
        <div class="sel-option">
          <span style="position:relative;top:2px;margin-right:10px"
            ><input type="checkbox" id="check1" v-model="setproperty"/><label
              for="check1"
            ></label></span
          ><span>同时设置基础动画</span>
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
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                max="200"
                min="0"
                v-model.number="setbili"
                @blur="wChange"
              />
              <span style="float:right;color:#61ded0">%</span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="setbili"
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
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                step="1"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                max="100"
                min="0"
                v-model.number="activeProperty[propertyNum].transparency"
                @blur="tmdChange"
              />
              <!-- :value = "this.propertyOfnum.transparency" -->
              <span style="float:right;color:#61ded0">%</span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="activeProperty[propertyNum].transparency"
                @change="tmdChange"
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
      </div>
      <div style="padding:0 13px">
        <span style="position:relative;top:2px;margin-right:10px"
          ><input type="checkbox" id="check2" v-model="quickposi"/><label
            for="check2"
          ></label></span
        ><span>快速定位</span>
        <quickposition v-if="this.quickposi"></quickposition>
      </div>
    </div>
    <div class="content-sel_O3" v-if="this.classname == 'content-sel_O3'">
      <div class="content-sel-option">
        <div class="sel-option">
          <div class="sel-option-name">亮度</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                min="0"
                max="200"
                step="1"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                :value="
                  parseInt(this.filterList.bcs.parameter.brightness * 100)
                "
                @blur="filterInputblur('brightness', $event.currentTarget)"
              />
              <span style="float:right;color:#61ded0"></span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.bcs.parameter.brightness"
                @change="brightnessChange"
                :show-tooltip="false"
                mini
                :max="2"
                :min="0"
                :step="0.01"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="content-sel-option">
        <div class="sel-option">
          <div class="sel-option-name">对比度</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                min="0"
                max="200"
                step="1"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                :value="parseInt(this.filterList.bcs.parameter.contrast * 100)"
                @blur="filterInputblur('contrast', $event.currentTarget)"
              />
              <span style="float:right;color:#61ded0"></span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.bcs.parameter.contrast"
                @change="contrastChange"
                :show-tooltip="false"
                mini
                :max="2"
                :min="0"
                :step="0.01"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="content-sel-option">
        <div class="sel-option">
          <div class="sel-option-name">饱和度</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                min="0"
                max="200"
                step="1"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                :value="
                  parseInt(this.filterList.bcs.parameter.saturation * 100)
                "
                @blur="filterInputblur('saturation', $event.currentTarget)"
              />
              <span style="float:right;color:#61ded0"></span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.bcs.parameter.saturation"
                @change="saturationChange"
                :show-tooltip="false"
                mini
                :max="2"
                :min="0"
                :step="0.01"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="content-sel-option">
        <div class="sel-option">
          <div class="sel-option-name">色调</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                min="10"
                max="150"
                step="1"
                class="sty"
                style="color:#61ded0;background-color:transparent;border:none;top:0;height:100%"
                :value="parseInt(this.filterList.coloring.parameter.value)"
                @blur="filterInputblur('coloring', $event.currentTarget)"
              />
              <span style="float:right;color:#61ded0"></span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.coloring.parameter.value"
                @change="coloringChange"
                mini
                :max="150"
                :min="10"
                :step="1"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="content-sel-option">
        <div class="sel-option3 clearfix">
          <div class="sel-option-name">滤镜</div>
          <div class="sel-option-con">
            <div
              class="con_filter filter_normal"
              :class="isNormal"
              @click="changeFilter('normal')"
              style="width:120px;margin:0 15px 20px"
            >
              <span class="filter_title">原图</span>
            </div>
            <div
              class="con_filter filter_mohu"
              :class="isMohu"
              @click="changeFilter('mohu')"
              style="width:120px;margin:0 15px 20px"
            >
              <span class="filter_title">模糊</span>
            </div>
            <div
              class="con_filter filter_puguang"
              :class="isPuguang"
              @click="changeFilter('puguang')"
              style="width:120px;margin:0 15px 20px"
            >
              <span class="filter_title">负片</span>
            </div>
            <div
              class="con_filter filter_blackwhite"
              :class="isBlackwhite"
              @click="changeFilter('blackwhite')"
              style="width:120px;margin:0 15px 20px"
            >
              <span class="filter_title">黑白</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="content-sel-option"
        style="padding:10px 100px 0"
        v-if="isMohu"
      >
        <div class="sel-option">
          <div class="sel-option-name">横向模糊</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                class="sty"
                style="color:#909090;background-color:transparent;border:none;top:0;height:100%"
                disabled
                :value="parseInt(this.filterList.boxblur.parameter.h)"
              />
              <span style="float:right;"></span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.boxblur.parameter.h"
                @change="hboxblurChange"
                mini
                :max="100"
                :min="1"
                :step="1"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content-sel-option"
        style="padding:10px 100px 0"
        v-if="isMohu"
      >
        <div class="sel-option">
          <div class="sel-option-name">纵向模糊</div>
          <div class="sel-option-con">
            <div style="float:right;position: relative;width:60px;height:100%">
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                class="sty"
                style="color:#909090;background-color:transparent;border:none;top:0;height:100%"
                disabled
                :value="parseInt(this.filterList.boxblur.parameter.v)"
              />
              <span style="float:right;"></span>
            </div>
            <div
              style="position: relative;width:calc(100% - 80px);height:38px;top:50%;transform:translate(0,-50%)"
            >
              <el-slider
                v-model="filterList.boxblur.parameter.v"
                @change="vboxblurChange"
                mini
                :max="100"
                :min="1"
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
import timerdian from './timerdian'
import quickposition from './quickPosition'
import { chunkUpdateFilterApi, chunkAddFilterApi } from '@/api/Chunk'
export default {
  data: function() {
    return {
      classname: 'content-sel_O1',
      sel: false,
      writeFlag: 0,
      setproperty: false,
      quickposi: false,
      speed: 1,
      wh: 1,
      billVal: 0
      // 'key':0,
    }
  },
  components: {
    timerdian,
    quickposition
  },
  created: function() {},
  //   watch:{
  //       mosaicKey:function(n){
  //           this.mosaicKey = n
  //       }
  //   },
  destroyed() {
    this.CHANGE_PROPERTYNUM(0)
  },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'mosaicKey',
      'systemmessage',
      'propertyNum',
      'isAsyncSetchart'
    ]),
    loadingShow: function() {
      return this.startloading || this.onloading
    },
    filterList: function() {
      // 格式化滤镜数据
      const filter = this.activechunk.chunk.filter
      const data = {}
      let key = 0
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
              key = i
            } else {
              data.mosaic[i] = filter[i]
              key = i
            }
            break
          }
          case 'fastblur': {
            // debugger
            if (!data.mosaic) {
              data.mosaic = {}
              data.mosaic[i] = filter[i]
              key = i
            } else {
              data.mosaic[i] = filter[i]
              key = i
            }
            break
          }
          default: {
            data[filter[i].service] = filter[i]
          }
        }
      }
      // this.SET_CHANGE_FILTERSHOW_KEY(key)
      return data
    },
    propertyOfnum: function() {
      return this.activeProperty[this.propertyNum]
    },
    setbili: {
      get: function() {
        if (this.isAsyncSetchart) {
          this.billVal =
            this.wh >= 1
              ? this.activeProperty[this.propertyNum].w
              : this.activeProperty[this.propertyNum].h
          return this.billVal
        }
        return this.billVal
      },
      set: function(newValue) {
        if (this.wh >= 1) {
          this.activeProperty[this.propertyNum].w = parseInt(newValue)
          this.activeProperty[this.propertyNum].h = parseInt(newValue / this.wh)
        } else {
          this.activeProperty[this.propertyNum].h = parseInt(newValue)
          this.activeProperty[this.propertyNum].w = parseInt(newValue * this.wh)
        }
      }
    },
    isNormal: function() {
      if (
        this.filterList.grayscale.parameter.disable == 1 &&
        this.filterList.exposure.parameter.disable == 1 &&
        this.filterList.boxblur.parameter.disable == 1
      ) {
        return 'activ'
      } else {
        return ''
      }
    },
    isPuguang: function() {
      if (this.filterList.exposure.parameter.disable == 0) {
        return 'activ'
      } else {
        return ''
      }
    },
    isMohu: function() {
      if (this.filterList.boxblur.parameter.disable == 0) {
        return 'activ'
      } else {
        return ''
      }
    },
    isBlackwhite: function() {
      if (this.filterList.grayscale.parameter.disable == 0) {
        return 'activ'
      } else {
        return ''
      }
    },
    blurV: {
      get: function() {
        if (this.mosaicKey) {
          return this.filterList.mosaic[this.mosaicKey].parameter.v
        }
        return 40
      },
      set: function(newValue) {
        if (this.mosaicKey) {
          this.activechunk.chunk.filter[this.mosaicKey].parameter.v = newValue
        }
      }
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
          newValue * this.systemmessage.player.fps
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
          newValue * this.systemmessage.player.fps
        )
      }
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW',
      'SET_CHANGE_FILTERSHOW_KEY',
      'ACTIVE_CHUNK',
      'SET_NEWCHART_BILI',
      'CHANGE_ACTIVEPROPERTY',
      'CHANGE_PROPERTYNUM'
    ]),
    tabChange: function(name) {
      // 导航切换
      if (name != 'content-sel_O1') {
        this.CHANGE_FILTERSHOW('normal')
      }
      this.classname = name
    },
    filterInputblur(type, target) {
      switch (type) {
        case 'brightness': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.brightness =
            parseInt(target.value) / 100
          break
        }
        case 'contrast': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.contrast = parseInt(target.value) / 100
          break
        }
        case 'saturation': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.saturation =
            parseInt(target.value) / 100
          break
        }
        case 'coloring': {
          this.filterList.bcs.parameter.disable = 0
          this.filterList.bcs.parameter.brightness = parseInt(target.value)
          break
        }
        case 'volume': {
          this.filterList.volume.parameter.disable = 0
          this.filterList.volume.parameter.value = parseInt(target.value) / 100
          break
        }
        case 'volume_fade_in':
          this.filterList.volume.parameter.disable = 0
          // this.fade_in = target.value
          this.filterList.volume.parameter.fade_in = parseInt(
            target.value * this.systemmessage.player.fps
          )
          // this.filterList.volume.parameter.fade_in = parseInt(target.value) / 100
          break

        case 'volume_fade_out':
          this.filterList.volume.parameter.disable = 0
          // this.fade_out = target.value
          this.filterList.volume.parameter.fade_out = parseInt(
            target.value * this.systemmessage.player.fps
          )
          // this.filterList.volume.parameter.fade_out = parseInt(target.value) / 100
          break
      }
      this.sendmessage()
    },
    speedwayChange() {
      this.activechunk.chunk.speed = -this.activechunk.chunk.speed
      this.speedChange(this.speed)
    },
    speedChange(value) {
      // 改变播放速率
      if (this.activechunk.chunk.speed < 0) {
        value = -value
      }

      this.ACTIVE_CHUNK({ speed: value })
      // this.activechunk.chunk.speed = value
      const that = this
      const data = {};
(data.type = 'chunk'),
        (data.data = {
          cmd: 'update_speed',
          chunk_id: this.activechunk.chunk.chunk_id,
          speed: value
        })
      data.success = function(res) {}
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
      // this.sendmessage()
    },
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
      };
(data.success = function() {}), (data.error = function() {})
      this.Post(data)
    },
    wChange(value) {
      this.tmdChange()
    },
    hChange(value) {
      this.tmdChange()
    },
    changePosition(way, target) {
      if (target.value == '') {
        target.value = 0
      } else {
        target.value = parseInt(target.value)
      }

      if (way == 'x') {
        var num = (parseInt(target.value) * 100) / this.systemmessage.player.w
        this.activeProperty[this.propertyNum].left = num
      }
      if (way == 'y') {
        num = (parseInt(target.value) * 100) / this.systemmessage.player.h
        this.activeProperty[this.propertyNum].top = num
      }
      this.tmdChange()
    },
    closeVol() {
      // 一键静音
      if (this.filterList.volume.parameter.value == 0) {
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
    hboxblurChange(value) {
      this.filterList.boxblur.parameter.h = value
      this.filterList.boxblur.parameter.disable = 0
      this.sendmessage()
    },
    vboxblurChange(value) {
      this.filterList.boxblur.parameter.v = value
      this.filterList.boxblur.parameter.disable = 0
      this.sendmessage()
    },
    rotatescaleChange(value) {
      this.filterList.rotate.parameter.scale = value
      this.filterList.rotate.parameter.disable = 0
      this.sendmessage()
    },
    brightnessChange(value) {
      this.filterList.bcs.parameter.disable = 0
      this.filterList.bcs.parameter.brightness = value
      this.sendmessage()
    },
    contrastChange(value) {
      this.filterList.bcs.parameter.disable = 0
      this.filterList.bcs.parameter.contrast = value
      this.sendmessage()
    },
    saturationChange(value) {
      this.filterList.bcs.parameter.disable = 0
      this.filterList.bcs.parameter.saturation = value
      this.sendmessage()
    },
    coloringChange(value) {
      this.filterList.coloring.parameter.disable = 0
      this.filterList.coloring.parameter.value = value
      this.sendmessage()
    },
    softnessChange(value) {
      if (value == 0) {
        value = 0.02
      }
      this.filterList.cutting.parameter.softness = value
      this.sendmessage()
    },
    xzFilter: function() {
      let value = parseInt(this.filterList.rotate.parameter.value)
      value = (value + 45) % 360
      this.filterList.rotate.parameter.value = value
      this.filterList.rotate.parameter.disable = 0
      this.UPDATE_ACTIVEFILTER(this.activechunk.chunk.filter)
      this.sendmessage()
    },
    getfilter: function(service) {
      // 获取指定滤镜的数据
      const filterArr = this.activechunk.chunk.filter
      for (let i = 0; i < filterArr.length; i++) {
        if (filterArr[i].service == service) {
          return filterArr[i]
        }
      }
    },
    mosaicShow() {
      if (this.filtershow != 'mosaic') {
        this.CHANGE_FILTERSHOW('mosaic')
        if (this.mosaicKey) {
          this.addOrUpdateFilter(
            'mosaic',
            this.activechunk.chunk.filter[this.mosaicKey].parameter
          )
        }
      } else {
        this.SET_CHANGE_FILTERSHOW_KEY(null)
        this.CHANGE_FILTERSHOW('normal')
      }
    },
    fastblurShow() {
      if (this.filtershow != 'fastblur') {
        this.CHANGE_FILTERSHOW('fastblur')
        if (this.mosaicKey) {
          this.addOrUpdateFilter(
            'fastblur',
            this.activechunk.chunk.filter[this.mosaicKey].parameter
          )
        }
      } else {
        this.SET_CHANGE_FILTERSHOW_KEY(null)
        this.CHANGE_FILTERSHOW('normal')
      }
    },
    fastblurVChange(value) {
      // this.activechunk.chunk.filter[this.mosaicKey].parameter.v = value
      this.activechunk.chunk.filter[this.mosaicKey].parameter.disable = 0
      this.sendmessage()
    },
    addOrUpdateFilter(filtershow, parameter) {
      let num = 0,
        key = 0
      this.activechunk.chunk.filter[this.mosaicKey].parameter.disable = 1
      for (const i in this.filterList.mosaic) {
        if (
          this.filterList.mosaic[i].service == filtershow &&
          this.filterList.mosaic[i].parameter.disable == 1
        ) {
          key = i
          this.activechunk.chunk.filter[i].parameter = {
            w: parameter.w, // 区域宽百分比
            h: parameter.h, // 区域高百分比
            v: parameter.v ? parameter.v : 40,
            left: parameter.left, // 区域左边距离百分比
            top: parameter.top, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
          num++
        }
      }
      if (num == 0 && filtershow == 'mosaic') {
        key = this.activechunk.chunk.filter.length
        this.activechunk.chunk.filter.push({
          service: 'mosaic',
          name: '马赛克',
          type: 1,
          parameter: {
            w: parameter.w, // 区域宽百分比
            h: parameter.h, // 区域高百分比
            v: parameter.v ? parameter.v : 40,
            left: parameter.left, // 区域左边距离百分比
            top: parameter.top, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
        })
      } else if (num == 0 && filtershow == 'fastblur') {
        key = this.activechunk.chunk.filter.length
        this.activechunk.chunk.filter.push({
          service: 'fastblur',
          name: '快速模糊',
          type: 1,
          parameter: {
            w: parameter.w, // 区域宽百分比
            h: parameter.h, // 区域高百分比
            v: parameter.v ? parameter.v : 40,
            left: parameter.left, // 区域左边距离百分比
            top: parameter.top, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
        })
      }

      this.SET_CHANGE_FILTERSHOW_KEY(key)
      if (num == 0) {
        this.addFilter(this.activechunk.chunk.filter[key])
      } else {
        this.sendmessage()
      }
    },
    cuttingShow() {
      if (this.filterList.cutting.parameter.disable == 1) {
        this.filterList.cutting.parameter.disable = 0
        this.sendmessage()
      }
      if (this.filtershow != 'cutting') {
        this.CHANGE_FILTERSHOW('cutting')
      } else {
        this.CHANGE_FILTERSHOW('normal')
      }
    },
    changeFilter: function(type) {
      // 改变颜色滤镜的种类
      switch (type) {
        case 'normal': {
          this.filterList.boxblur.parameter.disable = 1
          this.filterList.exposure.parameter.disable = 1
          this.filterList.grayscale.parameter.disable = 1
          break
        }
        case 'mohu': {
          this.filterList.boxblur.parameter.disable = 0
          this.filterList.exposure.parameter.disable = 1
          this.filterList.grayscale.parameter.disable = 1
          break
        }
        case 'puguang': {
          this.filterList.boxblur.parameter.disable = 1
          this.filterList.exposure.parameter.disable = 0
          this.filterList.grayscale.parameter.disable = 1
          break
        }
        case 'blackwhite': {
          this.filterList.boxblur.parameter.disable = 1
          this.filterList.exposure.parameter.disable = 1
          this.filterList.grayscale.parameter.disable = 0
          break
        }
      }
      this.sendmessage()
    },
    rotateInputblur(service, target) {
      const that = this
      switch (service) {
        case 'value': {
          if (target.value == '') {
            target.value = parseFloat(that.filterList.rotate.parameter.value)
            break
          }
          var num = parseFloat(target.value)
          if (num >= 360) {
            target.value = parseInt(num - 360)
            break
          }
          if (num < 0) {
            target.value = parseInt(num + 360)
            break
          }
          target.value = parseInt(target.value)
          this.filterList.rotate.parameter.value = parseInt(target.value)
          break
        }
        case 'scale': {
          if (target.value == '') {
            target.value = parseInt(that.filterList.rotate.parameter.scale)
          }
          var num = parseFloat(target.value)
          if (num > 300) {
            target.value = 300
            break
          }
          if (num < 0) {
            target.value = 0
            break
          }
          target.value = parseInt(target.value)
          this.filterList.rotate.parameter.scale = parseInt(target.value)
          break
        }
      }
      this.filterList.rotate.parameter.disable = 0

      this.sendmessage()
    },
    cuttingsel(index) {
      this.writeFlag = index
      if (index == 0) {
        this.CHANGE_FILTERSHOW('normal')
        this.filterList.cutting.parameter.disable = 1
        this.sendmessage()
      }
    },
    changeCuttingway(index) {
      this.filterList.cutting.parameter.shape = index
      this.sendmessage()
    },
    cutrotateInputblur() {},
    fzFilter(way) {
      if (way == 'cz') {
        for (const key in this.filterList.mirror) {
          if (this.filterList.mirror[key].parameter.value == 6) {
            if (this.filterList.mirror[key].parameter.disable == 1) {
              this.filterList.mirror[key].parameter.disable = 0
            } else {
              this.filterList.mirror[key].parameter.disable = 1
            }
          }
        }
      } else {
        for (const k in this.filterList.mirror) {
          if (this.filterList.mirror[k].parameter.value == 5) {
            if (this.filterList.mirror[k].parameter.disable == 1) {
              this.filterList.mirror[k].parameter.disable = 0
            } else {
              this.filterList.mirror[k].parameter.disable = 1
            }
          }
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
      if (res.code === 0) {
      }
      if (res.code !== 0) {
        this.$notify({
          title: '提示',
          type: 'error',
          message: '操作失败！',
          position: 'bottom-right',
          duration: this.notify.time
        })
      }
    },
    async addFilter(obj) {
      const res = await chunkAddFilterApi({
        chunk_id: this.activechunk.chunk.chunk_id,
        filter: obj
      })
      if (res.code === 0) {
      }
      if (res.code !== 0) {
        console.warn(res.msg)
      }
    }
  },
  mounted: function() {
    this.wh =
      this.activeProperty[this.propertyNum].w /
      this.activeProperty[this.propertyNum].h
    this.SET_NEWCHART_BILI(this.wh)
    this.speed = Math.abs(this.activechunk.chunk.speed)
    this.setproperty = this.activeProperty.length > 1
  },
  beforeDestroy() {
    this.SET_CHANGE_FILTERSHOW_KEY(null)
  }
}
</script>
