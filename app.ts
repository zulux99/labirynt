import { serve } from "https://deno.land/std@0.87.0/http/server.ts";
import { acceptWebSocket,acceptable,WebSocket,isWebSocketCloseEvent} from "https://deno.land/std@0.87.0/ws/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.1/mod.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { websocetindex } from './websockets/joinGame.ts';
import {Game,Games} from './models/gameModel.ts';


const sockets = new Map<string, WebSocket>()
const server=serve({ port: 80 });
// id:string;
// dimensionsx:number;
// dimensionsy:number;
// playerMaxCount:number;
// opis:String;

let gamesArrary: Game[] = []
let temp:Game={
dimensionsx: 10,dimensionsy: 12,opis: 'abc',
playerMaxCount: 3
}
gamesArrary.push(temp);

console.log("start",gamesArrary)
for await (const req of server) {
    
    if (req.url === '/') {
        req.respond({
            status: 200,
            body: await Deno.open('./public/index.html')
          });
    } else if (req.url === '/game') {
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
            .then(websocetindex)
            .catch(console.error);
          }

      }else{
            await staticFiles('public')(req);
        
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