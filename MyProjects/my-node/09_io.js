let fs = require('fs');

console.log(1)
// // console.log(2)
// // console.log(3)

// const RF = (callback) => {
//     fs.readFile('./exname.json', (err,data)=>{
//         if(err) return 
//         callback(data)
//     });
// }
// RF((res)=>{
//     console.log(res)
// });
// // console.log(3)

let events = require('events')
let Event = new events.EventEmitter();
fs.readFile('./exname.json', (err, data) => {
    if (err) return
    Event.emit('gg',data.toString());
});

Event.on('gg',(data)=>{
    console.log(data);
    
})