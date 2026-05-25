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
    service.postPost(data);
  });

  cancel.addEventListener("click", (ev) => {
    ev.preventDefault();

    document.querySelector(".posts").replaceChildren();
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
export { viewHandler };
