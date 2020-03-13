<template>
  <div>
    <div class="video_option_content">
      <div class="content_top" :class="{ active: false }">
        <img
          :src="src"
          class="content_top_img source-img"
          :class="{ loaded: imgLoaded }"
          @load="handleImgLoad"
        />
        <span
          class="znTouse"
          :data-index="index"
          :data-service="source.service"
          @click="applyDialog"
          v-show="isInStep('INIT')"
          >应用</span
        >
        <span class="znTitle">{{ source.name }}</span>
      </div>

      <!--<div
          style="box-sizing:border-box;padding-top:45px;width:420px;margin:0 auto;position:relative"
          class="clearfix"
          v-if="isInStep('SHOW_DIALOG')"
      >
        <div v-if="!outsideHtml">
          <p style="font-size:16px">
            *此功能为
            <span style="color:red">付费功能</span>
          </p>
          <p style="font-size:14px">
            视频时长: {{info.data}}
            <br/>
            预计费用: {{info.price}}元&nbsp;
            <br/>
            预计等待时间约: {{info.time}}
          </p>
        </div>
        <div v-else v-html="outsideHtml"></div>

        <p style="color:#aaa">为确保字幕与媒资内容对应的准确性，操作中请勿对轨道资源进行任何修改！</p>
        <div style="position:relative;height: 80px;">
          <span
              class="sureAi"
              :class="{unsureAi: this.check===false}"
              :data-check="check"
              :data-service="this.source.service"
              @click="handleConfirmClick"
          >确定</span>
          <span class="celAi" @click="setStep('INIT')">取消</span>
        </div>
      </div>-->

      <div
        v-if="isInStep('SHOW_PROGRESS')"
        class="znsuccesstip"
        style="position:relative;text-align:center;margin-top:50px;font-size:17px"
      >
        <p class="stateTip" style="color:red">操作正在进行中！</p>
        <p class="stateHide stateTime">预计过程约: {{ timeLeft }}</p>
        <p>为确保字幕显示的准确性，请勿对现有轨道资源进行任何修改！</p>
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="progress"
          style="width: 80%;margin: 0 auto"
        ></el-progress>
        <!-- <div id="progressbar">
          <span class="aiPre">{{progress}}%</span>
        </div> -->
        <img
          class="stateHide"
          src="//cdn.aodianyun.com/nces/v1/img/loadings.gif"
          alt
        />
        <div>
          <el-button @click="cancelGenerate" v-if="showCancelGenerateBtn"
            >取消生成</el-button
          >
        </div>
      </div>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { aiApplyApi, aiStatusApi, aiStopApi } from '@/api/Ai'

