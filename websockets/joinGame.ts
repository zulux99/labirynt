import { WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import {Game,Games,Player,DataWebsocet,AddGame} from '../models/gameModel.ts';
import {Random} from 'https://deno.land/x/random@v1.1.2/Random.js';

const sockets = new Map<string, WebSocket>()
const r = new Random();
console.log(mazeGeneration(3,4))

let gamesArrary: Game[] = []
console.log("start",gamesArrary)
export async function websocetindex(sock: WebSocket) {
    const uid = v4.generate()
    

    console.log("midle",gamesArrary)
    sockets.set(uid, sock)
    sockets.get(uid)?.send('connected: '+uid+' random: test'+r.string(5  ));
    console.log('connected: '+uid+' random: ')
    for await (const ev of sock) {
        if (isWebSocketCloseEvent(ev)) {
          console.log(ev)
            sockets.delete(uid)
            return
        }
        if (typeof ev === "string") {
            console.log(ev) 
            try{
            let obj: DataWebsocet = JSON.parse(ev)
            console.log( JSON.parse(ev)) 
            if(obj.type==="join"){
                sockets.get(uid)?.send('join');
                 }else if(obj.type==="createNewGame"){
                    gamesArrary.push(AddGame(obj.dimensionsx,obj.dimensionsy,obj.playerMaxCount,obj.opis,"brakmapy",obj.publicval,[{id:uid,name:'abc',idWebsocet:uid}])) 
                    console.log(gamesArrary)
                    }else if(obj.type==="broadcastMessage"){
                        broadcastMessage("broadcastMessage", uid)
                        }else if(obj.type==="broadcastMessage"){
                            broadcastMessage("broadcastMessage", uid)
                            }else{
                        broadcastMessage("error", uid) 
                     }

            }catch(error){
                console.error
                sockets.get(uid)?.send('Error:-'+error);                
            }
            

            // let evObj = JSON.stringify(JSON.parse(ev.toString())).toString();
            // console.log(evObj)
            // broadcastMessage(evObj, uid)

        }

    }
}


function broadcastMessage(message: string, uid: string) {
  sockets.forEach((socket, id) => {
      if (!socket.isClosed )
          socket.send(message.toString())
  })
}
 function mazeGeneration(dimensionsx:number,dimensionsy:number):string{
// interface cell{
//     top: false,     
//       left: false,   
//       bottom: false,  
//       right: false
// }
function checkMazeEnd (array:Array<Array<number>>) {
   array.forEach(subArray => {
       subArray.forEach(element => {
           if(element==1)
           return false
       });
   });
    return true
}
let mazeArrary =[]
for (let index = 0; index < dimensionsy; index++) {
    mazeArrary[index] = Array(dimensionsx).fill(1); 
    
}
console.log(mazeArrary)
// // let loop = true
let x :number=Math.floor(Math.random() * dimensionsx)
let y :number=Math.floor(Math.random() * dimensionsy)
while (checkMazeEnd(mazeArrary)){
    mazeArrary[y][x]=0;
console.log(mazeArrary,x,y)
    do{
 x =Math.floor(Math.random() * (dimensionsx))
 y =Math.floor(Math.random() * (dimensionsy))
//  console.log(mazeArrary[y][x])
}while(mazeArrary[y][x]==0)



}

console.log(mazeArrary)
return "maze"
}
