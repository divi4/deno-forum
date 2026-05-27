import { service } from "/views/assets/scripts/service.js";
let viewHandler = {};

viewHandler.showPostForm = () => {
  // Create form elements
  const form = document.createElement("form");
  form.classList.add("addPostForm");
  const title = document.createElement("input");
  title.placeholder = "Post title";
  title.name = "title";

  const description = document.createElement("input");
  description.placeholder = "Description";
  description.name = "description";

  const link = document.createElement("input");
  link.placeholder = "Insert link";
  link.name = "link";

  const submit = document.createElement("input");
  submit.value = "Post";
  submit.type = "submit";

  const cancel = document.createElement("input");
  cancel.value = "Cancel";
  cancel.type = "button";

  form.append(title);
  form.append(description);
  form.append(link);
  form.append(submit);
  form.append(cancel);

  document.querySelector(".posts").replaceChildren(form);

  submit.addEventListener("click", (ev) => {
    ev.preventDefault();

    let data = {
      title: title.value,
      link: link.value,
      description: description.value,
      ratings: 0,
    };

    form.reset();
    document.querySelector(".posts").replaceChildren();
    // postPost will call getPost for us, should reorganise
    service.postPost(data);
  });

  cancel.addEventListener("click", (ev) => {
    ev.preventDefault();

    document.querySelector(".posts").replaceChildren();
    service.getPosts();
  });
};

viewHandler.displayUsername = (username) => {
  const logonUser = document.querySelector(".logonUser");

  document.getElementById("signForm").remove();

  const p = document.createElement("p");
  p.textContent = `Logged in user: ${username}`;

  logonUser.append(p);
};

viewHandler.displayNewPostBtn = () => {
  const heading = document.querySelector(".heading");
  const btn = document.createElement("button");

  btn.classList.add("createPost");
  btn.textContent = "New Post";

  heading.append(btn);

  service.addPostFormBtnListener();
};

viewHandler.showPosts = async (data) => {
  const posts = document.querySelector(".posts");

  // Clear screen of old posts
  document
    .querySelectorAll(".posts div")
    .forEach((oldPost) => oldPost.remove());

  const sessionUser = await service.getSessionUser();
  // Build posts dynamically
  data.posts.forEach((el) => {
    const showDeleteBtn = el.owner_username === sessionUser;
    posts.append(
      createElement("div", { className: "post" }, [
        createElement("div", { className: "poster" }, [
          createElement("p", {
            className: "post-username",
            textContent: el.owner_username,
          }),
          createElement("p", {
            classname: "points",
            textContent: `${el.creation_points}pts`,
          }),
        ]),
        createElement("div", { className: "info" }, [
          createElement("p", { textContent: el.title }),
          createElement("a", {
            textContent: el.description,
            href: el.link,
          }),
        ]),
        createElement("div", { className: "misc" }, [
          createElement("div", { className: "dateTime" }, [
            createElement("p", {
              textContent: `Posted: ${parseDateTime(el.created_at).date}`,
            }),
            createElement("p", {
              textContent: `${parseDateTime(el.created_at).time}`,
            }),
            showDeleteBtn
              ? createElement(
                  "btn",
                  {
                    className: "delBtn",
                    textContent: "delete",
                    // Pass id as param rather than set as a key-* attribute, to prevent client tampering
                    onclick: () => service.deletePost(el.id),
                  },
                  [],
                )
              : "",
          ]),
        ]),
      ]),
    );
  });
};

function createElement(tag, props = {}, children = []) {
  const element = document.createElement(tag);
  Object.assign(element, props);
  children.forEach((child) => element.append(child));
  return element;
}
export { viewHandler };

function parseDateTime(isoString) {
  let ms = Date.parse(isoString);
  const d = new Date(ms);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString(),
  };
}
