<template>
  <div class="hello">

    <el-container>
      <!-- <el-header>
        <div class="title">
          <div class="el-icon-document"></div>
          分销数据看板
          <div class="out">退出</div>
           <div class="userinfo"><span class="el-icon-picture"></span>某某某</div>
        </div>
       
      </el-header> -->
      <el-container>
        <!-- <el-aside width="200px">Aside</el-aside> -->
        <el-main>
          <div class="Index">
            <div id="content"><span>关键指标</span> </div>
            <div id="index">
              <div class="index">
                <p>交易额</p>
                <p>￥30,202</p>
                <p>日 ^25%</p>
              </div>
              <div class="index"></div>
              <div class="index"></div>
              <div class="index"></div>
              <div class="index"></div>
            </div>
          </div>
          

          <div style="clear:both;"></div>

          <div class="clear"></div>

          <!-- 时间选择器 -->
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

          <!-- 表格图表 -->
          <div style="width:100%;">
            <el-tabs type="border-card">
              <el-tab-pane label="用户数据">
                <div style="width:1500px;height:350px; " id="chartColumn"></div>
              </el-tab-pane>
              <el-tab-pane label="客均使用时长">
                <div style="width:1500px;height:350px; " id="chartBar"></div>
              </el-tab-pane>
              <el-tab-pane label="次均时长">
                <div style="width:1500px;height:350px; " id="chartLine"></div>
              </el-tab-pane>
              <el-tab-pane label="日均频次">
                <div style="width:1500px;height:350px; " id="chartPie"></div>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 详细数据表格 -->
          <div style="text-align:left;margin-top:15px;">详细数据</div>
          <el-table
            :data="tableData6"
            border
            show-summary
            style="width: 100%; margin-top: 20px">
            <el-table-column
              prop="id"
              label="ID"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              sortable
              align="center">
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="数值 1（元）"
              sortable
              align="center">
            </el-table-column>
            <el-table-column
              prop="amount2"
              label="数值 2（元）"
              sortable
              align="center">
            </el-table-column>
            <el-table-column
              prop="amount3"
              label="数值 3（元）"
              sortable
              align="center">
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
              </el-main>
            </el-container>
          </el-container>
  </div>
