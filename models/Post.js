// import { Rating } from "./Rating.js";
import { database } from "../models/database.js";

let Post = {};

Post.create = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    const fromClient = await context.request.body.json();

    await database.connect();

    let results = await database.queryObject`
        INSERT INTO posts (owner_username, title, link, description)
        VALUES (${context.state.user}, ${fromClient.title}, ${fromClient.link}, ${fromClient.description})
        RETURNING *
        `;

    // Check post was added
    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Post added to database",
      };

      return;
    } else {
      context.response.status = 500;
      context.response.body = {
        message: "Error adding post to database",
      };

      return;
    }
  } catch (exception) {
    console.error("Add post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Database query failed",
      error: exception.message,
    };

    return;
  }
};

Post.read = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    let results = await database.queryObject`SELECT * FROM POSTS`;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Posts fetched from database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 500;
      context.response.body = {
        message: "Error getting posts form database",
      };

      return;
    }
  } catch (exception) {
    console.error("Get post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Database query failed",
      error: exception.message,
    };

    return;
  }
};
// read() {}

// update() {}

// delete() {}

export { Post };
