export class Post {
  constructor(text, user) {
    this.text = text;
    this.user = user;
  }

  async getName() {
    return fetch(`http://localhost:7777/api/users/${this.user}`)
      .then((response) => response.json())
      .then((data) => data.name)
      .catch((error) => console.log(error));
  }
}
