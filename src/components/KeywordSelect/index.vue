<template>
  <div>
    <el-select
      v-model="selectVal"
      placeholder="请选择关键词"
      filterable
      clearable
      :multiple="!single ? true : false"
      style="width: 100%"
    >
      <el-option
        v-for="item in options"
        :key="item.keywordId"
        :label="item.keyword"
        :value="item.keywordId"
      />
    </el-select>
  </div>
</template>

<script>
import {
  listKeywords,
} from "@/api/business/keywords";

export default {
  props: {
    value: {
      type: [Array, String, Number],
      default: () => []
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectVal: this.value,
      options: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      try {
        const { rows } = await listKeywords({
          pageNum: 1,
          pageSize: 9999,
        })
        this.options = rows
      } catch (error) {
        console.error(error)
      }
    }
  },
  watch: {
    value () {
      this.selectVal = this.value
    },
    selectVal () {
      this.$emit('input', this.selectVal)
      this.$emit('change')
    }
  }
}
</script>
