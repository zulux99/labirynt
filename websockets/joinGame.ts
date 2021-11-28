import { WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import {Game,Games,Player} from '../models/gameModel.ts';
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
            if(ev==="join"){
              
              
            broadcastMessage("mapa", uid)
            }

            const x=ev+" "+uid
            console.log(x)
            broadcastMessage(x, uid)

        }

    }
}


function broadcastMessage(message: string, uid: string) {
  sockets.forEach((socket, id) => {
      if (!socket.isClosed )
          socket.send(message)
  })
}
function mazeGeneration():string{

  
return "maze"
}
