import { serve } from "https://deno.land/std@0.87.0/http/server.ts";
import {
  acceptable,
  acceptWebSocket,
} from "https://deno.land/std@0.87.0/ws/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.1/mod.ts";
import { websocetindex } from "./websockets/joinGame.ts";
const server = serve({ port: 80 });
for await (const req of server) {
  if (req.url === "/") {
    req.respond({
      status: 200,
      body: await Deno.open("./public/index.html"),
    });
  } else if (req.url === "/game") {
    req.respond({
      status: 200,

      body: await Deno.open("./public/phaser.html"),
    });
  } else if (req.url === "/join") {
    if (acceptable(req)) {
      const { conn, r: bufReader, w: bufWriter, headers } = req;
      acceptWebSocket({
        conn,
        bufReader,
        bufWriter,
        headers,
      })
        .then(websocetindex)
        .catch(console.error);
    }
  } else {
    await staticFiles("public")(req);
  }
}
