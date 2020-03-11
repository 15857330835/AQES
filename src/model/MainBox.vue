<template>
  <div class="main-box">
    <div class="main-container">
      <systemmes></systemmes>
      <mzsection></mzsection>
      <videooper v-show="videooperShow && !chunksetshow"></videooper>
      <tracksection></tracksection>
      <tracktimer></tracktimer>
    </div>
    <chunkset></chunkset>
    <ExportVideoSet v-if="exportVideoSetShow"></ExportVideoSet>
    <VoiceApplyModal v-if="modalVoiceApplyIsShow"></VoiceApplyModal>
    <SetBox></SetBox>
  </div>
</template>

<script>
import systemmes from '@/model/Systemmes'
import mzsection from '@/model/mzSection/mzsection'
import videooper from '@/model/videooper'
import tracksection from '@/model/trackSection'
import tracktimer from '@/model/trackSection/trackTimer'
import chunkset from '@/model/chunkSet'
import ExportVideoSet from '@/model/mzSection/ExportVideoSet'
import VoiceApplyModal from '@/model/aiVoiceApply/VoiceApplyModal.vue'
import SetBox from '@/model/setBox'

import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    systemmes,
    mzsection,
    videooper,
    tracksection,
    tracktimer,
    chunkset,
    ExportVideoSet,
    VoiceApplyModal,
    SetBox
  },
  computed: {
    ...mapState([
      'videooperShow',
      'chunksetshow',
      'exportVideoSetShow',
      'modalVoiceApplyIsShow'
    ])
  },
  methods: {
    ...mapMutations([
      'CHANGE_CLIENTWIDTH',
      'GET_OPENWAY',
      'UPDATE_TRACK_MIX',
      'CHANGE_IS_MULTI_SELECT',
      'CHANGE_VIS_TIMER_WIDTH',
      'CHANGE_IS_REFRESH_TRACK_BOX_BS',
      'CHANGE_IS_REFRESH_CAPTION_SET_BS'
    ]),
    throttleResize: _.throttle(function() {
      this.CHANGE_CLIENTWIDTH($(document).width())
      this.CHANGE_VIS_TIMER_WIDTH(
        document.querySelector('.edit_track_contents').offsetWidth
      )
    }, 200),
    debounceResize: _.debounce(function() {
      this.GET_OPENWAY()
      setTimeout(() => {
        this.UPDATE_TRACK_MIX()
      }, 1000)
      this.CHANGE_IS_REFRESH_TRACK_BOX_BS(true)
      this.CHANGE_IS_REFRESH_CAPTION_SET_BS(true)
    }),
    mixedResize() {
      this.throttleResize()
      this.debounceResize()
    },
    keydownEvent(e) {
      const onlyCtrl =
        e.key === 'Control' && !e.shiftKey && !e.altKey && !e.metaKey
      const onlyMeta =
        e.key === 'Meta' && !e.shiftKey && !e.altKey && !e.ctrlKey
      if ((onlyCtrl || onlyMeta) && window.zindex === 1) {
        this.CHANGE_IS_MULTI_SELECT(true)
      } else {
        this.CHANGE_IS_MULTI_SELECT(false)
      }
    },
    keyupEvent(e) {
      if (!e.ctrlKey && !e.metaKey) {
        this.CHANGE_IS_MULTI_SELECT(false)
      }
    }
  },
  mounted() {
    // 浏览器大小改变后更新轨道位置(*** 主要是videoBox的宽高比例控制不变)
    window.addEventListener('resize', this.mixedResize)
    // 监听是否可以多选
    window.addEventListener('keydown', this.keydownEvent)
    window.addEventListener('keyup', this.keyupEvent)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.mixedResize)
    window.removeEventListener('keydown', this.keydownEvent)
    window.removeEventListener('keyup', this.keyupEvent)
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  width: 100%;
  height: 100%;
  .main-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
