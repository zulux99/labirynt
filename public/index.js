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
var temp = JSON.parse('{"type":"join"}');

function join() {


    let difficulty = document.getElementById('difficulty').value;
    console.log(JSON.stringify(temp) + difficulty);
    socket.send(JSON.stringify(temp))
}

function addGame() {

    const dimensionsx = document.getElementById("dimensionsx").value;
    const dimensionsy = document.getElementById('dimensionsy').value;
    const opis = document.getElementById('opis').value;
    let publicval = document.getElementById('publicval').value;
    if (publicval == 'on') {
        publicval = true
    } else {
        publicval = false
    }
    let difficulty = document.getElementById('difficulty').value;
    const text = '{"type":"createNewGame","dimensionsx":"' + dimensionsx + '","dimensionsy":"' + dimensionsy + '","playerMaxCount":"2","opis":"' + opis + '","publicval":' + publicval + ',"difficulty":"' + difficulty + '"}'
    console.log(text)
    var temp = JSON.parse(text);
    console.log(JSON.stringify(temp));
    socket.send(JSON.stringify(temp))
    socket.onmessage = function (event) {
        console.log(event.data);
        const obj = JSON.parse(event.data);
        if (typeof obj.id != undefined) {
            if (obj.id == "join") {
                alert("juz grasz ")
            } else {
                const d = new Date();
                document.cookie = "id=" + obj.id + "; expires=" + d.setTime(d.getTime() + (999 * 24 * 60 * 60 * 1000)) + " ; max-age=3600;path=/   ";
                document.cookie = "idgame=" + obj.idgame + "; expires=" + d.setTime(d.getTime() + (999 * 24 * 60 * 60 * 1000)) + " ; max-age=3600;path=/   ";
                window.location.href = "http://localhost/game";
            }

        }
    }
}