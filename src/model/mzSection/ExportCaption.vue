<template>
  <div class="caption-type" v-if="isOutTypeShow">
    <div class="caption-type-content">
      <div class="content_title">字幕格式选择</div>
      <div class="content_text">
        <div class="container">
          <label v-for="item in typesData" :key="item.id"
            ><input
              type="radio"
              :checked="item.type === activeType"
              name="caption-type"
              :value="item.type"
              @change="changeInput(item.type)"
            /><span class="type-info">&nbsp;*.{{ item.type }}</span></label
          >
        </div>
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
  data() {
    return {
      typesData: [
        {
          type: 'srt',
          id: 1001
        },
        {
          type: 'ssa',
          id: 1002
        },
        {
          type: 'ass',
          id: 1003
        }
      ],
      activeType: 'srt'
    }
  },
  computed: {
    ...mapState(['isOutTypeShow'])
  },
  methods: {
    ...mapMutations(['CHANGE_IS_OUT_TYPE_SHOW']),
    ...mapActions(['Post']),
    changeInput(type) {
      this.activeType = type
    },
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
  width: 380px;
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
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
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
