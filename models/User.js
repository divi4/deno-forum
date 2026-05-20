import { hash, verify } from "@stdext/crypto/hash";

export class User {
  constructor(username) {
    this.username = username;
    // Will need a function to handle hashing given pass/getting?
    // Will need to think how implement
    this.hashPass = "a hash from DB";
  }

  async isVerify(password) {
    return verify("bcrypt", password, this.hashPass);
  }

  async addUser(username, password) {
    // Need to serve client somehow
    await client.queryObject`INSERT INTO users VALUES (
          ${username},
          ${this.hashed(password)},
          DEFAULT,
          DEFAULT)`;
  }

  async hashed(password) {
    return hash("bcrypt", password);
  }
}
