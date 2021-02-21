<template>
  <div class="makeTable">
    <div class="makeTable_content">
      <div class="content_title">生成中</div>
      <div class="content_select">
        <el-progress :percentage="schedule"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { outputAddApi, outputAllApi } from '@/api/Output'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return { show: false, loading: {}, player: {}, name: '', timer: null, progress: 0 }
  },
  computed: {
    ...mapState(['notify', 'systemmessage', 'schedule']),
    schedule() {
      const schedule = parseInt(this.progress, 10)
      return schedule
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'changeLoading']),
    ...mapMutations(['CHANGE_BOXSET']),
    async getSchedule() {
      const that = this
      const res = await outputAllApi()
      if(res.code == 0) {
        this.progress = res.data.status.progress
        if(res.data.status.state == -1) {
          this.CHANGE_BOXSET('')  
          this.$alert(`视频生成出错！`, '生成失败')
          return  
        }
        if(this.progress < 100) {
          this.timer = setTimeout(that.getSchedule, 1000)
        }else if (this.progress = 100) {
          window.AQES.saveas(res.data.info)
          this.CHANGE_BOXSET('')  
          this.$alert(`视频生成成功`, '生成成功', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
        })  
        }
      }
    },
  },
  mounted() {
      this.getSchedule()
  }
}
</script>

<style lang="scss" scoped>
.makeTable_content {
  .content_select {
    padding: 20px 0;
    padding-left: 20px;
  }
}
</style>
