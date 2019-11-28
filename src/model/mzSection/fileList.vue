<template>
  <div class="upfilelist">
    <div class="upfilelist_content">
      <div class="content_title">上传文件列表</div>
      <div class="content_select"></div>
      <div class="content_click">
        <span class="content_click_make" @click="sure">确认</span
        ><span class="content_click_cancel" @click="cel">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data: function() {
    return {}
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState([]),
    loadingShow: function() {
      return this.startloading || this.onloading
    }
  },
  watch: {},
  methods: {
    ...mapActions([]),
    ...mapMutations([])
  }
}
</script>

<style>
.upfilelist {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1010;
}
.upfilelist .upfilelist_content {
  position: absolute;
  width: 510px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #232323;
  font-size: 12px;
  overflow: hidden;
}
.upfilelist .content_title {
  height: 30px;
  line-height: 30px;
  background-color: #2e2e2e;
  text-align: center;
}
</style>
