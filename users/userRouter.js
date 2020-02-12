const express = require("express");
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////GET ROUTES//////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - GET /api/users
// @desc   - returns all users
// @access - public
router.get("/", async (req, res) => {
  try {
    const posts = await userDB.get();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

// @route  - GET /api/users/:id
// @desc   - returns a user with the specified ID
// @access - public
router.get("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userDB.getById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

// @route  - GET /api/users/:id/posts
// @desc   - returns all posts from a user with the specified ID
// @access - public
router.get("/:id/posts", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const userPosts = await userDB.getUserPosts(id);
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////POST ROUTES////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - POST /api/users
// @desc   - creates a user
// @access - public
router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await userDB.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

// @route  - POST /api/users/:id/posts
// @desc   - creates a post for a user with the specified ID
// @access - public
router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  const { id } = req.params;
  try {
    const payload = { ...req.body, user_id: id };
    const newPost = await postDB.insert(payload);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////PUT ROUTES//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - PUT /api/users/:id
// @desc   - updates a user with the specified ID
// @access - public
router.put("/:id", validateUserId, validateUser, async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  await userDB.update(id, body);
  const updatedUser = await userDB.getById(id);
  res.status(201).json(updatedUser);
  try {
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////DELETE ROUTES//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// @route  - DELETE /api/users/:id
// @desc   - deletes a user with the specified ID
// @access - public
router.delete("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    await userDB.remove(id);
    res.status(200).send("successfully deleted user.");
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////MIDDLEWARE////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await userDB.getById(id);
    if (!user) {
      res.status(400).json({ message: "invalid user id" });
    } else {
      req.user = user;
    }
  } catch (error) {
    console.error(error);
  }
  next();
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
