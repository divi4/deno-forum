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

    if (!(await checkLogin(data))) {
      confirm("No user found, create user?") ? createUser(data) : false;
    }
  });

async function checkLogin(data) {
  const url = "/api/login";

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => responseData.success)
    .catch((error) => console.log(error));
}

async function createUser(data) {
  const url = "/api/signup";

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    // In what cases would this return false? Need to be handled?
    .then((responseData) => console.log(responseData))
    .catch((error) => console.log(error));
}
