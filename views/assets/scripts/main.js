import { User } from "./User.js";

document.getElementById("loginForm").addEventListener("submit", function (ev) {
  ev.preventDefault();

  fetch(
    `http://localhost:7777/api/users/${document.getElementById("formUsername").value}`,
  )
    .then((response) =>
      response
        .json()
        .then((jsonData) => ({ status: response.status, body: jsonData })),
    )
    .then((data) => {
      let loginUser = new User(data.body.username, data.body.name);
      loginUser.handleResponse(data.status);

      localStorage.setItem("username", data.body.username);
    })
    .catch((error) => console.log(error));
});
