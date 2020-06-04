# demo


[预览地址](http://element-timeline.weakwater.com)

### Attributes
属性 | 属性名 | 是否必填 | 默认值 | 类型
---|---|---|---|---
最小时间 | minHour | 否 | 0 | string/number
最大时间 | maxHour  | 否 | 24 | string/number
一格对应时间(分钟) | unit | 否 | 30 | string/number
一格表示的时段对应的刻度 | scale | 否 | 0.5 | string/number
被他人预定 | disabledList | 否 | [{name:'',time:0}] | array
被我预定 | checkedList | 否 | [] | array
dom节点 | domRef | 是 | "" | string


### Events
事件名称 | 说明 | 回调参数
---|---|---
getHours | 获取返回参数 | 组件绑定值
clearHours | 重置其它vslider组件状态 |  组件绑定值

###### 默认状态

```
<time-line domRef="vs" @getHours="getHours" :clear="clear=='vs'" @clearHours="clearHours"/>
```

###### 被我选择过的时段

```
<time-line domRef="vs3" :minHour="7" :maxHour="23" :checkedList="[12,12.5,13.5]"  @getHours="getHours" :clear="clear=='vs3'" @clearHours="clearHours"/>
```

###### 其它人选择过的时段

```
<time-line domRef="vs18" :minHour="10" :maxHour="21" :disabledList="[{name:'张三',time:15},{name:'李四',time:15.5},{name:'王五',time:16}]" @getHours="getHours" :clear="clear=='vs18'" @clearHours="clearHours"/>
```
```
/**
*
* 获取选择后的参数
**/
getHours(e) {
    this.$message({
        type: 'success',
        message: JSON.stringify(e)
    })
}
/**
*   借助父组件的clear实现组件互相触发重置功能
**/
clearHours(e) {
    this.clear = e
}
```