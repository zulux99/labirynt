// deno-lint-ignore-file
import { Application,Context } from "https://deno.land/x/abc@v1.3.3/mod.ts";


console.log('start');
const app = new Application();
app.static('/','./public')
app.get('/', async (ctx:Context) =>{
  await ctx.file('./public/index.html');
  
});
app.get('/list', async (ctx:Context) =>{
  await ctx.file('./public/list.html');
  
});
app.get('/game/:id', async (ctx:Context) =>{
    await ctx.file('./public/game.html');
    
  });




app.start({port:80})

 
