import { acceptWebSocket,acceptable,WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import {Game,Games} from '../models/gameModel.ts';

const sockets = new Map<string, WebSocket>()
function broadcastMessage(message: string, uid: string) {
  sockets.forEach((socket, id) => {
      if (!socket.isClosed )
          socket.send(message)
  })
}
let gamesArrary: Game[] = []
let temp:Game={
dimensionsx: 10,dimensionsy: 12,opis: 'abc',
playerMaxCount: 3
}
gamesArrary.push(temp);

console.log("start",gamesArrary)
export async function websocetindex(sock: WebSocket) {
  console.log('connected')
  const uid = v4.generate()

  sockets.set(uid, sock)
  sockets.get(uid)?.send("First");
  for await (const ev of sock) {
      if (isWebSocketCloseEvent(ev)) {
          console.log(ev)
          sockets.delete(uid)
          return
      }
      if (typeof ev === "string") {
          const x=ev+" "+uid
          console.log(x)
          broadcastMessage(x, uid)

      }

  }
}
