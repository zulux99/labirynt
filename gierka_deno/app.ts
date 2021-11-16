import { Application, Router,send } from "https://deno.land/x/oak/mod.ts";

// const get1 = JSON.parse(await Deno.readTextFile("./getData.json"));
// const get2 = JSON.parse(await Deno.readTextFile("./getData2.json"));
// const post1 = JSON.parse(await Deno.readTextFile("./postData.json"));

const router = new Router();

router
    .get('/',async (ctx) => {
        const body = await Deno.readTextFile(Deno.cwd() + './public/index.html')
        ctx.response.body = body;
    })
    .get('/list',async (ctx) => {
        const body = await Deno.readTextFile(Deno.cwd() + './public/list.html')
        ctx.response.body = body;
    })
    .get('/game/:id',async (ctx) => {
        const body = await Deno.readTextFile(Deno.cwd() + './public/game.html')
        ctx.response.body = body;
    })
    .get('/style.css',async (ctx) => {
        await send(ctx, ctx.request.url.pathname, {
            root: `${Deno.cwd()}/public`,
            index: "style.css",
          });
    });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
console.log('start');
await app.listen({ port: 80 });

//  import { Application,Context} from "https://deno.land/x/abc@v1.3.3/mod.ts";
// import { indexPage,startGame ,listGames} from './controllers/gameControllers.ts'

// console.log('start');
// const app = new Application();
// app.static('/','./public')
// app.get('/',indexPage);
// app.get('/list', listGames);
// app.get('/game/:id', startGame);




// app.start({port:80})

 
