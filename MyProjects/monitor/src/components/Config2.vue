<template>
<el-row>
  <el-col :span="24">
    <el-card shadow="always">
      项目1
      <span>
      	监控开关
      	<el-switch
		  v-model="value1"
		  active-color="#13ce66">
		</el-switch>
      </span>
    </el-card>
  </el-col>
  <el-col :span="24">
    <el-card shadow="always">
      项目2
      <span>
      	监控开关
      	<el-switch
		  v-model="value2"
		  active-color="#13ce66">
		</el-switch>
      </span>
    </el-card>
  </el-col>
  <el-col :span="24">
    <el-card shadow="always">
      项目3
      <span>
      	监控开关
      	<el-switch
		  v-model="value3"
		  active-color="#13ce66">
		</el-switch>
      </span>
    </el-card>
  </el-col>
</el-row>

	
</template>
<script>
	export default {
		data() {
	      return {
	        value1: true,
	        value2: true,
	        value3: true
	      }
	    }
	}	
</script>
<style scoped>
	span {
		float: right;
	}
	.el-card {
		margin-bottom: 20px;
	}
</style>