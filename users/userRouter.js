const express = require("express");
const db = require("./userDb");

const router = express.Router();

router.post("/", (req, res) => {
  // do your magic!
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", (req, res) => {
  // do your magic!
});

router.get("/:id", (req, res) => {
  // do your magic!
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(id) {
  return async function(req, res, next) {
    try {
      const user = await db.getById(id);
      if (!user.length) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = user;
      }
    } catch (error) {
      console.error(error);
    }
  };
  next();
}

function validateUser(req, res, next) {
  const { body } = req;
  if (!body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  const { body } = req;
  if (!body) {
    res.status(400).json({ message: "missing post data." });
  } else if (!body.text) {
    res.status(400).json({ message: "missing required text field." });
  }
}

module.exports = router;
