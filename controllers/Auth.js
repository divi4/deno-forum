import { hash, verify } from "jsr:@felix/bcrypt";
import { database } from "../models/database.js";
import * as djwt from "jsr:@zaubrik/djwt";
import { config } from "../models/config.js";

let Auth = {};

Auth.checkUser = async (context) => {
  context.response.headers.set("Content-Type", "application/json");

  try {
    const fromClient = await context.request.body.json();

    await database.connect();

    // Get user query
    const results = await database.queryObject`
      SELECT username, password_hash
      FROM users
      WHERE username = ${fromClient.username}`;

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
    const match = await verify(fromClient.password, user.password_hash);

    if (match) {
      context.response.status = 200;
      context.response.body = {
        success: true,
      };

      const jwt = await djwt.create(
        { alg: config.jwtAlgorithm, typ: "JWT" },
        {
          exp: djwt.getNumericDate(10800),
          username: user.username,
        },
        config.secretKey,
      );

      context.response.body = { token: jwt };

      return;
    } else {
      context.response.status = 401;
      context.response.body = {
        success: false,
        message: "Bad password",
      };

      return;
    }
  } catch (exception) {
    console.error("Login error:", exception);
    context.response.status = 500;
    context.response.body = {
      success: false,
      message: "Database query failed",
      error: exception.message,
    };

    return;
  }
};

Auth.addUser = async (context) => {
  context.response.headers.set("Content-Type", "application/json");

  try {
    const fromClient = await context.request.body.json();

    await database.connect();

    // Hash the password
    const hashedPassword = await hash(fromClient.password);

    // Send a query to add user
    const results = await database.queryObject`
        INSERT INTO users (username, password_hash)
        VALUES (${fromClient.username}, ${hashedPassword})
        RETURNING *
      `;

    // Check user was added
    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        success: true,
        message: "User added to database",
      };

      return;
    } else {
      context.response.status = 500;
      context.response.body = {
        success: false,
        message: "Error adding user to database",
      };

      return;
    }
  } catch (exception) {
    console.error("Signup error:", exception);
    context.response.status = 500;
    context.response.body = {
      success: false,
      message: "Database query failed",
      error: exception.message,
    };

    return;
  }
};

Auth.checkToken = async (context, next) => {
  if (Auth.isNotMember(context)) {
    return;
  }

  const authHeader = context.request.headers.get("Authorization");
  const [type, token] = authHeader.split(" ");

  try {
    const payload = await djwt.verify(
      token,
      config.secretKey,
      config.jwtAlgorithm,
    );

    context.state.user = payload.username;
    context.state.tokenPayload = payload;
    context.response.status = 201;

    await next();
  } catch (ex) {
    context.response.body = `There was an error verifying your JWT token: ${ex.message}`;
    context.response.status = 500;
  }
};

Auth.isNotMember = (context) => {
  if (
    !context.request.headers.has("Authorization") ||
    context.request.headers.get("Authorization") === "Bearer undefined"
  ) {
    context.response.body = `No Authorization header in the request!`;
    context.response.status = 401;
    return;
  }
};

export { Auth };
