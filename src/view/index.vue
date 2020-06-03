<template>
  <div>
    <p>默认状态</p>
    <v-slider domRef="vs" @getHours="getHours" />
    <p>被我选择过的时段</p>
    <v-slider domRef="vs3" :minHour="7" :maxHour="23" :checkedList="[12,12.5,13.5]"  @getHours="getHours" />
    <p>其它人选择过的时段</p>
    <v-slider domRef="vs18" :minHour="10" :maxHour="21" :disabledList="[{name:'张三',time:15},{name:'李四',time:15.5},{name:'王五',time:16}]" @getHours="getHours" />
  </div>
</template>

<script>
import vSlider from "@/components/vSlider";
export default {
  components: {
    vSlider
  },
  methods: {
    getHours(e) {
      this.$message({
        type: 'success',
        message: JSON.stringify(e)
      })
    }
  }
};
</script>

<style scoped>
</style>