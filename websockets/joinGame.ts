import { WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import {Game,Games,Player,DataWebsocet} from '../models/gameModel.ts';
import {Random} from 'https://deno.land/x/random@v1.1.2/Random.js';

const sockets = new Map<string, WebSocket>()
const r = new Random();


let gamesArrary: Game[] = []
console.log("start",gamesArrary)
export async function websocetindex(sock: WebSocket) {
    const uid = v4.generate()
    

    console.log("midle",gamesArrary)
    sockets.set(uid, sock)
    sockets.get(uid)?.send('connected: '+uid+' random: '+r.string(5  ));
    console.log('connected: '+uid+' random: ')
    for await (const ev of sock) {
        if (isWebSocketCloseEvent(ev)) {
          console.log(ev)
            sockets.delete(uid)
            return
        }
        if (typeof ev === "string") { 
            try{
            let obj: DataWebsocet = JSON.parse(ev)
            if(obj.type==="join"){
                broadcastMessage("mapa", uid)
                 }
                 if(obj.type==="broadcastMessage"){
                     broadcastMessage("broadcastMessage", uid)
                     }
            }catch(error){
                sockets.get(uid)?.send('Error');                
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
function mazeGeneration():string{

  
return "maze"
}
async function getJson(filePath: string) {
    try {
        return JSON.parse(filePath);
    } catch(e) {
        console.log(filePath+'błąd: '+e.message);
    }
}