</template>
<script>
import echarts from 'echarts'
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        value6: '',
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null,
        
        //表格数据
        tableData6: [{
          id: '12987122',
          name: '啊小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '吧小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '次小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '的小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '饿小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }],
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
        }
      }
      
    },
    methods: {

      drawColumnChart() {
        this.chartColumn = echarts.init(document.getElementById('chartColumn'));
        this.chartColumn.setOption({ 

          tooltip: {},
          xAxis: {
              data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
        });
      },
    drawBarChart() {
        this.chartBar = echarts.init(document.getElementById('chartBar'));
        this.chartBar.setOption({
          backgroundColor:'#fff',
          //图例设置，包括位置，折叠方式等，需与下面series的name对应
          legend: {
              type:'scroll',
              data:['今天','昨天','上周同期','上月同期'],
              bottom:0,
              textStyle:{
                  color:'#000'
              }
          },
          //工具栏
          toolbox: {
              right:30,
              top:10,
              show : true,
              feature : {
                  dataView : {show: true, readOnly: true},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
              },
              iconStyle:{
                 borderColor:'#ccc'
              }
          },
          tooltip : {
              trigger: 'axis'
          },
          xAxis: {
              //坐标轴文本颜色
              axisLabel: {
                              show: true,
                              textStyle: {
                                  color: '#000'
                              }
              },
              type: 'category',
              boundaryGap : false,//x轴的值对齐
              data: ['0.00', '2.00', '4.00', '6.00', '8.00', '10.00', '12.00', '14.00', '16.00', '18.00', '20.00', '22.00'],
              axisLine:{
                  lineStyle:{
                      color:'#000',
                       width:1,//这里是为了突出显示加上的
                  }
              }
          },
          yAxis: {
              type: 'value',
              axisLabel : {
                              show: true,
                              textStyle: {
                                  color: '#000'
                              }
              },
              axisLine:{
                  lineStyle:{
                      color:'#000',
                       width:1,//这里是为了突出显示加上的
                  }
              }
          },
          series: [{
              name:'今天',
              data: [500, 932, 901, 934, 1290, 1330, 2600],
              type: 'line',
              markPoint : {
                      data : [
                          {type : 'max', name: '最大值'},
                          {type : 'min', name: '最小值'}
                      ]
              },
              //平均值的线
              // markLine : {
              //         data : [
              //             {type : 'average', name : '平均值'}
              //         ],
              //         lineStyle:{
              //             color:'#000'
              //     }       
              // }
          }, 
          {
              name:'昨天',
              data: [500, 453, 777, 222, 233, 666, 2444,1523,3211,2232,2212,1211],
              type: 'line',
              itemStyle:{
                          normal:{
                              color:'#000'
                          }
              },
          },
          {
              name:'上周同期',
              data: [500, 2222, 1901, 1212, 1233, 1730, 1452,1232,2222,1111,1222],
              type: 'line'
          },
          {
              name:'上月同期',
              data: [500, 1932, 1901, 1934, 1290, 1330, 2600,2222,1112,1132,2812],
              type: 'line'
          }]
                  });
              },
    drawLineChart() {
      this.chartLine = echarts.init(document.getElementById('chartLine'));
      this.chartLine.setOption({
        backgroundColor:'#fff',
          textStyle:{
              color:'#000',
              fontWeight:'bold'
          },
          tooltip : {
              trigger: 'axis'
          },
          xAxis: [{
              show: false,
              type: 'value',
              splitLine: {
                  show: false
              },
               axisLabel: {
                  show: true,
                  formatter:'{value}%',
                          textStyle: {
                              color: '#000'
                          }
              }
              
          }],
          yAxis: [{
              name:'详细数据',
              type: 'category',
              data:['广东','广西','湖南','湖北','河南','北京','上海','海南','河北','四川','其他'],
              axisLabel: {
                  show: true,
                          textStyle: {
                              color: '#000'
                          }
              },
              splitLine: {
                  show: false
              }
          },],
          series: [{
              type: 'bar',
              label: {
                  //将数据显示在柱状条旁边
                  normal: {
                      position: 'right',
                      show: true
                  }
              },
              itemStyle:{
                  color:'#fff',
                  borderColor:'#000'
              },
              data: [15,14,13,12,11,10,9,8,7,6,5]
          }, ]
              });
          },
    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById('chartPie'));
      this.chartPie.setOption({
        backgroundColor:'#fff',
        //图例设置，包括位置，折叠方式等，需与下面series的name对应
        legend: {
            type:'scroll',
            data:['今天','昨天','上周同期','上月同期'],
            bottom:0,
            textStyle:{
                color:'#000'
            }
        },
        //工具栏
        toolbox: {
            right:30,
            top:10,
            show : true,
            feature : {
                dataView : {show: true, readOnly: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            },
            iconStyle:{
               borderColor:'#ccc'
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        xAxis: {
            //坐标轴文本颜色
            axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#000'
                            }
            },
            type: 'category',
            boundaryGap : false,//x轴的值对齐
            data: ['0.00', '2.00', '4.00', '6.00', '8.00', '10.00', '12.00', '14.00', '16.00', '18.00', '20.00', '22.00'],
            axisLine:{
                lineStyle:{
                    color:'#000',
                     width:1,//这里是为了突出显示加上的
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel : {
                            show: true,
                            textStyle: {
                                color: '#000'
                            }
            },
            axisLine:{
                lineStyle:{
                    color:'#000',
                     width:1,//这里是为了突出显示加上的
                }
            }
        },
        series: [{
            name:'今天',
            data: [500, 932, 901, 934, 1290, 1330, 2600],
            type: 'line',
            markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
            },
            //平均值的线
            // markLine : {
            //         data : [
            //             {type : 'average', name : '平均值'}
            //         ],
            //         lineStyle:{
            //             color:'#000'
            //     }       
            // }
        }, 
        {
            name:'昨天',
            data: [500, 453, 777, 222, 233, 666, 2444,1523,3211,2232,2212,1211],
            type: 'line',
            itemStyle:{
                        normal:{
                            color:'#000'
                        }
            },
        },
        {
            name:'上周同期',
            data: [500, 2222, 1901, 1212, 1233, 1730, 1452,1232,2222,1111,1222],
            type: 'line'
        },
        {
            name:'上月同期',
            data: [500, 1932, 1901, 1934, 1290, 1330, 2600,2222,1112,1132,2812],
            type: 'line'
        }]
      });
    },
    drawCharts() {
      this.drawColumnChart()
      this.drawBarChart()
      this.drawLineChart()
      this.drawPieChart()
    },

    //分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  mounted: function () {
            this.drawCharts()
  },
  updated: function () {
            this.drawCharts()
  }
}
</script>

<style scoped>
/*头部*/
.title {
  text-align: left;
}
.el-icon-document {
  font-size: 32px;
  vertical-align: middle;
}
.userinfo {
  float: right;
}

.out {
  float: right;
  margin-left: 20px;
}

/*内容部分*/
.block {
  text-align:left;
  margin-bottom: 15px;
}
.Index {
  width: 100%;
  height: 160px;
  border: 1px solid #000;
  margin-bottom: 20px;
  font-weight: bold;
}
#content {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #000;
  text-align:left;
}
#content span{
  margin: 0 0 0 15px;
  line-height: 30px;
}
#index {
  width: 100%;
  float: left;
  text-align: left;
}
.index {
  width: 19.92%;
  height: 130px;
  float: left;
  border-right: 1px solid #000;
}
.index:last-child{
  border-right: none;
}
.index p{
  margin-left: 20px;
  line-height: 15px;
}
.index p:nth-child(2) {
  font-size: 24px;
}
.el-pagination{
  margin: 10px 0;
  float: right;
}
.el-header {
    background-color: #E1E1DE;
    /*border-bottom:1px solid #000;*/
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
</style>


