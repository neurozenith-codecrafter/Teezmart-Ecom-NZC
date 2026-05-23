require("dotenv").config();
const app = require("./app");
const connectDb = require("./src/DB/db.js");
const { initializeSearch } = require("./src/Services/SearchService.js");
const dns = require("node:dns").promises;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDb();
  await initializeSearch();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
