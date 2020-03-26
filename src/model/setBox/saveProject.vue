<template>
  <div class="newsaveTable">
    <div class="newsaveTable_content">
      <div class="content_title">保存信息设置</div>
      <div
        class="content_select add-height"
        v-if="this.all.project.id == undefined"
      >
        <p>
          <span>工程名称 : </span
          ><input type="text" class="newsave_file_name" v-model="name" />
        </p>
      </div>
      <div class="content_select" v-else>
        <p style="text-align: center;line-height: 50px;">
          保存当前工程！
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
  data() {
    return { player: {}, name: '', loading: {} }
  },
  computed: {
    ...mapState(['all', 'notify', 'systemmessage'])
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
      const data = {}
      data.type = 'project'
      if (typeof this.all.project.id !== 'undefined') {
        data.data = { cmd: 'save' }
      } else {
        if (this.name === '') {
          this.$alert('请输入要保存的工程的名称', '提示消息', {
            confirmButtonText: '确定',
            callback() {
              window.zindex = 1
            }
          })
          window.zindex = 0
          return
        }
        data.data = { cmd: 'save', name: this.name }
      }

      data.success = function() {
        that.loading.close()
        that.changeLoading()
        that.$alert('保存工程成功！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
      }
      data.error = function(res) {
        that.loading.close()
        that.$alert('工程保存失败！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
        console.log('工程保存失败:' + res.msg)
      }
      this.Post(data)
      this.CHANGE_BOXSET('')
      this.loading = this.$loading({
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0.6)',
        text: '保存中'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content_select.add-height {
  padding: 20px 0;
}
</style>
