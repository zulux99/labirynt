

export  interface Game{
        dimensionsx:number;
        dimensionsy:number;
        playerMaxCount:number;
        opis:String;
        map:String;
        public:Boolean;
        playersIdArrary:Array<Player>;
}
export interface Games {
    [index: string]: Game;
  }
export interface Player{
        id:String;
        name:String;
        idWebsocet?:string;
}

