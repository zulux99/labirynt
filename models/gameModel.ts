

export  interface Game{
        dimensionsx:number;
        dimensionsy:number;
        playerMaxCount:number;
        opis:String;
        map:String;
        public:Boolean;
        playersArrary:Array<String>;
}
export interface Games {
    [index: string]: Game;
  }
