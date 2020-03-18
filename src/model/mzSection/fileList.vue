<template>
  <div class="upfilelist">
    <div class="upfilelist_content">
      <div class="content_title">上传文件列表</div>
      <div class="content_select"></div>
      <div class="content_click">
        <span class="content_click_cancel" @click="cel">取消</span>
        <span class="content_click_make" @click="sure">确认</span>
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

<style lang="scss"></style>
