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
      message: "Create post query failed",
      error: exception.message,
    };

    return;
  }
};

Post.read = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    let results =
      await database.queryObject`SELECT * FROM POSTS ORDER BY created_at DESC`;

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
        message: "Error getting posts from database",
      };

      return;
    }
  } catch (exception) {
    console.error("Get post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Get post query failed",
      error: exception.message,
    };

    return;
  }
};

Post.delete = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    const sessionUser = context.state.user;
    const postId = context.params.id;

    console.log(`sessionUser: ${sessionUser}, postId: ${postId}`);

    let results =
      await database.queryObject`DELETE FROM POSTS WHERE OWNER_USERNAME=${sessionUser} AND ID=${postId} RETURNING *`;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Post deleted from database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 404;
      context.response.body = {
        message: "Error, post not found in database, can't delete",
      };

      return;
    }
  } catch (exception) {
    console.error("Delete post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Post delete query failed",
      error: exception.message,
    };

    return;
  }
};

export { Post };
