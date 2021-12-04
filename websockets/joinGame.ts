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

const sockets = new Map<string, WebSocket>();
const r = new Random();
console.log(mazeGeneration(5, 4));

let gamesArrary: Game[] = [];
console.log("start", gamesArrary);
export async function websocetindex(sock: WebSocket) {
    const uid = v4.generate();

    console.log("midle", gamesArrary);
    sockets.set(uid, sock);
    sockets.get(uid)?.send("connected: " + uid + " random: test" + r.string(5));
    console.log("connected: " + uid + " random: ");
    for await (const ev of sock) {
        if (isWebSocketCloseEvent(ev)) {
            console.log(ev);
            sockets.delete(uid);
            return;
        }
        if (typeof ev === "string") {
            console.log(ev);
            try {
                let obj: DataWebsocet = JSON.parse(ev);
                if (obj.type === "join") {
                    let dataVreateJoin: DataWebsocetJoin = JSON.parse(ev);

                    sockets.get(uid)?.send("join");
                } else if (obj.type === "createNewGame") {
                    let dataVreateGame: DataWebsocetGame = JSON.parse(ev);
                    
                    gamesArrary.push(
                        AddGame(
                            dataVreateGame.dimensionsx,
                            dataVreateGame.dimensionsy,
                            dataVreateGame.playerMaxCount,
                            dataVreateGame.opis,
                            "mazeGeneration(dataVreateGame.dimensionsx,dataVreateGame.dimensionsy )",
                            dataVreateGame.publicval,
                            1,
                            [{ id: uid, name: "abc", idWebsocet: uid }],
                        ),
                    );
                    sockets.get(uid)?.send('{"id":"'+uid+'"}');
                    console.log(gamesArrary);
                } else if (obj.type === "broadcastMessage") {
                    broadcastMessage("broadcastMessage", uid);
                } else if (obj.type === "broadcastMessage") {
                    broadcastMessage("broadcastMessage", uid);
                } else {
                    broadcastMessage("error", uid);
                }
            } catch (error) {
                console.error;
                sockets.get(uid)?.send("Error:-" + error);
            }

            // let evObj = JSON.stringify(JSON.parse(ev.toString())).toString();
            // console.log(evObj)
            // broadcastMessage(evObj, uid)
        }
    }
}

function broadcastMessage(message: string, uid: string) {
    sockets.forEach((socket, id) => {
        if (!socket.isClosed) {
            socket.send(message.toString());
        }
    });
}
// 5 4
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
                    mazeArrary[indexy][indexx] = 3;
                }
            }
        }
    }

    let x: number = r.int(1, (dimensionsx * 2) - 1);
    let y: number = r.int(1, (dimensionsy * 2) - 1);

    while (true) {
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
