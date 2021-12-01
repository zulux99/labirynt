

export  interface Game{
        dimensionsx:number;
        dimensionsy:number;
        playerMaxCount:number;
        opis:String;
        map:String;
        publicval:Boolean;
        playersIdArrary:Array<Player>;
}
export function  AddGame(dimensionsx:number,
        dimensionsy:number,
        playerMaxCount:number,
        opis:String,
        map:String,
        publicval:Boolean,
        playersIdArrary:Array<Player>){
                let temp :Game={dimensionsx,
                        dimensionsy,
                        playerMaxCount,
                        opis,
                        map,
                        publicval,
                        playersIdArrary

                }
return temp
}
export interface Games {
    [index: string]: Game;
  }
export interface Player{
        id:String;
        name:String;
        idWebsocet?:string;
}
export interface  DataWebsocet{
        type:string;
        dimensionsx:number;
        dimensionsy:number;
        playerMaxCount:number;
        opis:string;
        publicval:boolean;



}
