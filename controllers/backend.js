import { Application, Router } from "jsr:@oak/oak";
import { Client } from "jsr:@db/postgres";
import { hash, verify } from "@stdext/crypto/hash";
// import { Session } from "https://deno.land/x/oak_sessions@v9.0.0/mod.ts";

const app = new Application();
const router = new Router();
// app.use(Session.initMiddleware());

// Need to place password in config file
const database = new Client({
  user: "itech3108",
  database: "itech3108_30422201_a2",
  hostname: "localhost",
  password: "itech3108pass",
  port: 7000,
});

router.post("/api/login", async (context) => {
  context.response.headers.set("Content-Type", "application/json");

  try {
    const fromClient = await context.request.body.json();

    await database.connect();

    // Get user query
    const results = await database.queryObject`
      SELECT username, password_hash
      FROM users
      WHERE username = ${fromClient.username};`;

    const user = results.rows[0];

    // See if user exists
    if (results.rows.length === 0) {
      context.response.status = 404;
      context.response.body = {
        success: false,
        message: "User not found",
      };
      return;
    }

    // Check password
    const match = verify("bcrypt", fromClient.password, user.password_hash);

    if (match) {
      context.response.status = 200;
      context.response.body = {
        success: true,
        username: user.username,
      };

      console.log("User logged in!");

      // await context.state.session.set("username", user.username);
    } else {
      context.response.status = 401;
      context.response.body = {
        success: false,
        message: "Bad password",
      };
    }
  } catch (exception) {
    console.error("Login error:", exception);
    context.response.status = 500;
    context.response.body = {
      success: false,
      message: "Database query failed",
      error: exception.message,
    };
  } finally {
    await database.end();
  }
});

router.post("/api/signup", async (context) => {
  context.response.headers.set("Content-Type", "application/json");

  try {
    const fromClient = await context.request.body.json();

    await database.connect();

    // Hash the password
    const hashedPassword = hash("bcrypt", fromClient.password);

    // Send a query to add user
    await database.queryObject`
      INSERT INTO users (username, password_hash)
      VALUES (${fromClient.username}, ${hashedPassword})
    `;

    // Check user was added
    const results = await database.queryObject`
      SELECT username
      FROM users
      WHERE username = ${fromClient.username}
    `;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        success: true,
        message: "User added to database",
      };
    } else {
      context.response.status = 500;
      context.response.body = {
        success: false,
        message: "Error adding user to database",
      };
    }
  } catch (exception) {
    console.error("Signup error:", exception);
    context.response.status = 500;
    context.response.body = {
      success: false,
      message: "Database query failed",
      error: exception.message,
    };
  } finally {
    await database.end();
  }
});

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
