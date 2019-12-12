const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.send(
    '<form action="/user" method="POST"><input type="text" name="username"/><button type="submit">SUBMIT</button></form>'
  );
});

app.post("/user", (req, res) => {
  res.send("<h1>" + req.body.username + "</h1>");
});

app.listen(5000);
