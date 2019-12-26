<template>
  <div
    class="bsscroll exportVideoSet"
    ref="bscroll"
    :style="{
      width: 'calc(' + this.videoselw + ' - 10px)',
      height: this.videoHeight_ + 'px'
    }"
  >
    <div class="bscroll-container">
      <div class="header">导出视频设置</div>
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        size="mini"
        style="margin-top: 20px;"
        class="form"
        ref="form"
      >
        <el-form-item label="视频名称" style="width: 70%;" prop="mss_title">
          <el-input
            v-model="form.mss_title"
            @focus="blockShortcuts"
            @blur="unblockShortcuts"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频格式">
          <el-select v-model="form.out_file_type">
            <el-option label="m3u8" value="m3u8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率">
          <el-select
            v-if="!is9_16"
            v-model="form.resolution"
            @change="handleResolutionChange"
          >
            <el-option
              v-for="item in real_resolution_16_9"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
            <!-- <el-option label='4k' value='3840*2160'></el-option>
            <el-option label='2k' value='2560*1440'></el-option>
            <el-option label='1920*1080' value='1920*1080'></el-option>
            <el-option label="1280*720" value="1280*720"></el-option>
            <el-option label="640*360" value="640*360"></el-option> -->
          </el-select>
          <el-select
            v-else
            v-model="form.resolution"
            @change="handleResolutionChange"
          >
            <el-option
              v-for="item in real_resolution_9_16"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
            <!-- <el-option label='4k' value='2160*3840'></el-option>
            <el-option label='2k' value='1440*2560'></el-option>
            <el-option label='1080*1920' value='1080*1920'></el-option>
            <el-option label="720*1280" value="720*1280"></el-option>
            <el-option label="360*640" value="360*640"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="视频编码">{{ form.v_codec }}</el-form-item>
        <el-form-item label="音频编码">{{ form.a_codec }}</el-form-item>
        <el-form-item label="输出模式">
          <el-select v-model="form.export_model">
            <el-option label="固定码率" :value="0"></el-option>
            <el-option label="固定质量" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label
          v-if="form.export_model == 1"
          style="max-width: 80%;"
        >
          <el-slider
            class="silder"
            style="transform: translateY(-5px);width: 200px;"
            v-model="form.quality"
            mini
            :max="0.65"
            :min="0"
            :step="0.01"
            :marks="marks"
          ></el-slider>
          <div class="quality-tip">固定质量越大，输出质量越高</div>
        </el-form-item>
        <div v-if="form.export_model == 0" style="width:200px;">
          <el-form-item label="视频码率" prop="vb">
            <el-input
              v-model="form.vb"
              @focus="blockShortcuts"
              @blur="unblockShortcuts"
            >
              <i slot="suffix" style>Kbps</i>
            </el-input>
          </el-form-item>
          <el-form-item label="音频码率" prop="ab">
            <el-input
              v-model="form.ab"
              @focus="blockShortcuts"
              @blur="unblockShortcuts"
            >
              <i slot="suffix" class>Kbps</i>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="export-tip">
        <span class="u-icon"></span>
        请调节输出时长去确认视频生成范围，无需调节可直接确认生成！
      </div>
      <div class="footer">
        <el-button
          type="primary btn"
          @click="handleComfirmBtnClick"
          :loading="confirmBtnLocked"
          >{{ confirmBtnLocked ? '请稍等' : '确认导出' }}</el-button
        >
        <el-button class="dark-btn btn" @click="handleCancleBtnClick"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { trackPropertyAppendApi } from '@/api/Track'
import { producerAddApi } from '@/api/Producer'
import BScroll from 'better-scroll'

