<template>
    <div class="vslider">
        <div class="vslider-container" :ref="domRef">
            <div :class="['vslider-item', { 'lightgray': item.overdue } , { 'darkblue': item.ischecked } , { 'lightblue': item.ishover } , { 'disableblue' : item.checked } , { 'darkgray': item.disabled } ]" v-for="(item,index) in hourList" :key="index" @click="ClickVslider(item.hour,index,$event)" :hour-list="item.hour" :hourkey="index" @mouseover="mouseoverItem(item)" @mouseleave="mouseleaveItem(item)">
                <popper v-if="!item.overdue && !item.disabled && item.visible" :timeformat="timeformat" :hoverslot="tips">
                    <div class="popper-slot" slot="content">
                        <el-button type="text" @click.stop="onCancel">取消</el-button>
                        <el-button type="primary" @click.stop="EventEmit(item.hour,index,$event)">确定</el-button>
                    </div>
                </popper>
                <popper v-if="item.overdue && item.overdueShow" :timeformat="'已过期'" hoverslot=" " class="diableBox">  
                </popper>
                <popper v-if="item.checked && item.checkedShow" :timeformat="'已被我预定'" hoverslot=" " class="diableBox">   
                    <i class="el-icon-success" slot="icon" style="margin: 0 2px;color: #67C23A;"></i> 
                </popper>
                <popper v-if="item.disabled && item.disabledShow" :timeformat="`已被${disabledList.find(i=>i.time==item.hour[0]).name}预定`" hoverslot=" " class="diableBox">   
                </popper>
            </div>
        </div>
        <div class="vslider-number">
            <span v-for="(item,index) in hourList" :key="index" :hour-list="item.hour" :hourkey="index">{{item.hour[0] % 1 === 0 ? item.hour[0] : ""}}{{hourList.length-1 === index ? item.hour[1] : ''}}</span>
        </div>
    </div>
</template>

