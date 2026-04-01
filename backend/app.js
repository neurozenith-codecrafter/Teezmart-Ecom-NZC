const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/Routes/UserRoutes/Test");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Running");
});

module.exports = app;
