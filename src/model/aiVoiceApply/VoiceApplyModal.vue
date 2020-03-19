<template>
  <div class="dialog" :style="{ height: modalHeight }">
    <div class="mask" :style="{ height: modalHeight }"></div>
    <div
      class="dialog-image"
      v-if="modalContent === 'imageInfo'"
      :style="{
        height: Math.floor(mzHeight * 0.9) + 'px',
        width: Math.ceil(mzHeight * 0.9 * 1.3) + 'px'
      }"
    >
      <div
        class="append"
        v-if="modalContent === 'imageInfo'"
        :style="{
          height: Math.floor(mzHeight * 0.5) + 'px',
          width: Math.ceil(mzHeight * 0.5 * 0.4) + 'px',
          left: -Math.ceil(mzHeight * 0.3) + 'px'
        }"
      ></div>
    </div>

    <digital-box></digital-box>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DigitalBox from './VoiceApplyDigitalBox.vue'

export default {
  name: 'MyModal',
  components: {
    DigitalBox
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapState(['modalVoiceApplyIsShow', 'mzHeight', 'modalContent']),
    modalHeight() {
      const pxHeight = this.mzHeight + 42
      return `calc(1.14rem + ${pxHeight}px`
    }
  },
  created() {
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        this.CHANGE_MODAL_VOICE_APPLY_IS_SHOW(false)
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('keyup', e => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        this.CHANGE_MODAL_VOICE_APPLY_IS_SHOW(false)
      }
    })
  },
  methods: {
    ...mapMutations(['CHANGE_MODAL_VOICE_APPLY_IS_SHOW'])
  }
}
</script>

<style scoped lang="scss">
.dialog {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .dialog-image {
    background: url(../../img/modal-computer.png) center center no-repeat;
    background-size: contain;
    max-width: 472px;
    max-height: 365px;
    position: absolute;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100px;
  }

  .append {
    background: url(../../img/modal-arrow.png) center center no-repeat;
    background-size: contain;
    max-width: 79px;
    max-height: 195px;
    position: absolute;
    left: -100px;
    bottom: -50px;
  }
}
</style>
