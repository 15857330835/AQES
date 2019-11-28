<template>
  <div class="imgset_list">
    <div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:0;width:100%;height:100%;boxSizing:border-box;"
        @click="click(1, 0)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"
          >1</span
        >
      </div>
    </div>
    <div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:0;width:50%;height:100%;boxSizing:border-box;"
        @click="click(2, 0)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"
          >1</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:50%;width:50%;height:100%;boxSizing:border-box; "
        @click="click(2, 1)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >2</span
        >
      </div>
    </div>
    <div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:0;width:50%;height:50%;boxSizing:border-box;"
        @click="click(4, 0)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >1</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:50%;width:50%;height:50%;boxSizing:border-box;"
        @click="click(4, 1)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >2</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:50%;left:0;width:50%;height:50%;boxSizing:border-box;"
        @click="click(4, 2)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >3</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:50%;left:50%;width:50%;height:50%;boxSizing:border-box;"
        @click="click(4, 3)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >4</span
        >
      </div>
    </div>
    <div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:0;width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 0)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >1</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:calc(100% / 3);width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 1)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >2</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:0;left:calc(100% * 2 / 3);width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 2)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >3</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:calc(100% / 3);left:0;width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 3)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >4</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:calc(100% / 3);left:calc(100%  / 3);width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 4)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >5</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:calc(100% / 3);left:calc(100% * 2 / 3);width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 5)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >6</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:calc(100% * 2 / 3);left:0;width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 6)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >7</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:calc(100% * 2 / 3);left:calc(100% / 3);width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 7)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >8</span
        >
      </div>
      <div
        style="cursor:pointer;border:1px solid #303030;position:absolute;top:calc(100% * 2 / 3);left:calc(100% * 2 / 3);width:calc(100% / 3);height:calc(100% / 3);boxSizing:border-box;"
        @click="click(9, 8)"
      >
        <span
          style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
          >9</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data: function() {
    return {}
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum'
    ])
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['CHANGE_PROPERTYNUM', 'CHANGE_ACTIVEPROPERTY']),
    click: function(list, index) {
      console.log(typeof list, typeof index)
      if (
        this.activeProperty[this.propertyNum].w <
        this.activeProperty[this.propertyNum].h
      ) {
        if (list === 1) {
          this.activeProperty[this.propertyNum].w =
            this.activeProperty[this.propertyNum].w *
            (100 / this.activeProperty[this.propertyNum].h)
          this.activeProperty[this.propertyNum].h = 100
          this.activeProperty[this.propertyNum].left =
            (100 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top = 0
        }
        if (list === 2) {
          this.activeProperty[this.propertyNum].w =
            (this.activeProperty[this.propertyNum].w *
              (100 / this.activeProperty[this.propertyNum].h)) /
            2
          this.activeProperty[this.propertyNum].h = 50
          this.activeProperty[this.propertyNum].left =
            index * 50 + (50 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top =
            (100 - this.activeProperty[this.propertyNum].h) / 2
        }
        if (list === 4) {
          this.activeProperty[this.propertyNum].w =
            (this.activeProperty[this.propertyNum].w *
              (100 / this.activeProperty[this.propertyNum].h)) /
            2
          this.activeProperty[this.propertyNum].h = 50
          this.activeProperty[this.propertyNum].left =
            (index % 2) * 50 +
            (50 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top =
            Math.floor(index / 2) * 50 +
            (50 - this.activeProperty[this.propertyNum].h) / 2
        }
        if (list === 9) {
          this.activeProperty[this.propertyNum].w =
            (this.activeProperty[this.propertyNum].w *
              (100 / this.activeProperty[this.propertyNum].h)) /
            3
          this.activeProperty[this.propertyNum].h = 100 / 3
          this.activeProperty[this.propertyNum].left =
            (index % 3) * (100 / 3) +
            (100 / 3 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top =
            Math.floor(index / 3) * (100 / 3) +
            (100 / 3 - this.activeProperty[this.propertyNum].h) / 2
        }
      } else {
        if (list === 1) {
          this.activeProperty[this.propertyNum].h =
            this.activeProperty[this.propertyNum].h *
            (100 / this.activeProperty[this.propertyNum].w)
          this.activeProperty[this.propertyNum].w = 100
          this.activeProperty[this.propertyNum].top =
            (100 - this.activeProperty[this.propertyNum].h) / 2
          this.activeProperty[this.propertyNum].left = 0
        }
        if (list === 2) {
          this.activeProperty[this.propertyNum].h =
            (this.activeProperty[this.propertyNum].h *
              (100 / this.activeProperty[this.propertyNum].w)) /
            2
          this.activeProperty[this.propertyNum].w = 50
          this.activeProperty[this.propertyNum].left =
            index * 50 + (50 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top =
            (100 - this.activeProperty[this.propertyNum].h) / 2
        }
        if (list === 4) {
          this.activeProperty[this.propertyNum].h =
            (this.activeProperty[this.propertyNum].h *
              (100 / this.activeProperty[this.propertyNum].w)) /
            2
          this.activeProperty[this.propertyNum].w = 50
          this.activeProperty[this.propertyNum].left =
            (index % 2) * 50 +
            (50 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top =
            Math.floor(index / 2) * 50 +
            (50 - this.activeProperty[this.propertyNum].h) / 2
        }
        if (list === 9) {
          this.activeProperty[this.propertyNum].h =
            (this.activeProperty[this.propertyNum].h *
              (100 / this.activeProperty[this.propertyNum].w)) /
            3
          this.activeProperty[this.propertyNum].w = 100 / 3
          this.activeProperty[this.propertyNum].left =
            (index % 3) * (100 / 3) +
            (100 / 3 - this.activeProperty[this.propertyNum].w) / 2
          this.activeProperty[this.propertyNum].top =
            Math.floor(index / 3) * (100 / 3) +
            (100 / 3 - this.activeProperty[this.propertyNum].h) / 2
        }
      }
      this.CHANGE_ACTIVEPROPERTY(this.activeProperty)
      const geo_arr = this.activeProperty
      let geo = ''
      for (let i = 0; i < geo_arr.length; i++) {
        const f = geo_arr[i]
        if (f.top < 0) {
          geo =
            geo +
            f.f +
            '=' +
            f.left +
            '%/' +
            f.top +
            '%:' +
            f.w +
            '%x' +
            f.h +
            '%:' +
            f.transparency +
            ';'
        } else {
          geo =
            geo +
            f.f +
            '=' +
            f.left +
            '%/' +
            f.top +
            '%:' +
            f.w +
            '%x' +
            f.h +
            '%:' +
            f.transparency +
            ';'
        }
      }
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_property',
        chunk_id: this.activechunk.chunk.chunk_id,
        geometry: geo.substr(0, geo.length - 1)
      }
      this.Post(data)
    }
  }
  // mounted: function() {}
}
</script>

<style></style>
