<template>
  <div>
    <p>默认状态</p>
    <v-slider domRef="vs" @getHours="getHours" :clear="clear=='vs'" @clearHours="clearHours"/>
    <p>被我选择过的时段</p>
    <v-slider domRef="vs3" :minHour="7" :maxHour="23" :checkedList="[12,12.5,13.5]"  @getHours="getHours" :clear="clear=='vs3'" @clearHours="clearHours"/>
    <p>其它人选择过的时段</p>
    <v-slider domRef="vs18" :minHour="10" :maxHour="21" :disabledList="[{name:'张三',time:15},{name:'李四',time:15.5},{name:'王五',time:16}]" @getHours="getHours" :clear="clear=='vs18'" @clearHours="clearHours"/>
  </div>
</template>

<script>
import vSlider from "@/components/vSlider";
export default {
  components: {
    vSlider
  },
  data() {
    return {
      clear: ""
    }
  },
  methods: {
    getHours(e) {
      this.$message({
        type: 'success',
        message: JSON.stringify(e)
      })
    },
    clearHours(e) {
      console.log(e)
      this.clear = e
    }
  }
};
</script>

<style scoped>
</style>