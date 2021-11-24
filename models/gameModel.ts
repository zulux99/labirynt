

export  interface Game{
        dimensionsx:number;
        dimensionsy:number;
        playerMaxCount:number;
        opis:String;
        mapa:String;
}
export interface Games {
    [index: string]: Game;
  }
