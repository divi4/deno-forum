import { Post } from "./Post.js";

export class Topic {
  constructor(title, user, id, posts) {
    this.title = title;
    this.user = user;
    this.id = id;
    this.posts = posts?.map((post) => new Post(post.text, post.user)) || [];
  }

  static selectedTopic = null;

  static userReply = null;

  static saveReply() {
    this.userReply = document.querySelector(".replyText")?.value;
  }

  async handleTopic(loginUser) {
    // Get name of all authors in one call
    let authorNames = await Promise.all(
      this.posts.map((post) => post.getName()),
    );
    document.querySelector(".replyBox")?.value;
    // Clears screen to default
    document
      .querySelectorAll(".topics p")
      .forEach((oldPost) => oldPost.remove());

    document.querySelector(".addPost")?.remove();

    // Populates posts under the opened topic
    for (let i = 0; i < this.posts.length; i++) {
      const div = document.createElement("div");
      div.classList.add("post");

      const p = document.createElement("p");
      p.textContent = this.posts[i].text;
      div.append(p);

      const author = document.createElement("p");
      author.textContent = `- ${authorNames[i]}`;
      author.classList.add("author");
      div.append(author);

      document
        .querySelector(`[data-id="${this.id}"]`)
        .closest("div")
        .append(div);
    }

    // Adds the add post field and button to selected topic
    const div = document.createElement("div");
    div.classList.add("addPost");
    document.querySelector(`[data-id="${this.id}"]`).closest("div").append(div);

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("replyText");
    input.placeholder = "My reply";

    if (Topic.userReply != null) {
      input.value = Topic.userReply;
    }

    document.querySelector(".addPost").append(input);

    const btn = document.createElement("input");
    btn.type = "submit";
    btn.dataset.id = this.id;
    btn.classList.add("replyBtn");
    btn.value = "Post";
    document.querySelector(".addPost").append(btn);

    this.addReplyPost(loginUser);

    Topic.selectedTopic = this.id;
  }

  addReplyPost(loginUser) {
    document.querySelector(".replyBtn").addEventListener("click", (ev) => {
      ev.preventDefault();
      let data = {
        user: loginUser.username,
        text: document.querySelector(".replyText").value,
      };

      // Clear text from field
      document.querySelector(".replyText").value = "";

      fetch(`http://localhost:7777/api/topics/${this.id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        // Then trigger new GET to refresh page
        .then(() => this.updatePost(loginUser))
        .catch((error) => console.log(error));
    });
  }

  updatePost(loginUser) {
    if (this.id === Topic.selectedTopic) {
      fetch(`http://localhost:7777/api/topics/${this.id}`)
        .then((response) => response.json())
        .then((data) => {
          let topic = new Topic(data.title, data.user, data.id, data.posts);

          topic.handleTopic(loginUser);
        })
        .catch((error) => console.log(error));
    }
  }

  get(loginUser) {
    const div = document.createElement("div");
    document.querySelector(".topics").append(div);

    const a = document.createElement("a");

    a.textContent = this.title;
    a.href = "#";
    a.dataset.id = this.id;
    div.append(a);

    this.updatePost(loginUser);

    // Add delete btn to topic if owner matches logged in user
    if (this.user === loginUser.username) {
      const delBtn = document.createElement("button");
      delBtn.classList.add("delBtn");
      delBtn.textContent = "(delete)";

      delBtn.addEventListener("click", (ev) => {
        ev.preventDefault();

        this.deleteTopic();
      });

      div.append(delBtn);
    }
  }

  static createNewTopic(loginUser) {
    // Pause refresh

    // Create form elements
    const form = document.createElement("form");
    form.classList.add("createTopic");
    const title = document.createElement("input");
    title.placeholder = "Topic title";
    title.name = "title";

    const text = document.createElement("input");
    text.placeholder = "Initial post";
    text.name = "text";

    const submit = document.createElement("input");
    submit.value = "Post";
    submit.type = "submit";
    submit.classList.add("createTopicSubmitBtn");

    form.append(title);
    form.append(text);
    form.append(submit);

    document.body.replaceChildren(form);

    submit.addEventListener("click", (ev) => {
      ev.preventDefault();
      Topic.postNewTopic(loginUser);
    });
  }

  static postNewTopic(loginUser) {
    let data = {
      user: loginUser,
      text: document.querySelector("[name='text']").value,
      title: document.querySelector("[name='title']").value,
    };

    fetch(`http://localhost:7777/api/topics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => (location.href = "http://localhost:8000/forum.html"))
      .catch((error) => console.log(error));
  }

  deleteTopic() {
    let data = {
      user: this.user,
    };

    fetch(`http://localhost:7777/api/topics/${this.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          const anchor = document.querySelector(`[data-id="${this.id}"]`);
          anchor.closest("div").remove();
        }
      })
      .catch((error) => console.log(error));
  }
}
