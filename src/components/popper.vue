<template>
  <div class="vslider-popper">
    <p><slot name="icon"></slot>{{timeformat}}</p>
    <span>{{hoverslot}}</span>
    <slot name="content"></slot>
    <div class="popper__arrow"></div>
  </div>
</template>

<script>
export default {
    name: 'popper',
    props: {
        timeformat: {
            type: [String,Number],
            default: ""
        },
        hoverslot: {
            type: [String,Number],
            default: '(移动光标选择更多时段)'
        }
    }
};
</script>

<style scoped>
.vslider-popper {
    position: absolute;
    background: #fff;
    height: auto;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 12px;
    bottom: 30px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    word-break: break-all;
    white-space: nowrap;
    left: 50%;
    transform: translate(-50%,0);
}
.vslider-popper .popper__arrow{
    bottom: -8px;
}
.vslider-popper .popper__arrow, .vslider-popper .popper__arrow:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    left: 50%;
}
.vslider-popper .popper__arrow:after {
    content: " ";
    border-width: 6px;
    bottom: 1px;
    margin-left: -6px;
    border-top-color: #fff;
    border-bottom-width: 0;
}
.vslider-popper p {
    margin: 0;
}
.vslider-popper span {
    display: block;
    font-size: 14px;
    color: #999;
    text-align: right;
    word-break: keep-all;
}
</style>