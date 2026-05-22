import { hash, verify } from "@stdext/crypto/hash";
import { database } from "../models/database.js";

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
    const match = await verify(
      "bcrypt",
      fromClient.password,
      user.password_hash,
    );

    if (match) {
      context.response.status = 200;
      context.response.body = {
        success: true,
        username: user.username,
      };

      return;
      // await context.state.session.set("username", user.username);
    } else {
      context.response.status = 401;
      context.response.body = {
        success: false,
        message: "Bad password",
      };

      console.log("Bad password!");

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

    console.log("Database query failed!");

    return;
  }
};

Auth.addUser = async (context) => {
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

      console.log("User added");
      return;
    } else {
      context.response.status = 500;
      context.response.body = {
        success: false,
        message: "Error adding user to database",
      };

      console.log("Error adding user");
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

    console.log("Signup query failed");
    return;
  }
};

export { Auth };
