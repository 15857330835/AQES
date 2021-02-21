<template>
  <div class="makeTable">
    <div class="makeTable_content">
      <div class="content_title">生成视频</div>
      <div class="content_select">
        <p>
          <span>视频名称 : </span
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
import { outputAddApi, outputAllApi } from '@/api/Output'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return { show: false, loading: {}, player: {}, name: '' }
  },
  computed: {
    ...mapState(['notify', 'systemmessage']),
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'changeLoading']),
    ...mapMutations(['CHANGE_BOXSET']),
    cel() {
      this.CHANGE_BOXSET('')
    },
    sure() {
      const that = this
      if (this.name === '') {
        window.zindex = 0
        this.$alert('请输入要生成的视频的名称!', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
        return
      }
      const data = {
        title: this.name
      }
      if(window.AQES.stream !== '') {
        let stream = window.AQES.stream
        var reg = /^[0-9a-zA-Z]+$/
        if(!reg.test(stream)) {
          this.$alert(`stream只能由数字和字母组成`, '生成失败')
          this.CHANGE_BOXSET('')
          return
        }
        data.stream = stream
      }
      outputAddApi(data).then(res => {
        if (res.code === 0) {
          this.CHANGE_BOXSET('saveprogress')  
        } else {
          console.err(res.msg)
          this.CHANGE_BOXSET('')
        }
      }).catch(() => {
        this.$alert(`服务器忙,请稍后重试`, '生成失败')
        this.CHANGE_BOXSET('')
        // this.$alert(`当前已下载${this.schedule}%`, '生成中')
      })
      // this.loading = this.$loading({
      //   fullscreen: true,
      //   background: 'rgba(0, 0, 0, 0.6)',
      //   text: '保存中'
      // })
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
