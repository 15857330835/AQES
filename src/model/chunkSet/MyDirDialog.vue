<template>
  <div class="my-dir-dialog" v-show="myDirDialogShow">
    <div class="my-dir-dialog-content">
      <MyDir :isDialog="isDialog" @updateSelect="updateImgList"></MyDir>
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
export default {
  data() {
    return {
      isDialog: true,
      img_url: ''
    }
  },
  components: {
    MyDir
  },
  computed: {
    ...mapState(['myDirDialogShow'])
  },
  methods: {
    ...mapMutations(['CHANGE_MY_DIR_DIALOG_SHOW']),
    updateImgList(data) {
      this.img_url = data
    },
    confirmHandler() {
      if (!this.img_url) {
        this.$message({
          type: 'warning',
          message: '请先选中图片'
        })
      }
      // todo 拿到url并处理
      // this.CHANGE_MY_DIR_DIALOG_SHOW(false)
    },
    cancleHandler() {
      this.CHANGE_MY_DIR_DIALOG_SHOW(false)
    }
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
