// SETUP 
const express = require("express");
const app = express();
const PORT = 3000;
// SET UP 
app.set("view engine", "ejs");


let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/* this is the root (aka /) route and will display hello a message */
app.get("/", (req, res) => {
  res.send("Hello! root route is working!");
});

/* this is the /urls route and will display urls*/
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
});

/* this is the /hello route and will display "hello world"*/
app.get("/hello", (req, res) => {
  let templateVars = { greeting: "Hello World!"};
  res.render("hello_world", templateVars);
});

app.get("/urls/:id", (req, res) => {
  res.render("urls_show", { shortURL: req.params.id });
});

/* this will display a not found message for any routes we have not found */
app.get("/*", (req, res) => {
  res.send("<html><body><h1>PAGE NOT FOUND</h1></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}!`);
});