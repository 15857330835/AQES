<template>
  <div :id="'fdf' + this.index">
    <el-select
      v-model="holder.font"
      placeholder="请选择"
      size="mini"
      @change="fontchange"
      style="width:2.2rem;margin-right:0.16rem;"
    >
      <el-option-group
        v-for="group in options3"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return {
      holder: null,
      cmd: '',
      forDynamic: false
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  created() {
    this.holder =
      this.activechunk.chunk.filter[this.index] ||
      this.activechunk.chunk.template_parameter
    if (this.activechunk.chunk.filter.length > 0) {
      this.cmd = 'update_filter'
      this.forDynamic = false
    } else if (this.activechunk.chunk.template_parameter) {
      this.cmd = 'update_template_parameter'
      this.forDynamic = true
    }
  },
  computed: {
    ...mapState(['fontlist', 'activechunk']),
    loadingShow() {
      return this.startloading || this.onloading
    },
    sortBy(field) {
      return function(a, b) {
        return a[field] - b[field]
      }
    },
    options3() {
      const a = []
      let b = {}
      const e = []
      for (const i of Object.keys(this.fontlist)) {
        e.push(i)
      }
      e.sort()
      for (let m = 0; m < e.length; m++) {
        b = {}
        b.label = e[m]
        b.options = []
        const c = []
        for (const key of Object.keys(this.fontlist[e[m]])) {
          c.push({ value: this.fontlist[e[m]][key].family, label: key })
        }
        c.sort()
        // c.sort(this.sortBy('name'))
        // c.sort(this.sortBy('label'))
        // for(var j=0;j<c.length;j++){
        //     b.options.push({'value':c[j],'label':c[j]})
        // }
        b.options = c
        a[m] = b
      }
      return a
    }
  },
  props: ['index'],
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['UPDATE_ALLOW_HISTORY_BACK']),
    fontchange(value) {
      this.UPDATE_ALLOW_HISTORY_BACK(false)
      this.holder.family = value
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: this.cmd,
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.forDynamic
          ? this.activechunk.chunk.template_parameter
          : this.activechunk.chunk.filter
      }
      data.error = function() {
        console.log('字体更新失败！')
      }
      data.success = () => {
        this.UPDATE_ALLOW_HISTORY_BACK(true)
      }
      this.Post(data)
    },
    tranfont() {
      const a = {}
      let b = []
      for (const i of Object.keys(this.fontlist)) {
        a[i] = []
        b = []
        for (const key of Object.keys(this.fontlist[i])) {
          b.push(key)
        }
        b.sort()
        for (let j = 0; j < b.length; j++) {
          a[i].push({ name: b[j], id: b[j] })
        }
      }

      const that = this
      const fnBack1 = function(result) {
        if (result.name === '') {
          return
        }
        this.holder.family = result.name

        $.post(
          window.AQES.DOMAIN + '/api/chunk' + `?authKey=${window.AQES.authKey}`,
          JSON.stringify({
            cmd: that.cmd,
            chunk_id: that.activechunk.chunk.chunk_id,
            property: that.holder
          }),
          function(res) {
            if (res.code !== 0) {
              console.warn(res.msg)
            }
          },
          'json'
        )
      }
      // eslint-disable-next-line
      const select2 = new SelectBox($('#fontpick' + that.index), a, fnBack1, {
        color: '#aaaaaa', // 输入框字体颜色
        height: 30,
        fontSize: 16,
        optionFontSize: 12,
        optionColor: '#aaaaaa', // 下拉框字体颜色
        arrowColor: '#aaaaaa', // 箭头颜色
        borderColor: '#606060', // 边线颜色
        borderRadius: 3,
        borderWidth: 1, // 边线宽度
        backgroundColor: '#1d1d1d', // 背景色颜色
        hoverColor: '#151a20', // 下拉框HOVER颜色
        arrowBorderWidth: 0, // 箭头左侧分割线宽度。如果为0则不显示
        placeholder: '请选择二级标签', // 默认提示
        allowInput: false, // 是否允许输入
        width: 185
      })
      $('#fontpick' + that.index + ' input').val(this.holder.family)
    }
  }
}
</script>

<style lang="scss"></style>
