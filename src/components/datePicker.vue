<template>
  <div class="ad-datepicker">
    <el-date-picker
      v-model="date"
      type="daterange"
      size="mini"
      :clearable="true"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="dateChange"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date()
    }
  },
  methods: {
    dateChange() {
      if (this.date !== null) {
        this.$emit('dateChange', this.date)
      } else {
        this.$emit('clearDate')
      }
    },
    clearDate() {
      // 从外部触发
      this.date = null
      this.$emit('clearDate')
    }
  }
}
</script>
<style lang="scss">
$font-size: #e4e4e4;
$backgroundColor: #222;
$backgroundColorDarken: #1b1b1b;
.ad-datepicker {
  display: inline-block;
  .el-input__inner {
    border: none !important;
    background: $backgroundColor;
    width: 300px;
    .el-range-input {
      background: $backgroundColorDarken;
      border: 1px solid #686868;
      border-radius: 10px;
      color: $font-size;
    }
    .el-range-separator {
      color: $font-size;
    }
  }
}
</style>
