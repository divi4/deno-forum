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

    return response.status;
  } catch (error) {
    console.log(error);
    return error;
  }
};

service.createUser = async (data) => {
  endpoint = "/api/signup";

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

service.postPost = async (data) => {
  const endpoint = "/api/post/create";

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
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { service };
