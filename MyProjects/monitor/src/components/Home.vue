<template>
  <div>
  	<el-button type="primary" class="selectbtn" @click="open7=true">搜索</el-button>
  	<div style="clear:both;"></div>
	<div class="statistics">
		<el-row :gutter="50">
		  <el-col :span="6">
		    <el-card shadow="always">
		    	<p>JS错误</p>
		      	<strong>{{}}</strong>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="always">
		      	<p>接口错误</p>
		      	<strong>{{}}</strong>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="always">
		      	<p>自定义错误</p>
		      	<strong>{{}}</strong>
		    </el-card>
		  </el-col>
		</el-row>
	</div>
	
	 <div class="block">
      <el-date-picker
        v-model="value6"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2">
      </el-date-picker>
     </div>

	<div class="data-echart">
		<el-card class="box-card">
		  <ve-line :data="chartData" :settings="chartSettings"></ve-line>
		</el-card>
	</div>

	<div class="data">
		<el-row :gutter="30">
		  <el-col :span="12">
		    <el-card shadow="always">
		    	<span class="left">页面地址</span><a class="more">更多</a>
		    	<div style="clear:both;"></div>
		    	<div v-for="o in 5" :key="o" class="text item">
		    		<a href=""><small>{{'https://www.baidu.com ' + o }}</small></a><span>10</span>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="always" style="background-color:#6ECD72;"  class="ip">
		    	<span class="left">IP地址</span><a class="more hover">更多</a>
		    	<div style="clear:both;"></div>
		    	<div v-for="o in 5" :key="o" class="text item">
		    		<a href="" class="color"><small>{{'192.168.1.1 ' + o }}</small></a><span>10</span>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="always" style="background-color:#24D6ED;"  class="browser">
		    	<span class="left">浏览器类型</span><a class="more hover">更多</a>
		    	<div style="clear:both;"></div>
		    	<div v-for="o in 5" :key="o" class="text item">
		    		<a href="" class="color"><small>{{'Chrome ' + o }}</small></a><span>10</span>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
	</div>
  	
  </div>
</template>

<script>
import echarts from 'echarts'
export default {	
	data () {
       this.chartSettings = {
        stack: { '用户': ['访问用户', '下单用户'] },
        area: true
      }
      return {
        chartData: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        },
        value6:'',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dialogFormVisible: false
      }
    },
    methods: {
      
    },
    mounted() {
        
    }
}
</script>

<style scoped>
a {
	text-decoration: none;
	color: #000;
}
a:hover {
	text-decoration: underline;
}
.color {
	color: #fff;
}
.selectbtn {
	float: right;
}
.statistics {
	margin-top: 15px;
}
.statistics .el-card {
	height: 100px;
	padding-left: 15px;
 	padding-bottom: 20px;
}
.block {
	margin-top:25px;
	margin-bottom:-13px;
}
.data-echart {
	margin-top: 25px;
}
.box-card {
    width: 99%;
    height: 420px;
 }
.data {
	margin-top: 25px;
}
.data .item {
	margin-top: 10px;
}

.data span {
	float: right;
}
.data .left {
	float: left;
}
.data .more {
	float: right;
	cursor: pointer;
}
.data .ip, .browser {
	color: #fff;
}
.data .hover {
	color: #fff;
}


</style>