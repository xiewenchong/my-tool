<!-- 仅当前页面使用的组件 -->
<template>
    <div class="Tabbar">
       <span v-for = '(item,index) in btnData' v-on:click = 'select' :index='index'  :key='index' :class = '{curItem:cur==index} '>
            {{item}}
        </span>
       <div class="line" v-bind:style="{width:lineWidth+'%',transform:'translate('+translateX+'%,0)'}">
           <div class="lineCon"></div>
       </div>
    </div>
</template>
<script>

export default {
    name: "Tabbar",
    props: {
       btnData: {
            type: Array,
            default:  function () {
                return [1,2,3]
              }
        },
        cur:{
            default: 0
        }
    },
    data() {
        return {
            lineWidth:0,
            translateX:0
        };
    },
    mounted:function(){
       this.lineWidth = 100/this.btnData.length;
       this.translateX = 100*this.cur
    },
    methods:{
       select(e){
         let index = e.currentTarget.getAttribute('index');
         if(index!=this.cur){
             this.$emit('changeCur',index);
         }
        
       }
    },
    watch:{
        cur:function(){
            this.translateX = 100*this.cur
        }
    }
};
</script>
<style lang="scss" scoped>
    .Tabbar{
        width:100%;
        height:88px;
        background:rgba(255,255,255,1);
        box-shadow:0px 4px 6px 0px rgba(0, 0, 0, 0.08);
        line-height: 88px;
        font-size:32px;
        color: #333;
        display: flex;
        align-items: center;
        position: relative;
            z-index: 1;
        span{
            flex:1;
            text-align: center;
            height:88px;
            line-height: 88px;

        }
        .curItem{
            color: #FF7920;
            font-weight:600;
            line-height: 84px;
        }
        .line{
            position: absolute;
            left: 0;
            bottom: 0;
            height: 6px;
            display: flex;
            align-items: center;
            justify-content:center;
            transition:all 0.3s;
            transform:translate(0,0);
            .lineCon{
                width: 40px;
                 height: 6px;
                 background: #FF7920;
            }
        }
    }
    
</style>












