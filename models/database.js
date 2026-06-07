import { Client } from "jsr:@db/postgres";
import { config } from "./config.js";

const database = new Client({
  user: "itech3108",
  database: "itech3108_30422201_a2",
  hostname: "localhost",
  password: config.dbPass,
  port: 7000,
});

export { database };
