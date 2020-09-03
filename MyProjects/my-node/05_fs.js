let fs = require('fs');
// fs.stat('./01_http.js',(err,stats)=>{
//     console.log(stats.isFile())
// });
// fs.unlink('./555.js',(err)=>{
// });
// fs.writeFile('./5556.js','1',(err)=>{

// });
// fs.appendFile('./5556.js','</br>2',(err)=>{

// });
// fs.readFile('./5556.js',(err,data)=>{
//     console.log(data.toString())
// })
// fs.readdir('./',(err,data)=>{
//     console.log(data);
    
// })
fs.rename('./666.js','aaa/666.js',err=>{
    console.log(err);
    
})