<template>
  <div class="title-search">
    <span class="search-label">标题 </span>
    <el-input
      class="input-search"
      v-model="innerTitle"
      @input="_inputEvent"
      :clearable="true"
      @focus="lockShortcuts"
      @blur="unlockShortcuts"
    ></el-input>
  </div>
</template>

<script>
import { SHORTCUTS_NOT_ALLOWED, SHORTCUTS_ALL_ALLOWED } from '@/config'
export default {
  props: {
    title: {
      type: String
    },
    inputEvent: {
      type: Function
    }
  },
  data() {
    return {
      innerTitle: ''
    }
  },
  watch: {
    title(val) {
      this.innerTitle = val
    }
  },
  methods: {
    lockShortcuts() {
      window.zindex = SHORTCUTS_NOT_ALLOWED
    },
    unlockShortcuts() {
      window.zindex = SHORTCUTS_ALL_ALLOWED
    },
    _inputEvent() {
      this.inputEvent()
      this.$emit('update:title', this.innerTitle)
    }
  }
}
</script>
<style lang="scss">
.title-search {
  padding: 0 0.2rem;
  line-height: 0.53rem;
  background-color: #212931;
  .search-label {
    margin-right: 0.12rem;
  }
  .input-search {
    display: inline-block;
    width: auto;
    input {
      width: 2rem;
      height: 0.3rem;
      background-color: rgb(48, 56, 64);
      border: 1px solid rgb(57, 65, 73) !important;
      border-radius: 3px;
      box-sizing: border-box;
      text-align: center;
      font-size: 0.16rem;
      color: #e4e4e4;
      -web-kit-appearance: none;
      -moz-appearance: none;
      display: inline-block;
      outline: 0;
      padding: 0 1em;
      text-decoration: none;
    }
  }
}
</style>
