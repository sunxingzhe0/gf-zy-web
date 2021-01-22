<template>
  <el-slect v-model="_value" @change="change">
    <el-option
      v-for="(item, index) in options"
      :lable="item.label"
      :value="item.value"
      :key="index"
    ></el-option>
  </el-slect>
</template>
<script>
/*
@author        qiang
@name          SingleSelect
@desc          基于element的select的简单封装,其实并没有什么用，只是写el-select太烦了
@props          
               value    string|number   ''
               options  Array<{label:string, value: string:number}>
@emit
               change   value 
*/
export default {
  name: 'SingleSelect',
  porps: {
    value: {
      type: [String, Number],
      default: '',
    },
    options: {},
  },
  computed: {
    _value() {
      return this.value
    },
  },
  methods: {
    change(val) {
      this.$emit('input', val)
      const item = this.options.find(item => item.value === val)
      this.$emit('change', item)
    },
  },
}
</script>
