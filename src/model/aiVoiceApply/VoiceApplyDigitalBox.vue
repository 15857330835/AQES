<template>
  <div
    class="digital-box"
    v-if="modalContent === 'digitalInfo'"
    :style="{ width: boxWidth + 'px' }"
  >
    <div class="ai-info-group">
      <div class="ai-info-item">
        时长：<span
          :class="{ 'ai-video-time': true, 'ai-video-time-warn': showTimeWarn }"
        >
          {{ aiVideoTime }}</span
        >
      </div>
      <div class="ai-info-item">
        所需时间约：<span class="ai-cost-time">{{ aiCostTimeFormat }}</span>
      </div>
      <div class="ai-info-item" v-if="showCostMoney">
        预计费用约：<span class="ai-cost-money">¥{{ aiCostMoney }}</span>
      </div>
    </div>
    <div class="ai-btn-group">
      <div class="ai-btn-cancel ai-btn-item" @click="aiVoiceApplyCancel">
        取消
      </div>
      <div
        class="ai-btn-confirm ai-btn-item"
        :class="{ unsureAi: check === false }"
        :data-check="check"
        @click="aiVoiceApplyConfirm"
      >
        确定
      </div>
    </div>
    <div class="ai-time-warn" v-if="showTimeWarn"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      check: true,
      showCostMoney: true,
      boxWidth: 600,
      showTimeWarn: false
    }
  },
  computed: {
    ...mapState([
      'modalContent',
      'all',
      'isTrackSelect',
      'aiTrackPosition',
      'ghostsPosition',
      'aiChunksPosition'
    ]),
    aiVideoLength() {
      let len = 0
      for (const aiChunk of this.aiChunksPosition) {
        len += aiChunk.max - aiChunk.min
      }
      return Math.ceil(len / 25)
    },
    aiVideoTime() {
      const minute =
        Math.ceil(this.aiVideoLength / 60) < 10
          ? '0' + Math.floor(this.aiVideoLength / 60)
          : Math.floor(this.aiVideoLength / 60)
      const second =
        this.aiVideoLength % 60 < 10
          ? '0' + (this.aiVideoLength % 60)
          : this.aiVideoLength % 60
      return `${minute}:${second}`
    },
    aiCostMoney() {
      return ((this.aiVideoLength * 0.15) / 60).toFixed(2)
    },
    aiCostTime() {
      if (!this.aiVideoLength) {
        return 0
      }
      return Math.ceil(
        this.aiVideoLength / 3 +
          (this.aiVideoLength >= 60 ? (this.aiVideoLength - 60) / 5 + 60 : 60)
      )
    },
    aiCostTimeFormat() {
      const minute =
        Math.ceil(this.aiCostTime / 60) < 10
          ? '0' + Math.floor(this.aiCostTime / 60)
          : Math.floor(this.aiCostTime / 60)
      const second =
        this.aiCostTime % 60 < 10
          ? '0' + (this.aiCostTime % 60)
          : this.aiCostTime % 60
      return `${minute}:${second}`
    }
  },
  watch: {
    isTrackSelect() {
      this.UPDATE_AI_CHUNKS_POSITION()
    },
    aiVideoLength(newVal) {
      if (newVal > 5 * 3600) {
        this.showTimeWarn = true
      } else {
        this.showTimeWarn = false
      }
    }
  },
  async mounted() {
    if (
      window.NCES.diff_server &&
      window.NCES.diff_server === 'GuangdianCloud'
    ) {
      this.showCostMoney = false
      this.boxWidth = 420
    }
  },
  methods: {
    ...mapMutations([
      'CHANGE_MODAL_VOICE_APPLY_IS_SHOW',
      'CHANGE_AI_VOICE_APPLY_START',
      'UPDATE_AI_CHUNKS_POSITION',
      'CHANGE_AI_VIEW_MASK_IS_SHOW'
    ]),
    aiVoiceApplyCancel(e) {
      e.stopPropagation()
      this.CHANGE_MODAL_VOICE_APPLY_IS_SHOW(false)
    },
    aiVoiceApplyConfirm(e) {
      e.stopPropagation()
      if (!this.check) {
        return
      }
      if (this.aiVideoLength > 5 * 3600) {
        this.$alert('视频时长请勿超过5小时！', '警告')
        return
      }
      this.CHANGE_AI_VOICE_APPLY_START(true)
      this.CHANGE_MODAL_VOICE_APPLY_IS_SHOW(false)
      this.CHANGE_AI_VIEW_MASK_IS_SHOW(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.digital-box {
  position: absolute;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
  bottom: 70px;
  width: 580px;
  height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 1;
  border-radius: 4px;

  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 50px;
  color: rgba(46, 46, 46, 1);

  display: flex;
  justify-content: space-between;
  padding: 0 20px;

  .ai-info-group {
    display: flex;

    .ai-info-item {
      padding-right: 20px;

      .ai-cost-time {
        font-size: 20px;
        color: rgba(8, 143, 211, 1);
        vertical-align: middle;
      }

      .ai-cost-money {
        font-size: 20px;
        color: #fe6262;
        vertical-align: middle;
      }

      .ai-video-time-warn {
        color: #fe6262;
      }
    }
  }

  .ai-btn-group {
    display: flex;

    .ai-btn-item {
      width: 56px;
      height: 28px;
      border-radius: 3px;
      margin-top: 10px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;

      &.ai-btn-cancel {
        background: rgba(255, 255, 255, 1);
        color: rgba(102, 102, 102, 1);
        border: 1px solid rgba(220, 222, 226, 1);
        margin-right: 16px;
      }

      &.ai-btn-confirm {
        background: rgba(8, 143, 211, 1);
        color: rgba(255, 255, 255, 1);
        border: 1px solid rgba(8, 143, 211, 1);
      }
      &.unsureAi {
        cursor: not-allowed !important;
        background-color: transparent !important;
        border: 1px solid #aaa !important;
      }
    }
  }

  .ai-time-warn {
    background: url(../../img/ai-time.png) center center no-repeat;
    background-size: contain;
    width: 185px;
    height: 102px;
    position: absolute;
    left: 95px;
    bottom: 41px;
  }
}
</style>
