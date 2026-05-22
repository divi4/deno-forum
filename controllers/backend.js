import { Application, Router } from "jsr:@oak/oak";
import { Auth } from "../controllers/Auth.js";
// import { Session } from "https://deno.land/x/oak_sessions@v9.0.0/mod.ts";

const app = new Application();
const router = new Router();
// app.use(Session.initMiddleware());

router.post("/api/login", Auth.checkUser);
router.post("/api/signup", Auth.addUser);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/../views/public`,
      index: "index.html",
    });
  } catch {
    next();
  }
});
app.addEventListener("listen", (ev) =>
  console.log(`Listening on port ${ev.port}`),
);
await app.listen({ port: 3000 });
