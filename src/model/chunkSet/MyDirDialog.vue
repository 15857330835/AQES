<template>
  <div class="my-dir-dialog" v-show="myDirDialogShow" ref="myDirDialog">
    <div class="my-dir-dialog-content">
      <MyDir
        :isDialog="isDialog"
        @updateSelect="updateImgList"
        v-show="domReady"
      ></MyDir>
      <div class="button-groups">
        <el-button size="small" @click="cancleHandler">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmHandler"
          >确 定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import MyDir from '@/model/mzSection/selectmz/mydir'
import { mapState, mapMutations } from 'vuex'
import { chunkUpdateFilterApi } from '@/api/Chunk'
export default {
  data() {
    return {
      isDialog: true,
      img_url: '',
      domReady: false
    }
  },
  components: {
    MyDir
  },
  computed: {
    ...mapState(['myDirDialogShow', 'notify', 'activechunk', 'filterIndex']),
    curFilterData() {
      return this.activechunk.chunk.filter[this.filterIndex]
    }
  },
  methods: {
    ...mapMutations(['CHANGE_MY_DIR_DIALOG_SHOW', 'UPDATE_ALLOW_HISTORY_BACK']),
    sendmessage(callback) {
      console.log(
        JSON.stringify({
          cmd: 'update_filter',
          chunk_id: this.activechunk.chunk.chunk_id,
          property: this.activechunk.chunk.filter
        })
      )
      this.UPDATE_ALLOW_HISTORY_BACK(false)
      chunkUpdateFilterApi({
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.activechunk.chunk.filter
      })
        .then(res => {
          if (res.code === 0) {
            this.UPDATE_ALLOW_HISTORY_BACK(true)
          } else {
            console.warn(res.msg)
          }
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            type: 'error',
            message: '操作失败！',
            position: 'bottom-right',
            duration: this.notify.time
          })
        })
    },
    updateImgList(data) {
      this.img_url = data
    },
    confirmHandler() {
      if (!this.img_url) {
        this.$message({
          type: 'warning',
          message: '请先选中图片'
        })
        return
      }
      // this.CHANGE_DIALOG_IMAGE_FROM(this.img_url)
      if (!this.curFilterData.extend_parameter.length) {
        this.curFilterData.extend_parameter.push({})
      }
      if (!this.curFilterData.extend_parameter[0].src_img) {
        this.curFilterData.extend_parameter[0].src_img = this.curFilterData.from
      }
      this.curFilterData.from = this.img_url
      this.sendmessage()
      this.CHANGE_MY_DIR_DIALOG_SHOW(false)
    },
    cancleHandler() {
      this.CHANGE_MY_DIR_DIALOG_SHOW(false)
    }
  },
  mounted() {
    this.domReady = true
    console.log(789000)
  }
}
</script>

<style lang="scss">
.my-dir-dialog {
  .my-dir-dialog-content {
    width: 600px;
    height: 310px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #212931;
    .mydirContent {
      height: 260px;
      position: relative;
      .mydir-top {
        background-color: #191e22;
      }
      .mydir-bottom {
        height: calc(100% - 0.53rem);
        .mydir-bottom-title {
          height: 30px !important;
          span {
            font-size: 0.18rem !important;
          }
        }
        .mydir-bottom-content {
          height: calc(100% - 30px);
          .dir,
          .file {
            .clicked {
              border: none;
            }
          }
          .file {
            .actived {
              border: 1px solid #61ded0;
            }
          }
        }
      }
    }
    .button-groups {
      height: 50px;
      padding: 0 0.2rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
