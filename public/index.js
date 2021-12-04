const socket = new WebSocket('ws://localhost/join');
socket.addEventListener('open', function (event) {
socket.send('Hello Server!');
    console.log("witaj");
});

socket.addEventListener('message', function (event) {
console.log('Message from server ', event.data);
});
class DataWebsocet {
constructor(type, x1) {
this.type = type;
this.x1 = x1;
}
} 
var  temp=JSON.parse('{"type":"join"}');
function join(){
    console.log(JSON.stringify(temp));
    socket.send(JSON.stringify(temp))
}

// dimensionsy:number,
// playerMaxCount:number,
// opis:String,
// map:String,
// publicval:Boolean,
// difficulty:number,
function addGame(){
    var  temp=JSON.parse('{"type":"createNewGame","dimensionsx":"24","dimensionsy":"19","playerMaxCount":"2","opis":"brakOpisu","publicval":true,"difficulty":"3"}');
    console.log(JSON.stringify(temp));
    socket.send(JSON.stringify(temp))
    socket.onmessage=function (event) {
        console.log(event.data);
        const obj = JSON.parse(event.data);
        if (typeof obj.id!= undefined){
            const d = new Date();
            document.cookie = "id="+obj.id+"; expires="+d.setTime(d.getTime() + (999*24*60*60*1000))+" ; max-age=3600;path=/   ";
            window.location.href = "http://localhost/game";
        }
    }
}