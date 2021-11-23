import { serve } from "https://deno.land/std@0.87.0/http/server.ts";
import { acceptWebSocket,acceptable,WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.1/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
// import { joinGame } from './websockets/joinGame.ts';
import {game} from './models/gameModel.ts';


const sockets = new Map<string, WebSocket>()
const server=serve({ port: 80 })
let games:game=new game('132',10,12,2)
console.log(games)
console.log("start")
for await (const req of server) {
    
    if (req.url === '/') {
        req.respond({
            status: 200,
            body: await Deno.open('./public/index.html')
          });
    } else if (req.url === '/about') {
        req.respond({
            status: 200,
            body: await Deno.open('./public/index.html')
          });
      }
      else if (req.url === '/join') {
        if (acceptable(req)) {
            
            const { conn, r: bufReader, w: bufWriter, headers } = req;
            acceptWebSocket({
              conn ,
              bufReader,
              bufWriter,
              headers
            })
            .then(handleWs)
            .catch(console.error);
          }

      }else{
            await staticFiles('public')(req);
        
      }
       
  }


function broadcastMessage(message: string, uid: string) {
    sockets.forEach((socket, id) => {
        if (!socket.isClosed && uid !== id)
            socket.send(message)
    })
}

async function handleWs(sock: WebSocket) {
    console.log('connected')
    const uid = v4.generate()
    sockets.set(uid, sock)
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



// for await (const req of server ) {
//     const { conn, r: bufReader, w: bufWriter, headers } = req;

//     acceptWebSocket({
//         conn,
//         bufReader,
//         bufWriter,
//         headers,
//     }).then(handleWs)
//      .catch(console.error)
// }