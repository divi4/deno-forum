// Use Oak for route handling and auth middleware
// Create a client side user object
// Verify this user
// If verified then get user details
// If not, add new user to db upon client confirmation, then reload page to force login
import { service } from "/views/assets/scripts/service.js";
import { viewHandler } from "/views/assets/scripts/viewHandler.js";

// Main
window.addEventListener("DOMContentLoaded", async (ev) => {
  ev.preventDefault();

  signFormListener();
  // Would need to place this on a interval to keep public view up-to-date
  // whenever members take actions
  service.getPublicPosts();
});

function signFormListener() {
  document
    .getElementById("signForm")
    .addEventListener("submit", async function (ev) {
      ev.preventDefault();

      const data = {
        username: document.getElementById("signUsername").value,
        password: document.getElementById("signPassword").value,
      };

      const statusCode = await service.checkLogin(data);
      switch (statusCode) {
        case 404:
          confirm("No user found, create user?")
            ? service.createUser(data)
            : false;
          break;
        case 200:
          viewHandler.displayUsername(data.username);
          viewHandler.displayNewPostBtn();
          service.getPosts();
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
}
