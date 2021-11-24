import { acceptWebSocket,acceptable,WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import {Game,Games} from '../models/gameModel.ts';

const sockets = new Map<string, WebSocket>()

const gamesArrary: Game[] = []
const temp:Game={
dimensionsx: 10,dimensionsy: 12,opis: 'abc',playerMaxCount: 2,map: "",public:true
}
gamesArrary.push(temp);

console.log("start",gamesArrary)
export async function websocetindex(sock: WebSocket) {
  const uid = v4.generate()

  sockets.set(uid, sock)
  sockets.get(uid)?.send('connected: '+uid);
  console.log('connected: '+uid)
  for await (const ev of sock) {
      if (isWebSocketCloseEvent(ev)) {
        console.log(ev)
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