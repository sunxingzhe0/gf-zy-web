<template>
  <div class="input-range">
    <el-input
      class="input"
      v-model.lazy.trim="values[0]"
      clearable
      type="number"
      @input="
        isInteger ? (values[0] = values[0].replace(/[^\d]/g, '')) : () => {}
      "
      size="small"
      @change="$emit('change', values)"
      @keyup.native="keyupEvent($event, values[0], 0)"
    >
    </el-input>
    <div class="range"></div>
    <el-input
      class="input"
      v-model.lazy.trim="values[1]"
      clearable
      type="number"
      size="small"
      @input="
        isInteger ? (values[1] = values[1].replace(/[^\d]/g, '')) : () => {}
      "
      @change="$emit('change', values)"
      @keyup.native="keyupEvent($event, values[1], 1)"
    ></el-input>
  </div>
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
    isInteger: {
      required: false,
      type: Boolean,
      default: () => false,
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

<style lang="scss" scoped>
.input-range {
  width: 100%;
  display: flex;
  align-items: center;
  .input {
    width: 45%;
  }
  .range {
    width: 10px;
    margin: 0 5%;
    height: 1px;
    background: #bdbec0;
  }
}

::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type='number'] {
  -moz-appearance: textfield;
}
</style>