export default {
  components: {},
  props: {},
  data() {
    return {
      confirmBtnLocked: false,
      marks: {
        0: '0',
        0.45: '正常画质',
        0.65: '无损'
      },
      is9_16: false,
      resolutions: {
        '3840*2160': {
          v_w: 3840,
          v_h: 2160,
          vb: 18000
        },
        '2560*1440': {
          v_w: 2560,
          v_h: 1440,
          vb: 8000
        },
        '1920*1080': {
          v_w: 1920,
          v_h: 1080,
          vb: 3000
        },
        '1280*720': {
          v_w: 1280,
          v_h: 720,
          vb: 1500
        },
        '640*360': {
          v_w: 640,
          v_h: 360,
          vb: 600
        },
        '2160*3840': {
          v_w: 2160,
          v_h: 3840,
          vb: 18000
        },
        '1440*2560': {
          v_w: 1440,
          v_h: 2560,
          vb: 8000
        },
        '1080*1920': {
          v_w: 1080,
          v_h: 1920,
          vb: 3000
        },
        '720*1280': {
          v_w: 720,
          v_h: 1280,
          vb: 1500
        },
        '360*640': {
          v_w: 360,
          v_h: 640,
          vb: 600
        }
      },
      resolution_16_9: [
        '3840*2160',
        '2560*1440',
        '1920*1080',
        '1280*720',
        '640*360'
      ],
      resolution_9_16: [
        '2160*3840',
        '1440*2560',
        '1080*1920',
        '720*1280',
        '360*640'
      ],
      form: {
        name: '',
        out_file_type: 'm3u8',
        resolution: '请选择',
        v_codec: 'h264',
        a_codec: 'aac',
        export_model: 0, // 0固定码率 1固定质量
        quality: 0.45,
        vb: '',
        ab: 128,
        r: 25,
        mss_title: '',
        mss_stream: ''
      },
      rules: {
        mss_title: [
          { required: true, message: '请输入导出视频名称', trigger: 'blur' }
        ],
        vb: [{ required: true, message: '请输入视频码率', trigger: 'blur' }],
        ab: [{ required: true, message: '请输入音频码率', trigger: 'blur' }]
      }
    }
  },
  watch: {},
  computed: {
    ...mapState(['clientwidth', 'trackStart', 'trackEnd', 'systemmessage']),
    // ...mapGetters(["videoHeight"]),
    track_property() {
      return this.$store.state.all.track_property
    },
    videoselw: function() {
      if (this.clientwidth >= 1440) {
        return 100 - this.track_property.fanwei['1920'].now * 100 + '%'
      } else {
        return 100 - this.track_property.fanwei['1440'].now * 100 + '%'
      }
    },
    videoHeight_: function() {
      if (this.clientwidth >= 1440) {
        return (
          ((this.clientwidth - 36) *
            this.track_property.fanwei['1920'].now *
            9) /
            16 +
          67
        )
      } else {
        return (
          ((this.clientwidth - 36) *
            this.track_property.fanwei['1440'].now *
            9) /
            16 +
          67
        )
      }
    },
    real_resolution_16_9() {
      const resolu = parseInt(this.systemmessage.spec, 10)
      return this.resolution_16_9.filter(item => {
        if (resolu === 720) {
          return parseInt(item.split('*')[1], 10) <= 1080
        } else {
          return parseInt(item.split('*')[1], 10) <= 2160
        }
      })
    },
    real_resolution_9_16() {
      const resolu = parseInt(this.systemmessage.spec, 10)
      return this.resolution_9_16.filter(item => {
        if (resolu === 720) {
          return parseInt(item.split('*')[0], 10) <= 1080
        } else {
          return parseInt(item.split('*')[0], 10) <= 2160
        }
      })
    }
  },
  methods: {
    ...mapMutations([
      'CHANGE_VIDEOOPER_SHOW',
      'CHANGE_EXPORT_VIDEO_SET_SHOW',
      'CHANGE_TRACK_BOX_SHOW',
      'PROPERTY_FANWEI',
      'CHANGE_SELECTMZ_SHOW',
      'UPDATE_SLIDER_NUM',
      'PROPERTY_OUTLEFT',
      'PROPERTY_RATIO'
    ]),
    ...mapActions(['changeLoading']),
    blockShortcuts() {
      window.zindex = 0
    },
    unblockShortcuts() {
      window.zindex = 2
    },
    handleCancleBtnClick() {
      this.CHANGE_EXPORT_VIDEO_SET_SHOW(false)
    },
    handleComfirmBtnClick() {
      let selfCid = 'null'
      window.NCES.backStr &&
        window.NCES.backStr(cidData => {
          selfCid = cidData
        })
      console.log({ selfCid })
      const data = {
        // name: this.form.name,
        out_file_type: this.form.out_file_type,
        v_w: this.resolutions[this.form.resolution].v_w,
        v_h: this.resolutions[this.form.resolution].v_h,
        v_codec: this.form.v_codec,
        a_codec: this.form.a_codec,
        quality: this.form.quality,
        vb: this.form.vb,
        ab: this.form.ab,
        r: this.form.r,
        track_start: this.trackStart,
        track_end: this.trackEnd,
        mss_title: this.form.mss_title,
        extend_parameter: {
          self_cid: selfCid
        }
        // mss_stream: this.form.mss_stream
      }
      if (this.form.export_model === 0) {
        // fixed code rate, delete the quality
        delete data.quality
      } else if (this.form.export_model === 1) {
        // fixed quality, delete the code rate
        delete data.vb
        delete data.ab
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmBtnLocked = true
          producerAddApi(data)
            .then(res => {
              // console.log({res})
              if (res.code === 0) {
                this.confirmBtnLocked = false
                const strADY =
                  'https://console.aodianyun.com/nces/index.php?r=app/producerList#'
                const strGDY = `http://${window.location.hostname}/console/Page/cloud/nces/lcps_produce`
                let strTarget
                if (
                  window.NCES.diff_server &&
                  window.NCES.diff_server === 'GuangdianCloud'
                ) {
                  strTarget = strGDY
                } else {
                  strTarget = strADY
                }
                this.$alert(
                  `视频生成中,请前往<a href=${strTarget} target='_blank'>后台</a>查看生成进度!`,
                  '生成成功',
                  {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    callback: action => {
                      this.CHANGE_EXPORT_VIDEO_SET_SHOW(false)
                    }
                  }
                )
              } else {
                console.err(res.msg)
                // reject(new Error(res.msg))
              }
            })
            .catch(() => {
              this.confirmBtnLocked = false
              this.$alert(`服务器忙,请稍后重试`, '生成失败')
            })
        } else {
          return false
        }
      })
    },
    handleResolutionChange() {
      this.form.vb = this.resolutions[this.form.resolution].vb
      // eslint-disable-next-line no-empty-function
      this.$refs.form.validate(valid => {}) // 重新校验以刷新页面
    }
  },
  created() {
    this.is9_16 =
      Math.ceil(this.systemmessage.player.h / this.systemmessage.player.w) > 1
    this.form.resolution = this.is9_16
      ? this.real_resolution_9_16[0]
      : this.real_resolution_16_9[0]
    this.form.vb = this.resolutions[this.form.resolution].vb
  },
  mounted() {
    this.$nextTick(() => {
      const bscrollDom = this.$refs.bscroll
      this.aBScroll = new BScroll(bscrollDom, {
        mouseWheel: true,
        click: true,
        tap: true
      })
    })
  },
  destroyed() {
    this.CHANGE_VIDEOOPER_SHOW(true)
    this.CHANGE_TRACK_BOX_SHOW(true)
    this.CHANGE_SELECTMZ_SHOW(true)
    const fanwei = this.$store.state.all.track_property.fanwei
    fanwei['1440'].now = 0.45
    fanwei['1920'].now = 0.5
    this.PROPERTY_FANWEI(fanwei)
    window.zindex = 1
    this.UPDATE_SLIDER_NUM(
      Object.assign(this.$store.state.slidernum, { max: 30.1, min: 24.6 })
    )
    this.PROPERTY_OUTLEFT(0)
    this.PROPERTY_RATIO(0)
    trackPropertyAppendApi({
      track_property: { ratio: 0, outLeft: 0 }
    }).then(res => {
      if (res.code === 0 && !this.exportVideoSetShow) {
        this.changeLoading()
      }
      if (res.code !== 0) {
        console.warn(res.msg)
      }
    })
  }
}
</script>
<style lang="scss">
$font-color: #909399;
.exportVideoSet {
  position: absolute;
  top: 0;
  z-index: 1004;
  background-color: #222;
  margin-top: 32px;
  overflow: hidden;

  .el-slider__marks-text {
    font-size: 12px;
  }
  .header {
    background-color: #2e2e2e;
    height: 27px;
    line-height: 27px;
    font-size: 14px;
    padding-left: 10px;
  }
  .form {
    .el-form-item__label {
      color: $font-color;
    }
    .el-select-dropdown__item {
      color: $font-color;
    }
  }
  .quality-tip {
    font-size: 8px;
    color: $font-color;
    width: 100%;
    margin-top: 20px;
    margin-left: 20px;
  }
  .el-slider__marks-text {
    white-space: nowrap;
  }
  .export-tip {
    // margin-top: 40px;
    text-align: center;
    color: $font-color;
    font-size: 12px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    .u-icon {
      background-image: url(../../img/u10.png);
      display: inline-block;
      vertical-align: middle;
      margin-top: -2px;
      margin-right: 5px;
      background-size: 14px;
      width: 14px;
      height: 14px;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    flex-grow: 1;
    align-items: center;
    min-height: 80px;
    .btn {
      margin: 20px;
      height: 40px;
    }
    .dark-btn {
      background-color: #000;
      border: none;
      color: white;
      &:hover {
        background-color: #151515;
      }
    }
  }
}
</style>
