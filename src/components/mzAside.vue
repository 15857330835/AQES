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
<style lang="scss"></style>
