import { database } from "./database.js";

let Post = {};

Post.create = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    const fromClient = await context.request.body.json();

    await database.connect();

    const sessionUser = context.state.user;

    let results = await database.queryObject`
        INSERT INTO posts (owner_username, title, link, description)
        VALUES (${sessionUser}, ${fromClient.title}, ${fromClient.link}, ${fromClient.description})
        RETURNING *
        `;

    await database.queryObject`
      INSERT INTO ratings (post_id, rated_by_username, is_like)
      VALUES (${results.rows[0].id}, ${sessionUser}, TRUE)
      `;

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
              users.creation_points,
              ratings.net_votes::NUMERIC
            FROM posts
            INNER JOIN(
            SELECT username, creation_points
            FROM users
            ) users
            ON users.username = posts.owner_username
            LEFT JOIN(
              SELECT
              post_id,
              SUM(CASE WHEN is_like='t' THEN 1 ELSE -1 END) as net_votes
              FROM ratings
              GROUP BY post_id
            ) ratings
            ON posts.id = ratings.post_id
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
      context.response.status = 404;
      context.response.body = {
        message: "Error fetching posts from database",
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
    console.error("Hide post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Post hide query failed",
      error: exception.message,
    };

    return;
  }
};

Post.upvote = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    const sessionUser = context.state.user;
    const postId = context.params.id;

    let hasUpvoted = await database.queryObject`
          SELECT FROM ratings
          WHERE
            rated_by_username=${sessionUser} AND
            post_id=${postId} AND
            is_like=TRUE
          `;

    let hasDownvoted = await database.queryObject`
                SELECT FROM ratings
                WHERE
                  rated_by_username=${sessionUser} AND
                  post_id=${postId} AND
                  is_like=FALSE
                `;

    if (hasDownvoted.rows.length) {
      await database.queryObject`
                DELETE FROM ratings
                WHERE
                  rated_by_username=${sessionUser} AND
                  post_id=${postId} AND
                  is_like=FALSE
                `;
    } else if (hasUpvoted.rows.length) {
      context.response.status = 403;
      context.response.body = {
        message:
          "Error, user doesn't have permission to upvote a post more than once",
      };

      return;
    }

    let results = await database.queryObject`
        INSERT INTO ratings (post_id, rated_by_username, is_like)
        VALUES (${postId}, ${sessionUser}, TRUE)
        RETURNING *
        `;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Upvote added to post ratings on database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 404;
      context.response.body = {
        message: "Error, post rating not found in database, can't vote",
      };

      return;
    }
  } catch (exception) {
    console.error("Vote post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Post upvote query failed",
      error: exception.message,
    };

    return;
  }
};

Post.downvote = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    const sessionUser = context.state.user;
    const postId = context.params.id;

    let hasUpvoted = await database.queryObject`
      SELECT FROM ratings
      WHERE
        rated_by_username=${sessionUser} AND
        post_id=${postId} AND
        is_like=TRUE
      `;

    let hasDownvoted = await database.queryObject`
            SELECT FROM ratings
            WHERE
              rated_by_username=${sessionUser} AND
              post_id=${postId} AND
              is_like=FALSE
            `;

    if (hasUpvoted.rows.length) {
      await database.queryObject`
            DELETE FROM ratings
            WHERE
              rated_by_username=${sessionUser} AND
              post_id=${postId} AND
              is_like=TRUE
            `;
    } else if (hasDownvoted.rows.length) {
      context.response.status = 403;
      context.response.body = {
        message:
          "Error, user doesn't have permission to downvote a post more than once",
      };

      return;
    }

    let results = await database.queryObject`
            INSERT INTO ratings (post_id, rated_by_username, is_like)
              VALUES (${postId}, ${sessionUser}, FALSE)
              RETURNING *
            `;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Downvote added to post ratings on database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 404;
      context.response.body = {
        message: "Error, post rating not found in database, can't vote",
      };

      return;
    }
  } catch (exception) {
    console.error("Vote post error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Post downvote query failed",
      error: exception.message,
    };

    return;
  }
};

Post.updatePostPoints = async (context) => {
  context.response.headers.set("Content-Type", "application/json");
  try {
    await database.connect();

    const postId = context.params.id;

    let results = await database.queryObject`
      WITH vote_calc AS (
      SELECT
        p.owner_username,
        COALESCE(SUM(CASE
           WHEN r.is_like = TRUE THEN 1
           WHEN r.is_like = FALSE THEN -1
           ELSE 0
         END)::NUMERIC, 0) AS net_votes
      FROM posts p
      LEFT JOIN ratings r ON p.id = r.post_id AND r.points_processed = FALSE
      WHERE p.id = ${postId}
      GROUP BY p.owner_username
      )
      UPDATE posts p
      SET post_rating = p.post_rating + vc.net_votes
      FROM vote_calc vc
      WHERE p.id = ${postId}
      RETURNING p.id, p.post_rating, p.owner_username
      `;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Updated the post score in database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 404;
      context.response.body = {
        message:
          "Error, query has been dropped due to being malformed or the row already exists, can't update post score",
      };

      return;
    }
  } catch (exception) {
    console.error("Update post score error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Update post score query failed",
      error: exception.message,
    };

    return;
  }
};

export { Post };
