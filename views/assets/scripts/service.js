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

service.getPosts = async () => {
  const endpoint = "/api/post/read";

  try {
    const response = await fetch(endpoint);

    const responseData = await response.json();

    viewHandler.showPosts(responseData);
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.addPostFormBtnListener = () => {
  document.querySelector(".createPost").addEventListener("click", (ev) => {
    ev.preventDefault();
    viewHandler.showPostForm();
  });
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
