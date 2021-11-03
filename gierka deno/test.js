import { listenAndServe } from "https://deno.land/std@0.113.0/http/server.ts";

console.log("http://localhost:8000/");
listenAndServe(":8000", (req) => new Response("Hello World\n"));