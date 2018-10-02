// SETUP 
const express     = require("express");
const app         = express();
const PORT        = 3000;
const bodyParser  = require("body-parser");
// SET UP 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/*----------------------------------------------------------------------------------------------------*/
function random(min, max) {
  return Math.floor(Math.random() * max) + min;  
}

function generateRandomString() {
  const alphaNum = "abcdefghigklmnopqrstuvwxyz1234567890";
  let str = "";
  for(let i = 0; i <= 6; i++) {
    str += alphaNum[random(0, 35)];
  }
  return str;
}

/*----------------------------------------------------------------------------------------------------*/

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/* this is the root (aka /) route and will display hello a message */
app.get("/", (req, res) => {
  res.send("Hello! root route is working!");
  console.log("/ route has been accessed");
});

/* this is the /urls route and will display urls*/
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
  console.log("/urls route has been accessed");
});

/* this post will get the input from the /urls/new input form */ 
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

/* This route will have a form to input a url */
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  console.log("/urls/new route has been accessed");
});

app.get("/urls/:id", (req, res) => {
  res.render("urls_show", { shortURL: req.params.id });
  console.log("/urls/:id route has been accessed");
});

/* this is the /hello route and will display "hello world"*/
app.get("/hello", (req, res) => {
  let templateVars = { greeting: "Hello World!"};
  res.render("hello_world", templateVars);
  console.log("/hello route has been accessed");
});

/* this will display a not found message for any routes we have not found */
app.get("/*", (req, res) => {
  res.send("<html><body><h1>PAGE NOT FOUND</h1></body></html>\n");
  console.log("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}!`);
});