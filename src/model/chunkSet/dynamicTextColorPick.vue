<template>
  <div class="color-container">
    <input type="color" :ref="'color'" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      colorMap: {
        // 传入 prop 名称: 需要修改的参数名称
        textBgColor: 'color',
        textColor: 'fgcolour',
        iconColor: 'icon_color',
        iconBgColor: 'icon_bg_color'
      }
    }
  },
  props: {
    type: String,
    type2: String
  },
  computed: {
    ...mapState(['activechunk'])
  },
  watch: {},
  methods: {
    colorChange(color_para) {
      // return
      const color = this.colorReset(color_para.toRgb())
      this.activechunk.chunk.template_parameter[
        this.colorMap[this.type]
      ] = color
      this.type2 &&
        (this.activechunk.chunk.template_parameter[
          this.colorMap[this.type2]
        ] = color)
      this.sendmessage()
    },
    colorReset(obj) {
      let r = obj.r.toString(16)
      r = r.length === 1 ? '0' + r : r
      let g = obj.g.toString(16)
      g = g.length === 1 ? '0' + g : g
      let b = obj.b.toString(16)
      b = b.length === 1 ? '0' + b : b
      let a = Math.round(obj.a * 255)
      a = a.toString(16)
      a = a.length === 1 ? '0' + a : a
      return ('#' + a + r + g + b).toUpperCase()
    },
    sendmessage() {
      $.post(
        window.AQES.DOMAIN + '/api/chunk',
        JSON.stringify({
          cmd: 'update_template_parameter',
          chunk_id: this.activechunk.chunk.chunk_id,
          property: this.activechunk.chunk.template_parameter
        }),
        function(res) {
          if (res.code !== 0) {
            console.warn(res.msg)
          }
        },
        'json'
      )
    }
  },
  mounted() {
    const that = this
    $(this.$refs.color).spectrum({
      preferredFormat: true,
      color:
        that.activechunk.chunk.template_parameter[that.colorMap[that.type]],
      allowEmpty: true,
      showInitial: true,
      // showAlpha: true,
      showPalette: true,
      showInput: true,
      showSelectionPalette: true,
      clickoutFiresChange: true,
      noColorSelectedText: '未选择颜色',
      palette: [
        ['#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff'],
        ['#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f'],
        [
          '#f4cccc',
          '#fce5cd',
          '#fff2cc',
          '#d9ead3',
          '#d0e0e3',
          '#cfe2f3',
          '#d9d2e9',
          '#ead1dc'
        ],
        [
          '#ea9999',
          '#f9cb9c',
          '#ffe599',
          '#b6d7a8',
          '#a2c4c9',
          '#9fc5e8',
          '#b4a7d6',
          '#d5a6bd'
        ],
        [
          '#e06666',
          '#f6b26b',
          '#ffd966',
          '#93c47d',
          '#76a5af',
          '#6fa8dc',
          '#8e7cc3',
          '#c27ba0'
        ],
        [
          '#c00',
          '#e69138',
          '#f1c232',
          '#6aa84f',
          '#45818e',
          '#3d85c6',
          '#674ea7',
          '#a64d79'
        ],
        [
          '#900',
          '#b45f06',
          '#bf9000',
          '#38761d',
          '#134f5c',
          '#0b5394',
          '#351c75',
          '#741b47'
        ],
        [
          '#600',
          '#783f04',
          '#7f6000',
          '#274e13',
          '#0c343d',
          '#073763',
          '#20124d',
          '#4c1130'
        ]
      ],
      containerClassName: 'awesome',
      chooseText: '确认',
      cancelText: '取消',
      move: _.debounce(that.colorChange, 500),
      hide: _.debounce(that.colorChange, 500),
      beforeShow: _.debounce(that.colorChange, 500)
    })
  }
}
</script>

<style lang="scss">
$btn-cancel: #49abf4;
.awesome {
  background-color: #333;
}
.sp-container {
  border: 1px solid rgba($color: #f0c49b, $alpha: 0.4);
}
.sp-picker-container {
  border: none;
  .sp-hue {
    width: 15px;
    .sp-slider {
      width: 20px;
      border-radius: 2px;
      left: -4px;
      box-shadow: 0 0 3px #222;
    }
  }
  .sp-input {
    color: #fff;
  }
  .sp-validation-error {
    color: red;
    background-color: transparent;
  }
  .sp-button-container {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    .sp-cancel,
    .sp-choose {
      box-sizing: border-box;
      width: 60px;
      height: 30px;
      background-color: transparent;

      margin: 5px;
      border-radius: 5px;
      outline: none;
    }
    .sp-cancel {
      border: 1px solid #ccc;
      color: #fff;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      text-decoration: none;
    }
    .sp-choose {
      border: 1px solid $btn-cancel;
      color: $btn-cancel;
      background: transparent;
      text-shadow: none;
    }
    .sp-cancel:hover,
    .sp-choose:hover {
      cursor: pointer;
      box-shadow: 0 0 10px #000;
    }
  }
}
.sp-palette-container {
  border: none;
  .sp-thumb-el {
    border: none;
    background: none;
    .sp-thumb-inner {
      border-radius: 2px;
    }
  }
}
</style>
