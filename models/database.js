import { Client } from "jsr:@db/postgres";

// Need to place password in config file
const database = new Client({
  user: "itech3108",
  database: "itech3108_30422201_a2",
  hostname: "localhost",
  password: "itech3108pass",
  port: 7000,
});

export { database };
