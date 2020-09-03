<template>
	<div>
	<el-card class="userDetails" >
		<div  slot="header" class="clearfix">
		    <span>名称:{{num}}</span>
		</div>
		<div class="text ">
		    <div class="item">
		    	用户详情：按法规的嘎嘎收到广东省高速大公司的
		    </div>
		    <div class="item">
		    	错误内容：asjhaisjfjsafjasfjhasjfajsfjj
		    </div>
		    <div class="item">
		    	自定义内容：的萨芬卡兰蒂斯能否看到你的卡夫卡的那个端口
		    </div>
		</div>
	</el-card>
	<el-card class="userdata" >
	  <div slot="header" class="clearfix">
	    <span>用户数据</span>
	    <div style="clear:both;"></div>
		    <div>
		    	<p>windows</p>
		    	<p>windows</p>
		    </div>
		    <div>
		    	<p>windows</p>
		    	<p>windows</p>
		    </div>
	    </div>
		  <div class="text ">
		  		<div class="title">
		  			
		  		</div>
		  		<div class="content"></div>
			    <div class="item2">
			    	<span>当前URL:</span><div>http://www.baidu.com/</div>
			    </div>
			    <div class="item2">
			    	<span>User Agent:</span><div>http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/</div>
			    </div>
			    <div class="item2">
			    	<span>来源:</span><div>http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/http://www.baidu.com/</div>
			    </div>
		  </div>
	</el-card>
	</div>
	  
	  
	
</template>
<script>
import bus from '../assets/eventBus';

	export default {
		data() {
			return{
				num:''
			}
		},
		created(){
			// var self = this;
			// console.log(this.num);//  空
			bus.$on("senddata",function(data){
				self.num=data;
				console.log(self.num);//2
				console.log(data);//2
			});
			// console.log(self.num);  //  空
			// console.log(this.$route.params.usernum);
		}

	}	
</script>
<style scoped>
	.text {
    font-size: 14px;
  }

  .item {
    background-color: #F5F5F5;
    margin-bottom: 15px;
    word-break: break-all;
  }
  .item2 {
  	margin-bottom: 15px;
  	word-break: break-all;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .userDetails {
    width: 1050px;
    float: left;
    margin: 0 50px 30px 0;
  }
  .userdata {
  	width: 480px;
  	float: left;
  	background-color: #2196F3;
  	color: #fff;
  }
  .configdata {
  	width: 40%;
  	float: left;
  	margin-top: 15px;
  	word-break: break-all;
  }
  .userdata span {
  }
  .item2 div {
  	
  }
</style>