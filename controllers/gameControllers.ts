import { Context } from "https://deno.land/x/abc@v1.3.3/mod.ts";




export const indexPage = (ctx:Context)=>{

    return ctx.file('./public/index.html');
}
export const listGames = (ctx:Context)=>{


    return ctx.file('./public/list.html');
}
export const startGame = (ctx:Context)=>{
    const{id}=ctx.params;
    console.log(id);
    return ctx.file('./public/game.html');
}
