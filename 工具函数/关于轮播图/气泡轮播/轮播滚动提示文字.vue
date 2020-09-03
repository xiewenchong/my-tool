<!-- 仅当前页面使用的组件 -->
<template>
    <div class="notice">
       <img :src="noticeIcon" >
       <div class="noticeCon">
           <ul :style='{transform:"translate(0,"+translatey+"px)", transition:"transform "+transition+"s"}'>
               <li  v-for='(item,index) in list' :key='index'>{{item.username}}提现{{ (item.boostAmount/100).toFixed(2)}}元</li>
           </ul>
       </div>
       <div></div>
     </div>
</template>
<script>
    import noticeIcon from "../img/noticeIcon.png";
    export default {
        name: "notice",
        props: {
            msg: {
                type: String,
                default: "默认文案"
            }
        },
        data() {
            return {
                noticeIcon: noticeIcon,
                list:[],
                transition:0.5,
                translatey:0,
            };
        },
        methods: {
            play() {
               let _h = window.document.querySelector('.noticeCon').clientHeight,
                   that = this;
               setInterval(function(){
                    that.transition = 0.5;
                    that.translatey = -_h;
                    setTimeout(function(){
                        that.reset();
                    },500);
                    
               },2500);
            },
            reset(){
                this.transition = 0;
                this.translatey = 0;
                let _data = this.list.shift();
                this.list.push(_data);
            }
        },
        mounted:function(){
            let that = this;
            databus.ajax({
                url:'/api/redpackage/getWithdrawList',
                data:{
                    securityKey:window.securityKey
                },
                success:function(res){
                    let content = res.content || {};
                    that.list = content;
                    that.play();
                }
            })
        }
    };
</script>
<style lang="scss" scoped>
    .notice{
        width:100%;
        height:88px;
        padding: 0 30px;
        background:rgba(255,242,237,1);
        border-radius:24px 20px 0px 0px;
        position: absolute;
        left: 0;
        bottom: 0;
        color: #333333;
        font-size: 28px;
        line-height: 88px;
        text-align: left;
        display: flex;
        align-items: center;
        overflow: hidden;
        img{
             width:36px;
            height:30px;
            vertical-align: middle;
            margin-right: 13px;
        }
    }
    .noticeCon{
        display: inline-block;
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        li{
            height: 60px;
            width: 100%;
            line-height: 60px;
             overflow: hidden;
             overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 24px;
                    white-space: nowrap;
        }
        ul{
            transform:translate(0,0);
            transition:transform 0.5s;
        }
    }
</style>













