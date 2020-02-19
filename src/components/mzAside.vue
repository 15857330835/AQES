<template>
  <div class="videolist_left">
    <ul class="list_leftlist">
      <li
        v-for="(item, index) in list"
        :key="index + item.title"
        :class="{ active: index === isSelected }"
        @click="handleLiClick(index)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isSelected: 0
    }
  },
  methods: {
    handleLiClick(index) {
      this.isSelected = index
      this.$emit('selectLi', {
        index,
        navitem: this.list[index]
      })
    }
  }
}
</script>
<style lang="scss">
.videolist_left {
  width: 100px;
  float: left;
  height: 100%;
  .list_leftlist {
    background-color: #212931;
    font-size: 12px;
    height: 100%;
    border-right: 2px solid #151a20;
    & > li {
      padding: 5px 15px;
      line-height: 25px;
      cursor: pointer;
      color: #e4e4e4;
      &.active,
      &:hover {
        color: #61ded0;
        background-color: #1c232a;
      }
    }
  }
}
</style>
