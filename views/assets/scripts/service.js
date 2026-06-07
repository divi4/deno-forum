import { viewHandler } from "/views/assets/scripts/viewHandler.js";

let service = {};

service.checkLogin = async (data) => {
  const endpoint = "/api/login";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      const token = responseData.token;

      window.authToken = token;
    }
    return response.status;
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.createUser = async (data) => {
  endpoint = "/api/signup";

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.postPost = async (data) => {
  const endpoint = "/api/post/create";

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
      body: JSON.stringify(data),
    });

    service.getPosts();
    // const responseData = await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.getPublicPosts = async () => {
  const endpoint = "/api/post/read/public";

  try {
    const response = await fetch(endpoint);
    const responseData = await response.json();

    viewHandler.showPosts(responseData);
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.getPosts = async () => {
  const endpoint = "/api/post/read";

  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    const responseData = await response.json();

    viewHandler.resetFilters();
    viewHandler.showPosts(responseData);
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.getSessionUser = async () => {
  try {
    if (window.authToken) {
      const response = await fetch("/api/whoami", {
        headers: { Authorization: `Bearer ${window.authToken}` },
      });
      if (response.ok) {
        const { username: sessionUser } = await response.json();
        return sessionUser;
      }
    }
  } catch (ex) {
    console.log(
      `There was an error verifying your JWT token when executing getSessionUser: ${ex.message}`,
    );
  }
};

service.addPostFormBtnListener = () => {
  document.querySelector(".createPost").addEventListener("click", (ev) => {
    ev.preventDefault();
    viewHandler.showPostForm();
  });
};

service.favPostBtnListener = async () => {
  let favBtn = document.querySelector(".favPost");
  favBtn.classList.add("active");

  let recentBtn = document.querySelector(".recentBtn");
  recentBtn.classList.remove("active");

  const endpoint = "/api/user/favourites";

  try {
    let response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    const responseData = await response.json();
    viewHandler.showPosts(responseData);
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.deletePost = async (id) => {
  const endpoint = `api/post/delete/${id}`;
  try {
    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    service.getPosts();
    // const responseData = await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.hidePost = async (id) => {
  const endpoint = `api/post/hide/${id}`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    service.getPosts();
    // const responseData = await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.upvote = async (id) => {
  const endpoint = `api/post/upvote/${id}`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    service.updatePostPoints(id);
    // const responseData = await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.downvote = async (id) => {
  const endpoint = `api/post/downvote/${id}`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    service.updatePostPoints(id);
    // const responseData = await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.updatePostPoints = async (id) => {
  const endpoint = `/api/post/rating/${id}`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    // const responseData = await response.json();
    service.updateUserPoints(id);
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.updateUserPoints = async (id) => {
  const endpoint = `/api/user/rating/${id}`;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.authToken}`,
      },
    });

    // const responseData = await response.json();
    service.getPosts();
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Generic CRUD operations
service.createData = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.postData = async (endpoint, data) => {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // const responseData = await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { service };
