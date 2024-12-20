const fs = require("fs");
const express = require("express");
const path = require("path");
const router = express.Router();

const filePath = path.join(__dirname, "../api/blog.json");

// Helper functions to read and write to the file
function readComments() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeComments(comments) {
  fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), "utf8");
}

// GET - /api/comment - display all comment entries
router.get("/comment", (req, res) => {
  try {
    const comments = readComments();
    res.json(comments);
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error(error);
  }
});

// GET - /api/comment/:post_id - display a single comment entry
router.get("/comment/:post_id", (req, res) => {
  try {
    const comments = readComments();

    //capture the id from the request
    const postId = req.params.post_id;

    // find the comment in the array by id
    const comment = comments.find(
      (comment) => comment.post_id === parseInt(postId)
    );

    // if not found, return a 404
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    // if found, return the comment
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// POST - /api/comment - create a new comment entry (with the nextId)
router.post("/comment", (req, res) => {
  try {
    const comments = readComments();
    const newComment = req.body;
    newComment.post_id = comments.nextId++;
    comments.comments.push(newComment);
    writeComments(comments);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT - /api/comment/:post_id - update a comment entry
router.put("/comment/:post_id", (req, res) => {
  try {
    const comments = readComments();
    const post_id = parseInt(req.params.post_id);

    // find the comment in the array by id
    const comment = comments.find(
      (comment) => comment.post_id === parseInt(post_id)
    );

    // if not found, return a 404
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    // destructuring the request body
    const { title, author, body } = req.body;

    const updatedComment = {
      post_id,
      title,
      author,
      body,
    };

    // find the index of the comment in the array
    const index = comments.indexOf(comment);

    // update the comment in the array
    comments[index] = updatedComment;

    writeComments(comments);

    // return the updated comment
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE - /api/comment/:post_id - delete a comment entry by id
router.delete("/comment/:post_id", (req, res) => {
  try {
    const comments = readComments();
    const postId = parseInt(req.params.post_id);

    // find the comment in the array by id
    const comment = comments.find((comment) => comment.post_id === postId);

    // if not found, return a 404
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }

    // find the index of the comment in the array
    const index = comments.indexOf(comment);

    // remove the comment from the array
    comments.splice(index, 1);

    writeComments(comments);

    // return the deleted comment
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE - /api/comment - delete all comment entries
router.delete("/comment", (req, res) => {
  try {
    writeComments([]);
    res.status(200).json({ message: "All comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all comments" });
    console.error(error);
  }
});

module.exports = router;

// POST - /api/comment - create a new comment entry (without the nextId)
// router.post("/comment", (req, res) => {
//   try {
//     const comments = readComments();
//     const post_id = comments.length + 1;

//     // destructuring the request body
//     const { title, author, body } = req.body;

//     // if any of the required fields are missing, return a 400
//     if (!title || !author || !body) {
//       res.status(400).send("Title, author, and body are required!");
//       return;
//     }

//     // create a new comment object
//     const newComment = {
//       post_id,
//       title,
//       author,
//       body,
//     };

//     // add the new comment to the array
//     comments.push(newComment);
//     writeComments(comments);

//     // return the new comment
//     res.status(201).json(newComment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
