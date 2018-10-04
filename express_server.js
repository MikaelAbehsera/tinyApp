// SETUP 
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// SET UP 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.set("view engine", "ejs");

/*----------------------------------------------------------------------------------------------------*/
function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function generateRandomId() {
  const alphaNum = "abcdefghigklmnopqrstuvwxyz1234567890";
  let str = "";
  for (let i = 0; i <= 6; i++) {
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

let currentUser = null;

const users = {
  "h5w2hr32r4": {
    id: "h5w2hr32r4",
    email: "user1@example.com",
    password: "password123"
  },
  "h24hr22hf4": {
    id: "h24hr22hf4",
    email: "user2@example.com",
    password: "123"
  }
};

/* this is the root (aka /) route and will display hello a message */
app.get("/", (req, res) => {
  res.send("Hello! root route is working!");
  console.log("/ route has been accessed");
});

app.get("/register", (req, res) => {
  res.render("urls_register", {
    currentUser: currentUser,
    users: users
  });
});

app.post("/register", (req, res) => {
  const randomId = generateRandomId();
  users[randomId] = {
    id: randomId,
    email: req.body.email,
    password: req.body.password
  };
  currentUser = users[randomId]["email"];
  // PASSWORD
  console.log("PASSWORD: ", req.body.password);
  res.redirect("/register");
});

app.get("/login", (req, res) => {
  res.render("urls_login", {
    currentUser: currentUser
  });
});

app.post("/login", (req, res) => {
  // res.cookie("currentUser", currentUser);
  let currentId;
  for (let id in users) {
    if(req.body.user === users[id]["email"]) {
      currentId = id;
    }
  }
  console.log(currentId);
  if(currentId === undefined) {
    res.redirect("/register");
  } else {
    currentUser = users[currentId]["email"];
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  console.log("User logging out!");
  currentUser = null;
  res.clearCookie(currentUser);
  res.redirect("../urls");
});

/* this is the /urls route and will display urls*/
app.get("/urls", (req, res) => {
  res.render("urls_index", {
    urls: urlDatabase,
    currentUser: currentUser
  });
  console.log("/urls route has been accessed");
});

/* this post will get the input from the /urls/new input form */
app.post("/urls", (req, res) => {
  let randomString = generateRandomId();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

/* This route will have a form to input a url */
app.get("/urls/new", (req, res) => {
  res.render("urls_new", {
  currentUser: currentUser

  });
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
  res.render("urls_show", {
    shortURL: req.params.id,
    currentUser: currentUser
  });
  console.log("/urls/:id route has been accessed");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log("deleted -->", req.params.id);
  res.redirect("/urls");
});
/* this is the /hello route and will display "hello world"*/
app.get("/hello", (req, res) => {
  let templateVars = {
    greeting: "Hello World!"
  };
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