<script>
import popper from '@/components/popper';
export default {
    name: 'timeLine',
    components: {
        popper
    },
    props: {
        minHour: {
            type: [String,Number],
            default: 0
        },
        maxHour: {
            type: [String,Number],
            default: 24
        },
        unit: {
            type: [String,Number],
            default: 30
        },
        // 单位 一格表示的时段对应的刻度
        scale: {
            type: [String,Number],
            default: 0.5
        },
        //已经被别人预定
        disabledList: {
            type: [String,Array],
            default: ()=>{
                return []
            }
        },
        //已经被我预定
        checkedList: {
            type: [String,Array],
            default: ()=> {
                return []
            }
        },
        domRef: {
            type: String,
            default: ""
        },
        clear: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {  
            hourList: [],
            selectmin: "",
            selectmax: "",
            startX: 0,
            endX: 0,
            isMove: false, //是否移动了光标  
            selectHours: [], //选择的时间 
            hovermin: "", //鼠标悬浮的最小时间 
            hovermax: "" //鼠标悬浮的最大时间
        }
    },
    watch: {
        clear(newValue,oldValue) {
            console.info(oldValue)
            if(!newValue) {
                this.onCancel()
            }
        }
    },
    computed: {
        /** 时间提示格式化 **/
        timeformat() {
            if(this.isMove && this.hovermin && this.hovermax && this.selectmin && this.selectmax) {
                if(this.hovermax < this.selectmin) {
                    return this.formatTimeList([this.hovermin,this.selectmax])
                }else if(this.hovermin > this.selectmax) {
                    return this.formatTimeList(this.selectmin < this.selectmax ? [this.selectmin,this.hovermax] : [this.selectmax,this.hovermax])
                }else {
                    return this.formatTimeList(this.selectmin < this.selectmax ? [this.selectmin,this.selectmax] : [this.selectmax,this.selectmin])
                }
            }else{
                return this.formatTimeList(this.selectmin < this.selectmax ? [this.selectmin,this.selectmax] : [this.selectmax,this.selectmin])
            }    
        },
        /**提示   选中的长度为1显示移动光标 如果移动鼠标则提示再次点击 **/
        tips() {
            if(this.selectHours.length!==1) return "";
            if(this.endX !== this.startX) return "(再次点击确认时段)";
            return "(移动光标选择更多时段)";
        }
    },
    methods: {
        format(n) {
            return n > 9 ? n : `0${n}`
        },
        formatTime(num) {
            let time = String(num).split('.');
            let hour = this.format(time[0]);
            let minute = time[1] ? this.format(Number(`0.${time[1]}`) * 60) : '00';
            return `${hour}:${minute}`
        },
        formatTimeList(list) {
            let [min,max] = list;
            let minutes = (max - min) / 0.5 * this.unit;
            return `${this.formatTime(min)}~${this.formatTime(max)} ${minutes}分钟`
        },
        getnum(num) {
            let time = String(num).split('.');
            let minute = time[1] ? this.format(Number(`0.${time[1]}`) * 60) : '0';
            return minute
        },
        getHoursList() {
            let hour = new Date().getHours() + new Date().getMinutes() / 60;
            let arr = [];
            for(let i=this.minHour; i<this.maxHour; i+=this.scale) {
                arr.push(i)
            }
            return arr.map(item=>{
                return {
                    hour: [item,item+this.scale],
                    visible: false, //弹出
                    disabled: this.disabledList.map(i=>i.time).includes(item), //禁用
                    overdue: item + this.scale < hour,
                    checked: this.checkedList.includes(item), //已选
                    ischecked: false, //选中
                    ishover: false, //悬浮
                    overdueShow: false, //过期的弹窗
                    checkedShow: false, //已经被预定的弹窗
                    disabledShow: false // 其他人预定弹窗
                }
            });
        },
        SecondsClick(hour,index,e) {
             /**如果选择的区间包括禁用了的区间**/
               let key = this.hourList.findIndex((u,ukey)=>{
                   if(u.hour[0]===this.selectHours[0].hour[0]){
                       return ukey
                    }
               })
               let uList = key > index ? this.hourList.slice(index,key+1) : this.hourList.slice(key,index+1)
               if(uList.find(i=>i.overdue || i.disabled || i.checked)){
                   return;
               }
               /**如果先选择时间较大再选择小的就把 hour[0]赋值给mix反之hour「1」赋值给max**/
               if(this.selectmax > hour[1]) {
                   this.selectmin = hour[0];
               }else {
                   this.selectmax = hour[1];
               }
               this.endX = e.x;
               let [min,max] = this.selectmin < this.selectmax ? [ this.selectmin,this.selectmax] : [this.selectmax, this.selectmin];
               this.hourList = this.hourList.map(item=>{
                   return {
                       ...item,
                       ischecked: item.hour[0] < max && item.hour[1] > min
                   }
               })
        },
        /** 点击按钮改变原有数组的属性并且添加到selectHours. 长度大于1点击按钮则为重选，清空掉前面选择的 **/
        ClickVslider(hour,index,e) {
            if(!this.selectHours.length || this.selectHours.length>1) {
                this.selectmin = hour[0];
                this.selectmax = hour[1];
                this.isMove = true;
                this.startX = e.x;
                this.endX = e.x;
            }
            //第二次次点击按钮
            if(this.selectHours.length===1) {
               this.isMove = false;
               this.SecondsClick(hour,index,e)
            }
            //重置
            if(this.selectHours.length>1) {
                this.selectHours = [];
                this.hourList = this.hourList.map(item=>{
                    return {
                        ...item,
                        ischecked: false
                    }
                })
            }
            let data = this.hourList.find(i=>i.hour===hour);
            let showdata = this.hourList.find(i=>i.visible); // 点击禁用按钮不触发。
            if(data.overdue || data.disabled || data.checked) return;
            this.$nextTick(()=>{
                if(showdata) {
                    this.$set(showdata,'visible',false)
                }
                this.$set(this.hourList[index],'visible',!data.visible)
                this.$set(this.hourList[index],'ischecked',data.ischecked ? data.ischecked : !data.ischecked)
                this.selectHours.push(this.hourList[index]);
            }) 
            this.Clear()
        },
        onCancel() {
            [this.selectmin,this.selectmax,this.selectHours,this.isMove,this.hovermin,this.hovermax] = [0,0,[],false,"",""];
            this.hourList = this.hourList.map(item=>{
                return {
                    ...item,
                    visible: false,
                    ishover: false,
                    ischecked: item.ischecked ? !item.ischecked : false
                }
            })
        },
        // 确定
        EventEmit(hour,index,e) {
            if(this.selectHours.length === 1) {
                this.SecondsClick(hour,index,e)
            }
            this.$emit('getHours',{time:[this.formatTime(this.selectmin),this.formatTime(this.selectmax)], timeformat: this.timeformat});
            [this.selectmin,this.selectmax,this.startX,this.endX,this.hovermax,this.hovermin,this.selectHours,this.isMove] = ["","",0,0,"","",[],false];
            this.hourList = this.getHoursList();
        },
        // 重置
        Clear() {
            this.$emit('clearHours',this.domRef)
        },
        mouseoverItem(item) {
            //被我预定
            if(item.checked) {
                this.$set(item,'checkedShow',true)
                return
            }
            //被其他人预定
            if(item.disabled) {
                this.$set(item,'disabledShow',true)
                return
            }
            //已过期
            if(item.overdue) {
                this.$set(item,'overdueShow',true)
                return
            }     
        },
        mouseleaveItem(item) {
            //被我预定
            if(item.checked) {
                this.$set(item,'checkedShow',false)
                return
            }
            //被其他人预定
            if(item.disabled) {
                this.$set(item,'disabledShow',false)
                return
            }
            //已过期
            if(item.overdue) {
                this.$set(item,'overdueShow',false)
                return
            } 
        }
    },
    created() {
        this.hourList = this.getHoursList()
    },
    mounted() {
        this.$refs[this.domRef].addEventListener('mousemove',(e)=>{
            if(this.isMove) {
                if(e.x!==this.startX) {
                    this.endX = e.x;
                }
               let index = e.target.getAttribute('hourkey');
               let key = this.selectHours.length ? this.hourList.findIndex((u,ukey)=>{
                   if(u.hour[0]===this.selectHours[0].hour[0]){
                       return ukey
                    }
               }) : null;
               if(!key) {
                   return
               }
               let [min,max] = key > index ? [index,key] : [key,index];              
               let uList = this.hourList.slice(min,Number(max)+1);
               if(uList.find(i=>i.overdue || i.disabled || i.checked)){
                   return;
               }
               this.hovermin = index ? this.hourList[index].hour[0] : this.selectmin;
               this.hovermax = index ? this.hourList[index].hour[1] : this.selectmax;
               this.$nextTick(()=>{
                   this.hourList = this.hourList.map((item,itemIndex)=>{
                    return {
                            ...item,
                            ishover: this.hovermax < this.selectmin ?  itemIndex > Number(min)-1 && itemIndex < Number(max) : 
                            itemIndex > Number(min) && itemIndex < Number(max)+1
                        }
                    })
               })
            }
        })
    }
}
</script>

<style scoped>
ul,li{
    list-style-type: none;
}
.vslider{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.vslider-container{
    width: 100%;
    height: 20px;
    line-height: 20px;
    display: flex;
    cursor: pointer;
}
.vslider-item{
    flex: 1;
    border: 1px solid #ddd;
    border-right-width: 0px;
    position: relative;
}
.vslider-item:last-child{
    border-right-width: 1px;
}
.lightgray{
    cursor: default;
    background-color: #ededee;
}
.darkgray{
    cursor: default;
    background-color: #ccc;
}
.lightblue{
    background-color: #d7eafd;
}
.darkblue{
    background-color: #1989fa;
}
.disableblue {
    cursor: default;
    background-color: #a0c7fb;
}
.vslider-number{
    width: 100%;
    display: flex;
}
.vslider-number span{
    flex: 1;
    text-align: left;
}
.vslider-number span:last-child{
    text-align: right;
}
.popper-slot{
    margin: 5px 0;
    text-align: right;
}
.popper-slot .el-button{
    padding: 4px 8px;
}
</style>