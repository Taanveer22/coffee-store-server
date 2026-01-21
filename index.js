// ==================Recommended Order=================
// 1. Required by common js (express, cors, etc.)
// 2 .Instance Initialization (const app = express())
// 3. Middleware Setup (cors, json, logging)
// 4. Database Configuration & Connection (MongoDB client setup and runMongoDB() function)
// 5. Routes
// 6. Server Startup (app.listen)
// ===========================================================

// 01
const express = require("express");
const cors = require("cors");

// 02
const app = express();
const port = process.env.PORT || 5000;

// 03
app.use(express.json());
app.use(cors());

// 04
app.get("/", (req, res) => {
  res.send("server is running");
});

// 06
app.listen(port, () => {
  console.log(`the server is running on port : ${port}`);
});
