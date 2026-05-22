// Use Oak for route handling and auth middleware
// Create a client side user object
// Verify this user
// If verified then get user details
// If not, add new user to db upon client confirmation, then reload page to force login

document
  .getElementById("signForm")
  .addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const data = {
      username: document.getElementById("signUsername").value,
      password: document.getElementById("signPassword").value,
    };

    const statusCode = await checkLogin(data);
    switch (statusCode) {
      case 404:
        confirm("No user found, create user?") ? createUser(data) : false;
        break;
      case 200:
        console.log("Your in!");
        break;
      case 401:
        console.log("Wrong password, please try again");
        break;
      default:
        console.log(
          "Something unexpected happened. Please clear cache and try again",
        );
    }
  });

async function checkLogin(data) {
  const url = "/api/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // const responseData = await response.json();
    return response.status;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function createUser(data) {
  const url = "/api/signup";

  try {
    const response = await fetch(url, {
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
}
