<template>
  <div>
    <el-select
      v-model="holder.font"
      placeholder="请选择"
      size="mini"
      @change="fontchange"
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
  data: function() {
    return {
      // holder_: {},
      cmd: '',
      forDynamic: false
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  created: function() {
    //   this.holder = this.activechunk.chunk.filter[this.index] || this.activechunk.chunk.template_parameter;
    //   if(this.activechunk.chunk.filter.length>0){
    //       this.cmd = "update_filter"
    //       this.forDynamic = false
    //   } else if(this.activechunk.chunk.template_parameter){
    //       this.cmd = "update_template_parameter"
    //       this.forDynamic = true
    //   }
    // this.holder = {"type":2,"text":"奥点科技：云非编服务NCES超凡体验，敬请期待！","size":0,"family":"Noto Sans S Chinese","font":"黑体","weight":500,"style":"normal","fgcolour":"#FFFFFFFF","bgcolour":"#00000000","olcolour":"#FF000000","outline":0,"pad":100,"geometry":"0=2.2%/71%:70%x8.8%:100","halign":0,"valign":1}
    // this.cmd = "update_font_style"
    // this.forDynamic = false
  },
  computed: {
    ...mapState(['fontlist', 'activechunk']),
    loadingShow: function() {
      return this.startloading || this.onloading
    },
    sortBy(field) {
      return function(a, b) {
        return a[field] - b[field]
      }
    },
    options3: function() {
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
        for (const [key, value] of Object.entries(this.fontlist[e[m]])) {
          c.push({ value: value.family, label: key })
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
    },
    holder_: function() {
      return this.holder
    }
  },
  props: ['holder'],
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['UPDATE_ALLOW_HISTORY_BACK']),
    fontchange(value) {
      // this.UPDATE_ALLOW_HISTORY_BACK(false)
      this.holder_.family = value

      // console.log(this.holder_)
      this.$emit('change', this.holder_)
      // var data ={}
      // data.type = 'chunk'
      // data.data ={ "cmd": this.cmd, 'chunk_id':this.activechunk.chunk.chunk_id,'property': this.forDynamic?this.activechunk.chunk.template_parameter:this.activechunk.chunk.filter}
      // data.error = function () {
      //     console.log('字体更新失败！')
      // }
      // data.success = ()=>{
      //     this.UPDATE_ALLOW_HISTORY_BACK(true)
      // }
      // this.Post(data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
