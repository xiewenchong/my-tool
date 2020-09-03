<template>
	<div>
		<el-button type="primary" class="selectbtn">搜索</el-button>
	  	<div style="clear:both;"></div>
		<el-card>
		  <el-table
		    :data="tableData"
		    stripe
		    style="width: 100%;cursor:pointer;"
		    @row-click="ToDetails">
		    <el-table-column
		      prop="time"
		      label="时间"
		      width="180">
		    </el-table-column>
		    <el-table-column
		      prop="content"
		      label="地址">
		    </el-table-column>
		     <el-table-column
		      prop="usernum"
		      label="用户数">
		    </el-table-column>
		  </el-table>
		 </el-card>

		 <div class="block">
		    <el-pagination
		      :current-page.sync="currentPage1"
		      :page-size="100"
		      layout="total, prev, pager, next"
		      :total="1000">
		    </el-pagination>
		  </div>
  </div>
</template>

<script>
import bus from '../assets/eventBus';
  export default {
    data() {
      return {
      	currentPage1: 5,
        tableData: [{
          time: '2018-01-01',
          content: '杀对方水电费第三方的范德萨发斯蒂芬8 弄',
          usernum:'1'
        }, {
          time: '2018-01-01',
          content: '杀对方水电费第三方的范德萨发斯蒂芬7 弄',
          usernum:'2'
        }, {
          time: '2018-01-01',
          content: '杀对方水电费第三方的范德萨发斯蒂芬9 弄',
          usernum:'3'
        }, {
          time: '2018-01-01',
          content: '杀对方水电费第三方的范德萨发斯蒂芬6 弄',
          usernum:'4'
        }]
      }
    },
    methods:{
    	ToDetails(row,event,column) {
    		bus.$emit("senddata",row.usernum);
    		this.$router.push({name:'Error_Details'});
    // 		this.$router.push({
    // 			name:'Error_Details',
    // 			params:{
				//     name:'Error_Details',
				//     usernum:row.usernum
				// }
    // 		});
    	}
    }
  }
</script>

<style scoped>
.selectbtn {
	float: right;
}
.el-card {
	margin-top: 20px;
}
.block {
	margin-top:15px;
	float: right;
}
</style>