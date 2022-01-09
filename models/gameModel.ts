export interface Game {
  idgame: string;
  dimensionsx: number;
  dimensionsy: number;
  playerMaxCount: number;
  opis: string;
  map: string;
  publicval: Boolean;
  difficulty: number;
  playersIdArrary: Array<Player>;
  start?:Date;
}
export function AddGame(
  idgame: string,
  dimensionsx: number,
  dimensionsy: number,
  playerMaxCount: number,
  opis: string,
  map: string,
  publicval: Boolean,
  difficulty: number,
  playersIdArrary: Array<Player>,
) {
  let temp: Game = {
    idgame,
    dimensionsx,
    dimensionsy,
    playerMaxCount,
    opis,
    map,
    publicval,
    difficulty,
    playersIdArrary,
  };
  return temp;
}
export interface Games {
  [index: string]: Game;
}
export interface Player {
  id: string;
  name: string;
  x?: number;
  y?: number;
  idWebsocet: string;
  isPlaying:boolean;
}
export interface DataWebsocetGame {
  type: string;
  dimensionsx: number;
  dimensionsy: number;
  playerMaxCount: number;
  opis: string;
  publicval: boolean;
  difficulty: number;
}
export interface DataWebsocetJoin {
  type: string;
  idGame?: string;
  idPlayer: string;
}
export interface DataWebsocet {
  type: string;
}