const stepType = {
  INIT: 0,
  SHOW_DIALOG: 1,
  SHOW_PROGRESS: 2
}
const AI_APPLY_STATE = {
  ERROR: -1,
  WAITING: 0, // 等待启用
  IN_PREPARATION: 1, // 准备素材中
  RUNNING: 2 // 应用中
}
export default {
  props: ['source', 'index'],
  data() {
    return {
      check: true,
      outsideHtml: null,
      step: stepType.INIT,
      timer: null,
      progress: 0,
      showCancelGenerateBtn: true,
      imgLoaded: false
    }
  },
  computed: {
    ...mapState(['all', 'aiVoiceApplyStart', 'aiChunksPosition']),
    src() {
      return '//' + this.source.preview_img
    },
    /* applyEnable() {
        return this.all.curr_track_len - 1 < 5 * 3600 * 25;
      }, */
    aiVideoLength() {
      let len = 0
      for (const aiChunk of this.aiChunksPosition) {
        len += aiChunk.max - aiChunk.min
      }
      return Math.ceil(len / 25)
    },
    time() {
      if (!this.aiVideoLength) {
        return 0
      }
      return Math.ceil(
        this.aiVideoLength / 3 +
          (this.aiVideoLength >= 60 ? (this.aiVideoLength - 60) / 5 + 60 : 60)
      )
    },
    info() {
      const time = this.transtime(this.time)
      return { time }
    },
    timeLeft() {
      return this.transtime(
        Math.ceil((this.time * (100 - this.progress)) / 100)
      )
    }
  },
  watch: {
    aiVoiceApplyStart(newVal) {
      if (newVal) {
        this.CHANGE_AI_VOICE_APPLY_START(false)
        this.handleConfirmClick()
      }
    }
  },
  async mounted() {
    /* if (NCES.captext) {
        this.outsideHtml = NCES.captext({
          data: this.info.data,
          trantime: this.info.time
        });
      } */

    const res = await aiStatusApi()
    if (res.code !== 0) {
      return
    }
    if (
      res.data.state === AI_APPLY_STATE.IN_PREPARATION ||
      res.data.state === AI_APPLY_STATE.RUNNING
    ) {
      this.step = stepType.SHOW_PROGRESS
      this.updateStatus()
    }
  },
  methods: {
    ...mapMutations([
      'UPDATE_AUDIO_STATUS',
      'CHANGE_MODAL_VOICE_APPLY_IS_SHOW',
      'INIT_CHUNKS',
      'CHANGE_MODAL_CONTENT',
      'CHANGE_AI_VOICE_APPLY_START',
      'CHANGE_AI_VIEW_MASK_IS_SHOW'
    ]),
    ...mapActions(['changeLoading']),
    transtime: function(time) {
      return (
        (Math.ceil(time / 60) < 10
          ? '0' + Math.floor(time / 60)
          : Math.floor(time / 60)) +
        ':' +
        (time % 60 < 10 ? '0' + (time % 60) : time % 60)
      )
    },
    /* apply() {
        if (this.applyEnable) {
          this.setStep("SHOW_DIALOG");
        } else {
          this.$alert("视频时长请勿超过5小时！", "警告");
        }
      }, */
    applyDialog() {
      this.CHANGE_MODAL_CONTENT('imageInfo')
      this.CHANGE_MODAL_VOICE_APPLY_IS_SHOW(true)
      this.INIT_CHUNKS()
    },
    isInStep(step) {
      return this.step === stepType[step]
    },
    setStep(step) {
      this.step = stepType[step]
    },
    onCompleted() {
      this.CHANGE_AI_VIEW_MASK_IS_SHOW(false)
      clearTimeout(this.timer, this.updateStatus)
      this.step = stepType.INIT
      this.$alert('智能字幕生成成功', '提示')
      this.changeLoading()
    },
    onError() {
      this.step = stepType.INIT
      this.$alert('智能字幕生成失败', '警告')
    },
    updateStatus() {
      aiStatusApi()
        .then(res => {
          // console.log(res)
          if (res.code === 0) {
            if (res.data.state === AI_APPLY_STATE.ERROR) {
              console.log(new Error(res.data.msg || 'error'))
            }
            if (res.data.state === AI_APPLY_STATE.RUNNING) {
              this.showCancelGenerateBtn = false
            } else {
              this.showCancelGenerateBtn = true
            }
            const isRunning = res.data.state === AI_APPLY_STATE.RUNNING ? 1 : 0
            this.progress = res.data.progress / 2 + 50 * isRunning
            this.progress = parseInt(this.progress, 10)
            if (res.data.service === null) {
              if (res.data.msg === null) {
                this.onCompleted()
                return
              } else {
                this.CHANGE_AI_VIEW_MASK_IS_SHOW(false)
                clearTimeout(this.timer, this.updateStatus)
                this.step = stepType.INIT
                if (res.data.msg === 'No audio material on tracks') {
                  this.$alert('所选视频块无音频内容', '警告')
                  return
                }
                this.$alert('智能字幕生成失败', '警告')
                return
              }
            }
            this.timer = setTimeout(() => {
              this.updateStatus()
            }, 2000)
          } else {
            console.log(new Error(res.msg || 'error'))
          }
        })
        .catch(() => {
          this.CHANGE_AI_VIEW_MASK_IS_SHOW(false)
          clearTimeout(this.timer, this.updateStatus)
          this.onError()
        })
    },
    handleConfirmClick() {
      // 全局监听并触发
      const parameter = {}
      parameter.chunk_list = this.aiChunksPosition.map(item => item.id)
      console.log(parameter)
      aiApplyApi({
        service: this.source.service,
        parameter
      })
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            this.setStep('SHOW_PROGRESS')
            this.updateStatus()
          } else {
            this.CHANGE_AI_VIEW_MASK_IS_SHOW(false)
            this.onError()
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    cancelGenerate() {
      this.CHANGE_AI_VIEW_MASK_IS_SHOW(false)
      clearTimeout(this.timer, this.updateStatus)
      aiStopApi({ service: this.source.service })
        .then(res => {
          if (res.code === 0) {
            this.setStep('INIT')
          } else {
            console.log(new Error(res.msg))
          }
        })
        .catch(() => {
          this.setStep('INIT')
        })
    },
    handleImgLoad() {
      this.imgLoaded = true
    }
  }
}
</script>

<style lang="scss" scoped>
.video_option_content {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 5px 0px;
  margin-bottom: 15px;
  .content_top {
    height: 85px;
    .source-img {
      background: #1c232a;
      height: 85px;
      width: 100%;
      cursor: auto;
    }
  }
}
</style>
