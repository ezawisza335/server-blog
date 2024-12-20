console.log("hello world");

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const blogRoutes = require("./controllers/blog.routes");

// create an express app instance
const app = express();

// declare a PORT
const PORT = 3000;

// use the express-static middleware
app.use(express.static("public"));

// middleware to parse JSON data from the body of the request
app.use(express.json());

// health check route
app.get("/api/health", (req, res) => {
  try {
    res.send("THIS WAS A TRIUMPH!");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error(error);
  }
});

// routes
app.use("/api", blogRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
