import { Topic } from "./Topic.js";
import { User } from "./User.js";

let userPromise = User.getUser();

window.addEventListener("DOMContentLoaded", async (ev) => {
  ev.preventDefault();

  history.pushState({ page: "initial" }, "", window.location.href);

  window.addEventListener("popstate", (ev) => {
    ev.preventDefault();
    handleBackButtonClick(ev.state);
  });

  let loginUser = await userPromise;

  createTopic(loginUser);
  getTopics(loginUser);
  handleTopic(loginUser);

  setInterval(() => {
    createTopic(loginUser);
    getTopics(loginUser);
    handleTopic(loginUser);
  }, 10000);
});

function getTopics(loginUser) {
  Topic.saveReply();
  document.querySelector(".topics").replaceChildren();

  fetch("http://localhost:7777/api/topics")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((t) => {
        let topic = new Topic(t.title, t.user, t.id);
        topic.get(loginUser);
      });
    });
}

function createTopic(loginUser) {
  document.querySelector(".newTopic").addEventListener("click", (ev) => {
    ev.preventDefault();
    Topic.createNewTopic(loginUser.username);
  });
}

function handleTopic(loginUser) {
  document.querySelector(".topics").addEventListener("click", (ev) => {
    ev.preventDefault();
    const anchor = ev.target.closest("a");
    // Checks if the currentTarget is a anchor to prevent unexpected event handling from input box/btn
    // Could do just ev.target.tagname but this would be better practice
    if (anchor) {
      fetch(`http://localhost:7777/api/topics/${ev.target.dataset.id}`)
        .then((response) => response.json())
        .then((data) => {
          let topic = new Topic(data.title, data.user, data.id, data.posts);

          topic.handleTopic(loginUser);
        })
        .catch((error) => console.log(error));
    }
  });
}

function handleBackButtonClick(state) {
  if (state?.page === "initial") {
    Topic.selectedTopic = null;
    location.replace("http://localhost:8000/forum.html");
  }
}
