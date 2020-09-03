// var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
//        var seconds = (mss % (1000 * 60)) / 1000;
// --------------------- 


//getEndTime('2018/8/8 8:0:0') // "剩余时间172天 12小时 10 分钟47 秒"


const getEndTime = endTime => {
  var startDate=new Date();  //开始时间，当前时间
  var endDate=new Date(endTime); //结束时间，需传入时间参数
  var t=endDate.getTime()-startDate.getTime();  //时间差的毫秒数
  var d=0,h=0,m=0,s=0;
  if(t>=0){
    d=Math.floor(t/1000/3600/24);
    h=Math.floor(t/1000/60/60%24);
    m=Math.floor(t/1000/60%60);
    s=Math.floor(t/1000%60);
    return "剩余时间"+d+"天 "+h+"小时 "+m+" 分钟"+s+" 秒";
  } else{
    return "结束"
  }
  
}


export { getEndTime }