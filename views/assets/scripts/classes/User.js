export class User {
  constructor(username, name) {
    this.username = username;
    this.name = name;
  }

  static async getUser() {
    return fetch(
      `http://localhost:7777/api/users/${localStorage.getItem("username")}`,
    )
      .then((response) => response.json())
      .then((data) => {
        let loginUser = new User(data.username, data.name);
        loginUser.updateLogin();
        return loginUser;
      })
      .catch((error) => console.log(error));
  }

  updateLogin() {
    document.querySelector(".logonUser").textContent =
      `Logged in as ${this.name}`;
  }

  handleResponse(statusCode) {
    const statusHandlers = {
      200: () => this.handleSuccess(),
      404: () => this.handleNotFound(),
    };

    const handler = statusHandlers[statusCode] || (() => this.handleNotFound());
    handler();
  }

  handleSuccess() {
    location.href = "http://localhost:8000/forum.html";
  }

  handleNotFound() {
    const p = document.createElement("p");
    p.classList.add("notFound");
    p.textContent = "User not found, please try again";
    document.body.append(p);
  }
}
