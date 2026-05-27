// import { Rating } from "./Rating.js";
import { database } from "./database.js";

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

Post.publicRead = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    let results = await database.queryObject`
            SELECT
              posts.*,
              users.creation_points
            FROM posts
            INNER JOIN(
            SELECT username, creation_points
            FROM users
            ) users
            ON users.username = posts.owner_username
            ORDER BY posts.created_at DESC
            `;

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

Post.memberRead = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    const sessionUser = context.state.user;

    let results = await database.queryObject`
            SELECT
              posts.*,
              users.creation_points
            FROM posts
            INNER JOIN(
            SELECT username, creation_points
            FROM users
            ) users
            ON users.username = posts.owner_username
            WHERE posts.id NOT IN (
              SELECT post_id FROM hidden_posts
              WHERE hidden_by_username = ${sessionUser}
              )
            ORDER BY posts.created_at DESC
            `;

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

Post.hide = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    const sessionUser = context.state.user;
    const postId = context.params.id;

    let results = await database.queryObject`
              INSERT INTO hidden_posts (post_id, hidden_by_username)
              VALUES (${postId}, ${sessionUser})
              RETURNING *
              `;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Post added to users hidden posts on database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 404;
      context.response.body = {
        message: "Error, post not found in database, can't hide",
      };

      return;
    }
  } catch (exception) {
    console.error("Delete post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Post hide query failed",
      error: exception.message,
    };

    return;
  }
};

export { Post };
