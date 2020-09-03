<template>
  <div id="app">
	<el-container>
	  <el-header>
	  	<el-select v-model="value" placeholder="请选择" style="width:15%;">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		</el-select>
	  </el-header>

	  <el-container style="height:880px;">
	    <el-aside width="230px">
	    	<el-col :span="10" class="nav">
			    <el-menu
			      default-active="Home"
			      class="el-menu-vertical-demo"
			      @open="handleOpen"
			      @close="handleClose"
			      router>
			      
				  <el-menu-item index="Home">
			        	<i class="el-icon-tickets"></i>
			        	<span>概览</span>
			      </el-menu-item>
			      <el-submenu index="1">
			        <template slot="title">
			          <i class="el-icon-info"></i>
			          <span>汇总</span>
			        </template>
			        <el-menu-item-group>
			                <el-menu-item index="script">程序错误</el-menu-item>
				        	<el-menu-item index="Error_lists">资源加载</el-menu-item>
				          	<el-menu-item index="Network">网络请求</el-menu-item>
			        </el-menu-item-group>
			      </el-submenu>

			      <el-submenu index="2">
			        <template slot="title">
			          <i class="el-icon-location"></i>
			          <span>分布</span>
			        </template>
			        <el-menu-item-group>
			          <el-menu-item index="Urls">按页面</el-menu-item>
			          <el-menu-item index="Browsers">按浏览器</el-menu-item>
			          <!-- <el-menu-item index="2-3">按操作系统</el-menu-item> -->
			          <el-menu-item index="Ips">按访问IP</el-menu-item>
			        </el-menu-item-group>
			      </el-submenu>

			      <el-menu-item index="Daily">
			        <i class="el-icon-menu"></i>
			        <span slot="title">趋势</span>
			      </el-menu-item>

			      <el-submenu index="4">
			        <template slot="title">
			          <i class="el-icon-setting"></i>
			          <span>管理</span>
			        </template>
			        <el-menu-item-group>
			          <el-menu-item index="config2">项目设置</el-menu-item>
			          <el-menu-item index="Config">设置</el-menu-item>
			        </el-menu-item-group>
			      </el-submenu>

			      
			    </el-menu>
			  </el-col>
	    </el-aside>

	    <el-main>
	    	 <router-view></router-view>
	    </el-main>

	  </el-container>
	</el-container>

  </div>
</template>

<script>

export default {
	  name: 'App',
	  data() {
	      return {
	        options: [{
	          value: '选项1',
	          label: '分销系统'
	        }, {
	          value: '选项2',
	          label: 'eb系统'
	        }, {
	          value: '选项3',
	          label: '云客赞'
	        }, {
	          value: '选项4',
	          label: 'm版'
	        }],
	        value: ''
	      }
	   },
	  methods: {
	      handleOpen(key, keyPath) {
	        console.log(key, keyPath);
	      },
	      handleClose(key, keyPath) {
	        console.log(key, keyPath);
	      }
	      
	  }
  
}
</script>

<style scoped>
a {
	text-decoration: none;
}
.nav {
	width: 99%;
	height: 100%;
}
.el-menu {
	font-size: 16px;
	height: 100%;
	border-right: none;
}
span {
	margin: 0 100px 0 0;
}
.el-menu-item {

}
.el-header {
    background-color: #52ABF1;
    /*border-bottom:1px solid #000;*/
    line-height: 60px;
 }
  
  .el-aside {
    background-color: #ECF5FF;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-main{
  	 overflow-x: hidden;
  }
</style>
