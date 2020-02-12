const express = require("express");
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await userDB.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

router.post("/:id/posts", validatePost, async (req, res) => {
  const { id } = req.params;
  try {
    const payload = { ...req.body, user_id: id };
    const newPost = await postDB.insert(payload);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await userDB.get();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
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
      const user = await userDB.getById(id);
      if (!user.length) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = user;
      }
    } catch (error) {
      console.error(error);
    }
    next();
  };
}

function validateUser(req, res, next) {
  const { body } = req;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: "missing user data" });
  } else if (!body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  const { body } = req;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: "missing post data." });
  } else if (!body.text) {
    res.status(400).json({ message: "missing required text field." });
  }
  next();
}

module.exports = router;
