import { Application, Router } from "jsr:@oak/oak";
import { Auth } from "./Auth.js";
import { Post } from "../models/Post.js";

const app = new Application();
const router = new Router();

router.post("/api/login", Auth.checkUser);
router.post("/api/signup", Auth.addUser);

router.get("/api/post/read", Post.read);
router.post("/api/post/create", Auth.checkToken, Post.create);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/..`,
      index: "./views/public/index.html",
    });
  } catch {
    next();
  }
});
app.addEventListener("listen", (ev) =>
  console.log(`Listening on port ${ev.port}`),
);
await app.listen({ port: 3000 });
