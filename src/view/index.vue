<template>
  <div>
    <p>默认状态</p>
    <time-line domRef="vs" @getHours="getHours" :clear="clear=='vs'" @clearHours="clearHours"/>
    <p>被我选择过的时段</p>
    <time-line domRef="vs3" :minHour="7" :maxHour="23" :checkedList="[12,12.5,13.5]"  @getHours="getHours" :clear="clear=='vs3'" @clearHours="clearHours"/>
    <p>其它人选择过的时段</p>
    <time-line domRef="vs18" :minHour="10" :maxHour="21" :disabledList="[{name:'张三',time:15},{name:'李四',time:15.5},{name:'王五',time:16}]" @getHours="getHours" :clear="clear=='vs18'" @clearHours="clearHours"/>
    <p>外部传来的时间根据日期预订</p>
    <time-line domRef="vs19" :date="'2020-06-08'" :minHour="7" :maxHour="23" @getHours="getHours" :clear="clear=='vs19'" @clearHours="clearHours"/>
  </div>
</template>

<script>
import timeLine from "@/components/timeLine";
export default {
  components: {
    timeLine
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
      this.clear = e
    }
  }
};
</script>

<style scoped>
</style>