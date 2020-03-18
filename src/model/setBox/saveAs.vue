<template>
  <div class="makeTable">
    <div class="makeTable_content">
      <div class="content_title">工程另存为</div>
      <div class="content_select">
        <p>
          <span>工程名称 : </span
          ><input type="text" class="out_file_name" v-model="name" />
        </p>
      </div>
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
    return { show: false, loading: {}, player: {}, name: '' }
  },
  computed: {
    ...mapState(['notify', 'systemmessage'])
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'changeLoading']),
    ...mapMutations(['CHANGE_BOXSET']),
    cel: function() {
      this.CHANGE_BOXSET('')
    },
    sure: function() {
      const that = this
      if (this.name === '') {
        window.zindex = 0
        this.$alert('请输入要另存的工程的名称!', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      const data = {}
      data.type = 'project'
      data.data = { cmd: 'saveas', name: this.name }
      data.success = function(res) {
        if (window.NCES.saveas) {
          window.NCES.saveas(res)
        }
        that.loading.close()
        that.changeLoading()
        window.zindex = 0
        that.$alert('工程另存为成功！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
      }
      data.error = function(res) {
        window.zindex = 1
        that.$alert('工程另存为失败！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        console.log('工程另存为失败:' + res.msg)
      }
      this.Post(data)
      this.CHANGE_BOXSET('')
      this.loading = this.$loading({
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0.6)',
        text: '保存中'
      })
      window.zindex = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.makeTable_content {
  .content_select {
    padding: 20px 0;
  }
}
</style>
