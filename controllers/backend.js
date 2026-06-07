import { Application, Router } from "jsr:@oak/oak";
import { Auth } from "./Auth.js";
import { Post } from "../models/Post.js";

const app = new Application();
const router = new Router();

router.post("/api/login", Auth.checkUser);
router.post("/api/signup", Auth.addUser);

router.get("/api/post/read/public", Post.publicRead);
router.get("/api/post/read", Auth.checkToken, Post.memberRead);
router.post("/api/post/create", Auth.checkToken, Post.create);
router.delete("/api/post/delete/:id", Auth.checkToken, Post.delete);
router.post("/api/post/hide/:id", Auth.checkToken, Post.hide);
router.post("/api/post/upvote/:id", Auth.checkToken, Post.upvote);
router.post("/api/post/downvote/:id", Auth.checkToken, Post.downvote);
router.post("/api/post/rating/:id", Auth.checkToken, Post.updatePostPoints);
router.post("/api/user/rating/:id", Auth.checkToken, Post.updateAccountPoints);

router.get("/api/whoami", Auth.checkToken, async (context) => {
  context.response.body = {
    username: context.state.user,
  };
});

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
