<template>
  <el-row :gutter="10" type="flex" align="middle">
    <!-- <el-col :span="4">
      <el-link :underline="false" @click="resolveClear">不限</el-link>
    </el-col> -->
    <el-col :span="6">
      <el-input
        v-model.lazy.trim="values[0]"
        clearable
        size="mini"
        @change="$emit('change', values)"
        @keyup.native="keyupEvent($event, values[0], 0)"
      >
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-input
        v-model.lazy.trim="values[1]"
        clearable
        size="mini"
        @change="$emit('change', values)"
        @keyup.native="keyupEvent($event, values[1], 1)"
      ></el-input>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'InputRange',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      values: [...this.value],
    }
  },
  watch: {
    value: function (val) {
      console.log(val)
      if (val == '') {
        this.values = ['', '']
      }
      // this.values = [...val]
    },
  },
  methods: {
    keyupEvent(e, input, index) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '')
      e.target.value = e.target.value.replace(/\.{2,}/g, '.')
      e.target.value = e.target.value.replace(/^\./g, '0.')
      e.target.value = e.target.value.replace(
        /^\d*\.\d*\./g,
        e.target.value.substring(0, e.target.value.length - 1),
      )
      e.target.value = e.target.value.replace(/^0[^.]+/g, '0')
      e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
      this.values[index] = e.target.value
      // console.log(this.values[index])
    },
    resolveClear() {
      this.values = []
      this.$emit('input', this.values)
      this.$emit('change', this.values)
    },
  },
}
</script>
