

export  interface Game{
        dimensionsx:number;
        dimensionsy:number;
        playerMaxCount:number;
        opis?:String;
        map?:String;
        public?:boolean;
}
export interface Games {
    [index: string]: Game;
  }
