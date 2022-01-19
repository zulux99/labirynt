import {
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std@0.87.0/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import {
  AddGame,
  DataWebsocet,
  DataWebsocetGame,
  DataWebsocetJoin,
  Game,
  Games,
  Player,
} from "../models/gameModel.ts";
import { Random } from "https://deno.land/x/random@v1.1.2/Random.js";
import {Maze} from "https://x.nest.land/maze_generator@0.1.1/mod.js";

function CheckIplay(array: Array<Game>, id: string): boolean {
  let temp: boolean = false;
  array.every((element) => {
    element.playersIdArrary.every((player) => {
      if (player.id == id) {
        temp = true;
        return;
      }
    });
    if (temp) {
      return;
    }
  });
  return temp;
}

const sockets = new Map<string, WebSocket>();
const r = new Random();
let gamesArrary: Game[] = [];
// console.log("lab", mazeGeneration(150,120));
console.log("start", gamesArrary);
export async function websocetindex(sock: WebSocket) {
  const uid = v4.generate();
  let UserName: string = "unknown";

  // console.log("midle", gamesArrary);
  sockets.set(uid, sock);
  // sockets.get(uid)?.send("connected: " + uid);
  console.log("connected: " + uid);
  for await (const ev of sock) {
    if (isWebSocketCloseEvent(ev)) {
      console.log(ev);
      sockets.delete(uid);
      return;
    }
    if (typeof ev === "string") {
      // console.log(ev);
      try {
        let obj: DataWebsocet = JSON.parse(ev);
        if (obj.type === "join") {
          let dataVreateJoin: DataWebsocetJoin = JSON.parse(ev);
          console.log(dataVreateJoin);
          if (dataVreateJoin.idGame != undefined) {
            gamesArrary.forEach((element) => {
              if (element.idgame == dataVreateJoin.idGame) {
                element.playersIdArrary.forEach((valplayer) => {
                  if (valplayer.id == dataVreateJoin.idPlayer) {
                    valplayer.idWebsocet = uid;
                    UserName = valplayer.name;
                    sockets.get(uid)?.send(JSON.stringify(element));
                  }
                });
              }
            });
          } else {
            let a = true;
            gamesArrary.forEach((element) => {
              if (element.playerMaxCount > element.playersIdArrary.length) {
                element.playersIdArrary.push({
                  id: uid,
                  name: UserName,
                  idWebsocet: uid,
                  x: element.dimensionsx*32*2 - 1,
                  y: element.dimensionsy*32*2 - 1,
                  isPlaying: false,
                });
                sockets.get(uid)?.send(
                  '{"id":"' + uid + '","idgame":"' + element.idgame + '"}',
                );
                a = false;
                return;
              }
            });
            if (a) {
              sockets.get(uid)?.send(
                '{"id":"error"}',
              );
            }
          }
        } else if (obj.type === "createNewGame") {
          if (CheckIplay(gamesArrary, uid)) {
            console.log('{"id":"you play"}');
            sockets.get(uid)?.send(
              '{"id":"join"}',
            );
          } else {
            let dataVreateGame: DataWebsocetGame = JSON.parse(ev);
            let idgame = r.string(5);
            console.log("dataVreateGame.dimensionsx"+dataVreateGame.dimensionsx)
            gamesArrary.push(
              AddGame(
                idgame,
                dataVreateGame.dimensionsx,
                dataVreateGame.dimensionsy,
                2,
                dataVreateGame.opis,
                JSON.stringify(mazeGeneration(
                  dataVreateGame.dimensionsx,
                  dataVreateGame.dimensionsy,
                )),
                dataVreateGame.publicval,
                dataVreateGame.difficulty,
                [{ id: uid, name: UserName, idWebsocet: uid, x: 30, y: 40 ,isPlaying:false}],
              ),
            );
            sockets.get(uid)?.send(
              '{"id":"' + uid + '","idgame":"' + idgame + '"}',
            );
          }
        } else if (obj.type === "broadcastMessage") {
          broadcastMessage("broadcastMessage", uid);
        }else if (obj.type === "playing") {
          let dataVreateJoin: DataWebsocetJoin = JSON.parse(ev);
          console.log(dataVreateJoin);
          if (dataVreateJoin.idGame != undefined) {
            gamesArrary.forEach((element) => {
              if (element.idgame == dataVreateJoin.idGame) {
                if (element.playerMaxCount >  element.playersIdArrary.length) {
                  sockets.get(uid)?.send(
                    '{"mess":"wait"}'
                  );
                }else{
                  if (typeof element.start == "undefined") {
                    
                  element.start=Date.now()
                  }
                  // sockets.get(uid)?.send(
                  //   // '{"mess":"start","timeStart":"'+element.start+'"}'
                  // );
                  element.playersIdArrary.forEach((val) => {
                    sockets.get(val.idWebsocet)?.send('{"mess":"start","timeStart":"'+element.start+'"}');
                  });

                }
              }
            });
          } 
        } else if (obj.type === "endGame") {
          let dataWebsocetJoin: DataWebsocetJoin = JSON.parse(ev);
          gamesArrary.forEach((gamesArraryVal) => {
            if (gamesArraryVal.idgame == dataWebsocetJoin.idGame) {
              gamesArraryVal.playersIdArrary.forEach((element) => {
                if (element.id != dataWebsocetJoin.idPlayer) {
                  sockets.get(element.idWebsocet)?.send('{"type":"endGame","name":"'+element.name+'"}');
                }
              });
            }
          });

        } else if (obj.type === "changeposition") {
          console.log(ev + "}}}}}}}}}}}}}}}}}");
          let tempPlayer: Player = JSON.parse(ev);
          console.error(tempPlayer.x + "?????????");
          console.error(tempPlayer.y + "?????????");
          gamesArrary.forEach((gamesArraryVal) => {
            if (gamesArraryVal.idgame == tempPlayer.name) {
              gamesArraryVal.playersIdArrary.forEach((element) => {
                if (element.id === tempPlayer.id) {
                  element.x = Number(tempPlayer.x);
                  element.y = Number(tempPlayer.y);
                }
              });
              gamesArraryVal.playersIdArrary.forEach((element) => {
                sockets.get(element.idWebsocet)?.send(
                  JSON.stringify(gamesArraryVal.playersIdArrary),
                );
              });
            }
          });
        } else if (obj.type === "changeId") {
          // let tempPlayer: Player = JSON.parse(ev);
          // sockets.set(tempPlayer.id, sock);
          // sockets.delete(uid);
        } else if (obj.type === "setUserName") {
          let tempPlayer: Player = JSON.parse(ev);

          if (typeof tempPlayer.name != undefined) {
            UserName = String(tempPlayer.name);
          }
        } else {
          broadcastMessage("error type", uid);
        }
      } catch (error) {
        console.error;
        sockets.get(uid)?.send("Error:-" + error);
      }
    }
    // console.log(gamesArrary);
  }
}

function broadcastMessage(message: string, uid: string) {
  sockets.forEach((socket, id) => {
    if (!socket.isClosed) {
      socket.send(message.toString());
    }
  });
}
function mazeGeneration(dimensionsx: number, dimensionsy: number): string {
  let mazeArrary = [];
  // dimensionsx=50
  // dimensionsy=60
let mazeSettings = {
  width: dimensionsx,
  height: dimensionsy,
  algorithm: "binary tree"
  // algorithm: "recursive backtracker"
}
let m = Maze.create(mazeSettings);
m.generate();
m.printString();
for (let index = 0; index < dimensionsy*2+1 ; index++) {
  mazeArrary[index] = Array();
}
let tempX , tempY

mazeArrary[0][0]=1
for (let indexY = 0; indexY < m.walls.length; indexY++) {
  tempY=2*indexY
  for (let indexX = 0; indexX <  m.walls[indexY].length; indexX++) {
    tempX=2*indexX
    if (indexX==0  ) {
      mazeArrary[tempY+1][indexX]=1
      mazeArrary[tempY+2][indexX]=1
      
    }  
    if (indexY==0  ) {
      mazeArrary[tempY][tempX]=1
      mazeArrary[tempY][tempX+1]=1
      mazeArrary[tempY][tempX+2]=1
      
    } 
   
    // console.log( m.walls[indexX][indexX]);
    if (m.walls[indexY][indexX].S==true) {
      mazeArrary[tempY+2][tempX+1]=1
    }else{
      mazeArrary[tempY+2][tempX+1]=0
    }
    if (m.walls[indexY][indexX].E==true) {
      mazeArrary[tempY+1][tempX+2]=1
    }else{
      mazeArrary[tempY+1][tempX+2]=0
    }
    mazeArrary[tempY+2][tempX+2]=1
    mazeArrary[tempY+1][tempX+1]=0
  }
  
}

  return JSON.stringify(mazeArrary);
}
