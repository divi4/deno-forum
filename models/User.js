import { database } from "./database.js";

let User = {};

User.getFavs = async (context) => {
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
            WHERE posts.id IN (
              SELECT post_id FROM ratings
              WHERE rated_by_username = ${sessionUser}
              AND is_like='t'
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

// Trigger on post rating btn, as need to update all posts
// owned by user with new score
User.updateAccountPoints = async (context) => {
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
      UPDATE users u
      SET creation_points = u.creation_points + vc.net_votes
      FROM vote_calc vc
      WHERE u.username = vc.owner_username
      RETURNING u.username, u.creation_points;
      `;

    // Update which points have been processed
    await database.queryObject`
      UPDATE ratings
      SET points_processed = TRUE
      WHERE ratings.post_id = ${postId}
      `;

    if (results.rows.length) {
      context.response.status = 201;
      context.response.body = {
        message: "Updated user's total points in database",
        posts: results.rows,
      };

      return;
    } else {
      context.response.status = 404;
      context.response.body = {
        message:
          "Error, query has been dropped due to being malformed or the row already exists, can't update user total points",
      };

      return;
    }
  } catch (exception) {
    console.error("Update user score error:", exception);
    context.response.status = 500;
    context.response.body = {
      message: "Update user score query failed",
      error: exception.message,
    };

    return;
  }
};

export { User };
