<template>
	<el-card class="box-card">
	  <div class="clearfix">
	    <span>项目设置</span>
	    <div>
	    	<p class="demo">项目名称</p>
	    	<p class="demoname">Demo</p>
	    </div>
	  </div>
	  <div class="behavior">
	  	<p class="demo">行为</p>
  		<el-checkbox-group v-model="checkList">
  		<div class="check">
		    <el-checkbox label="监听代码异常"></el-checkbox>
		    <el-checkbox label="监听接口异常"></el-checkbox>
		</div>
		<div class="check">    
		    <el-checkbox label="监听自定义内容"></el-checkbox>
		</div>    
		</el-checkbox-group>
	  </div>
	  <div class="custom-content">
			<p>不监听的资源或者URL</p>
			<div class="input">
				<input type="text" name="" placeholder="http://pgyer.com/或/^https:\/\/WWW\.pgyer\.com\/.*/">
			</div>
			<div class="input">
				<input type="text" name="" placeholder="http://pgyer.com/或/^https:\/\/WWW\.pgyer\.com\/.*/">
			</div>
			<div class="input">
				<input type="text" name="" placeholder="http://pgyer.com/或/^https:\/\/WWW\.pgyer\.com\/.*/"><span class="el-icon-circle-plus" style="color:#2196F3;cursor:pointer;" @click="more"></span>
			</div>
			<div>
				 <el-button type="primary">确认</el-button>
			</div>
	  </div>
	</el-card>
	
</template>
<script>

	export default {
		data () {
	      return {
	        checkList: ['监听代码异常','监听接口异常','监听自定义内容']
	      }
	    },
	    methods:{
	    	more:function() {
	    		
	    	}
	    }
	}	
</script>
<style scoped>
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
	    color:    #D6D2D2;
	}
	:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	   color:    #D6D2D2;
	}
	::-moz-placeholder { /* Mozilla Firefox 19+ */
	   color:    #D6D2D2;
	}
	:-ms-input-placeholder { /* Internet Explorer 10-11 */
	   color:    #D6D2D2;
	}
  span {
		font-size: 22px;
	}
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 940px;
    
  }
  .behavior {
  	margin-top: 35px;
  }
  .demo {
  	color: #6C6868;
  	font-size: 14px;
  	margin-bottom:0px;
  }
  .demoname {
  	font-size: 20px;
  	border-bottom: 1px solid #ccc;
  	margin-top: 5px;
  }
  .el-checkbox {
  	font-size: 24px;
  	margin-right: 35%;
  	margin-top: 20px;
  }
  .custom-content {
  	margin-top: 35px;
  	margin-bottom :30px;
  }
  .custom-content p {
	color: #6C6868;
  	font-size: 14px;
  }
  
  input {
  	font-weight: normal;
  	font-size: 20px;
  	width: 96%;
	border: none;
	height: 24px;
	outline: none;
	border-bottom: 1px solid #ccc;
  }
  
  .input {
  	margin-bottom: 10px;
  	
  }
  .el-button {
  	float: right;
  	margin: 20px 0;
  }
</style>