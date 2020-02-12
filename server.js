const express = require("express");

const server = express();

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(
    `${req.method} request to ${req.originalUrl} from ${req.hostname}`
  );
}

module.exports = server;
