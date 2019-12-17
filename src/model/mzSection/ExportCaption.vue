<template>
  <div class="caption-type" v-if="isOutTypeShow">
    <div class="caption-type-content">
      <div class="content_title">字幕格式选择</div>
      <div class="content_text">
        <span
          ><label
            ><input
              type="radio"
              checked="checked"
              name="tracktypes"
              value="1"
            />&nbsp;视频 / 文本 / 图片</label
          ></span
        >
        <span
          ><label
            ><input type="radio" name="tracktypes" value="2" />&nbsp;音频</label
          ></span
        >
      </div>
      <div class="content_bottom">
        <span class="con_click_make" @click="add">确认</span
        ><span class="con_click_cancel" @click="cel">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['isOutTypeShow'])
  },
  methods: {
    ...mapMutations(['CHANGE_IS_OUT_TYPE_SHOW']),
    ...mapActions(['Post']),
    add() {
      this.CHANGE_IS_OUT_TYPE_SHOW(false)
    },
    cel() {
      console.log(1223)
      this.CHANGE_IS_OUT_TYPE_SHOW(false)
    }
  }
}
</script>

<style lang="scss" scoped>
/* 添加轨道的弹窗样式*/
.caption-type {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1010;
}
.caption-type-content {
  position: absolute;
  width: 510px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #232323;
  font-size: 14px;
  .content_title {
    height: 40px;
    line-height: 40px;
    background-color: #2e2e2e;
    text-align: left;
    font-size: 14px;
    padding-left: 20px;
  }
  .content_text {
    height: 70px;
    text-align: center;
    position: relative;
    span {
      position: absolute;
      margin: 0;
      left: 50%;
      top: 50%;
      /*transform: translate(-50%,-50%);*/
      width: 25%;
      &:nth-child(1) {
        left: 30%;
      }
      &:nth-child(2) {
        left: 50%;
      }
    }
  }
  .content_bottom {
    background-color: #2e2e2e;
    height: 30px;
    span {
      float: right;
      width: 40px;
      height: 20px;
      line-height: 18px;
      margin-top: 5px;
      /*margin-left: 10px;*/
      margin-right: 10px;
      text-align: center;
      cursor: pointer;
      border-radius: 3px;
      box-sizing: border-box;
      &.con_click_make {
        background-color: #00a9ff;
        border: 1px solid #00a9ff;
      }
      &.con_click_cancel {
        background-color: #232323;
        border: 1px solid #686868;
      }
    }
  }
}
</style>
