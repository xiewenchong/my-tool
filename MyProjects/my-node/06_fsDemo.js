let fs = require('fs');
// fs.stat('upload',(err,stats)=>{
//     if(err) {
//         fs.mkdir('upload',(err)=>{

//         })
//     }
// })
// -----------------------------------------------------------------
// fs.readdir('aaa',(err,data)=>{
//     console.log(data);
//     let File = [];
//     (function getFile(i){
//         if(i==data.length) {
//             console.log(File);
//             return false
//         }
//         fs.stat(`aaa/${data[i]}`,(err,stats)=>{
//             // console.log(stats);
            
//             if(stats.isDirectory()) {
//                 File.push(data[i]);
//             }
//             getFile(i+1)
//         });
//     })(0)

// })
// -----------------------------------------------------------------
// let s = fs.createReadStream('./aaa/666.js');
// let str='';
// s.on('data',(chunk)=>{
//     console.log(`接收到：${chunk.length}`);
//     str+= chunk;
// })
// s.on('end',()=>{
//     console.log('结束了',str);
    
// });
// s.on('error',err=>{

// })
// -----------------------------------------------------------------
let data = 'console.log("Hello World! 我要存入数据！")';
let w = fs.createWriteStream('./aaa/666.js');
w.write(data,'utf8');
w.end();
w.on('finish',()=>{
    console.log('写入完成！');
});