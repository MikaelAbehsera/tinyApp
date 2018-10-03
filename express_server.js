// SETUP 
const express     = require("express");
const app         = express();
const PORT        = 3000;
const bodyParser  = require("body-parser");
const cookieParser = require("cookie-parser");
// SET UP 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
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
  "52xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "f3f3f3": "http://www.random.com",
  "123f42": "http://www.apple.com",
  "23fr43": "http://www.youtube.com"
};

let user = null;

/* this is the root (aka /) route and will display hello a message */
app.get("/", (req, res) => {
  res.send("Hello! root route is working!");
  console.log("/ route has been accessed");
});

app.get("/login", (req, res) => {
  res.render("urls_login", {user: user});
});

app.post("/login", (req, res) => {
  console.log("BEFORE: ", user);
  user = req.body.user;
  res.cookie("user", user);
  console.log("cookie: ", req.cookies.user);
  res.redirect("/login");
});



/* this is the /urls route and will display urls*/
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase, user: user });
  console.log("/urls route has been accessed");
});

/* this post will get the input from the /urls/new input form */ 
app.post("/urls", (req, res) => {   
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

/* This route will have a form to input a url */
app.get("/urls/new", (req, res) => {
  res.render("urls_new", {user: user});
  console.log("/urls/new route has been accessed");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.update;
  console.log(req.params.id);
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  res.render("urls_show", { shortURL: req.params.id, user: user});
  console.log("/urls/:id route has been accessed");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log("deleted -->", req.params.id);
  res.redirect("/urls");
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
  res.statusCode = 404;
  console.log("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}!`);
});