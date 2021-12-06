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
// console.log(mazeGeneration(5, 4));

let gamesArrary: Game[] = [];
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
            gamesArrary.every((element) => {
              if (element.playerMaxCount > element.playersIdArrary.length) {
                element.playersIdArrary.push({
                  id: uid,
                  name: UserName,
                  idWebsocet: uid,
                  x: element.dimensionsx - 1,
                  y: element.dimensionsy - 1,
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
            gamesArrary.push(
              AddGame(
                idgame,
                dataVreateGame.dimensionsx,
                dataVreateGame.dimensionsy,
                dataVreateGame.playerMaxCount,
                dataVreateGame.opis,
                JSON.stringify(mazeGeneration(
                  dataVreateGame.dimensionsx,
                  dataVreateGame.dimensionsy,
                )),
                dataVreateGame.publicval,
                dataVreateGame.difficulty,
                [{ id: uid, name: UserName, idWebsocet: uid, x: 1, y: 1 }],
              ),
            );
            sockets.get(uid)?.send(
              '{"id":"' + uid + '","idgame":"' + idgame + '"}',
            );
          }
        } else if (obj.type === "broadcastMessage") {
          broadcastMessage("broadcastMessage", uid);
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
  function wybieranie(
    array: Array<Array<number>>,
    x: number,
    y: number,
    a: number,
    b: number,
  ) {
    if (array[y][x - 1] == 3 && x - 1 != a) {
      array[y][x - 1] = 1;
    }
    if (array[y][x + 1] == 3 && x + 1 != a) {
      array[y][x + 1] = 1;
    }
    if (array[y - 1][x] == 3 && y - 1 != b) {
      array[y - 1][x] = 1;
    }
    if (array[y + 1][x] == 3 && y + 1 != b) {
      array[y + 1][x] = 1;
    }
    return array;
  }
  let mazeArrary = [];
  for (let index = 0; index < (dimensionsy * 2) + 1; index++) {
    mazeArrary[index] = Array((dimensionsx * 2) + 1).fill(1);
  }
  for (let indexy = 0; indexy < mazeArrary.length; indexy++) {
    for (let indexx = 0; indexx < mazeArrary[indexy].length; indexx++) {
      if (
        indexy != 0 && indexy != (dimensionsy * 2) && indexx != 0 &&
        indexx != (dimensionsx * 2)
      ) {
        if (indexy % 2 == 1 || indexx % 2 == 1) {
          mazeArrary[indexy][indexx] = 0;
          // mazeArrary[indexy][indexx] = 3;
        }
      }
    }
  }

  let x: number = r.int(1, (dimensionsx * 2) - 1);
  let y: number = r.int(1, (dimensionsy * 2) - 1);

  while (false) {
    do {
      y = (r.int(0, dimensionsy - 1) * 2) + 1;
      x = (r.int(0, dimensionsx - 1) * 2) + 1;
      x = 3;
      y = 3;
      console.log(x, y, mazeArrary[y][x], " a");
    } while (mazeArrary[y][x] != 3);
    mazeArrary[y][x] = 0;
    while (true) {
      console.log(mazeArrary, "==================");
      let maxkierunek = 0;
      if (mazeArrary[y - 1][x] == 3) {
        maxkierunek += 1;
      }
      if (mazeArrary[y + 1][x] == 3) {
        maxkierunek += 1;
      }
      if (mazeArrary[y][x - 1] == 3) {
        maxkierunek += 1;
      }
      if (mazeArrary[y][x + 1] == 3) {
        maxkierunek += 1;
      }
      if (maxkierunek == 0) {
        break;
      }
      let kierunek = r.int(1, maxkierunek);
      if (mazeArrary[y - 1][x] == 3 && kierunek != 0) {
        kierunek -= 1;
      }
      if (kierunek == 0) {
        mazeArrary[y - 1][x] = 0;
        mazeArrary[y - 2][x] = 0;
        mazeArrary = wybieranie(mazeArrary, x, y, x, y - 1);
        y -= 2;
        kierunek -= 1;
      }
      if (mazeArrary[y + 1][x] == 3 && kierunek != 0) {
        kierunek -= 1;
      }
      if (kierunek == 0) {
        mazeArrary[y + 1][x] = 0;
        mazeArrary[y + 2][x] = 0;
        mazeArrary = wybieranie(mazeArrary, x, y, x, y + 1);
        y += 2;
        kierunek -= 1;
      }
      if (mazeArrary[y][x - 1] == 3 && kierunek != 0) {
        kierunek -= 1;
      }
      if (kierunek == 0) {
        mazeArrary[y][x - 1] = 0;
        mazeArrary[y][x - 2] = 0;
        mazeArrary = wybieranie(mazeArrary, x, y, x - 1, y);
        x -= 2;
        kierunek -= 1;
      }
      if (mazeArrary[y][x + 1] == 3 && kierunek != 0) {
        kierunek -= 1;
      }
      if (kierunek == 0) {
        mazeArrary[y][x + 1] = 0;
        mazeArrary[y][x + 2] = 0;
        mazeArrary = wybieranie(mazeArrary, x, y, x, y - 1);
        x += 2;
        kierunek -= 1;
      }
    }

    break;
  }

  return JSON.stringify(mazeArrary);
}
