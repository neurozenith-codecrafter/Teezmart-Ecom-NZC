require("dotenv").config();
const app = require("./app");
const connectDb = require("./src/DB/db.js");

const PORT = process.env.PORT || 5000;

connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
