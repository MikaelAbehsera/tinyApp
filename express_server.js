// SETUP 
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
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
  "52xVn2": { longURL: "http://www.lighthouselabs.ca", id: "h5w2hr" },
  "9sm5xK": { longURL: "http://www.google.com", id: "h5w2hr"},
  "f3f3f3": { longURL: "http://www.random.com", id: "123456"},
  "123f42": { longURL: "http://www.apple.com", id: "123456"},
  "23fr43": { longURL: "http://www.youtube.com", id: "h24hr2"}
};


const users = {
  "h5w2hr": {
    id: "h5w2hr",
    email: "user1@example.com",
    password: bcrypt.hashSync("password123", 10)
  },
  "123456": {
    id: "123456",
    email: "u@e.com",
    password: bcrypt.hashSync("p", 10)
  },
  "h24hr2": {
    id: "h24hr2",
    email: "user2@example.com",
    password: bcrypt.hashSync("123", 10)
  }
};

/* this is the root (aka /) route and will display hello a message */
app.get("/", (req, res) => {
  res.send("Hello! root route is working!");
  console.log("/ route has been accessed");
});

app.get("/register", (req, res) => {
  res.render("urls_register", {
    currentUser: req.cookies["currentUser"],
    users: users
  });
  console.log(req.cookies["currentUser"])
});

app.post("/register", (req, res) => {
  const password = req.body.password;
  const randomId = generateRandomId();
  users[randomId] = {
    id: randomId,
    email: req.body.email,
    password: bcrypt.hashSync(password, 10)
  };
  urlDatabase[randomId] = {};
  res.cookie("currentUser", users[randomId]["id"]);
  // PASSWORD
  console.log("Email: ", req.body.email);
  console.log("PASSWORD: ", req.body.password);
  res.redirect("/register");
});

app.get("/login", (req, res) => {
  res.render("urls_login", {
    currentUser: req.cookies["currentUser"],
    users: users
  });
});


app.post("/login", (req, res) => {
  let currentId;
  //check for user in fake database
  for (let id in users) {           
    console.log(bcrypt.compareSync(req.body.password, users[id]["password"]));          
    if ((req.body.user) === (users[id]["email"]) && bcrypt.compareSync(req.body.password, users[id]["password"])) {
      currentId = id;
    }
  }
  //if user does not exist in fake database send him to register for an account else 
  //update cookie
  if (currentId === undefined) {
    res.redirect("/register");
  } else {
    res.cookie("currentUser", users[currentId]["id"]);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  console.log("User logging out!");
  res.clearCookie("currentUser");
  res.redirect("../urls");
});

/* this is the /urls route and will display urls*/
app.get("/urls", (req, res) => {
  // "52xVn2": { longURL: "http://www.lighthouselabs.ca", id: "h5w2hr" },
  const currentUrls = {};
  for(let key in urlDatabase) {
    if(urlDatabase[key]["id"] === req.cookies["currentUser"]) {
      currentUrls[key] = urlDatabase[key];
    }
  }
  res.render("urls_index", {
    urls: currentUrls,
    currentUser: req.cookies["currentUser"],
    users: users
  });
  console.log("/urls route has been accessed");
});

/* this post will get the input from the /urls/new input form */
app.post("/urls", (req, res) => {
  let randomString = generateRandomId();
  urlDatabase[randomString] = {longURL: req.body.longURL, id: req.cookies["currentUser"]};
  // res.redirect(`/urls/${randomString}`);
  res.redirect("/urls");
});

/* This route will have a form to input a url */
app.get("/urls/new", (req, res) => {
  if (req.cookies["currentUser"]) {
    res.render("urls_new", {
      currentUser: req.cookies["currentUser"],
      users: users
    });
    console.log("/urls/new route has been accessed");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id]["longURL"] = req.body.update;
  console.log(req.params.id);
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]["longURL"]);
});

app.get("/urls/:id", (req, res) => {
  res.render("urls_show", {
    shortURL: req.params.id,
    currentUser: req.cookies["currentUser"],
    users: users
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
  res.send("<html><body><h1><b>PAGE NOT FOUND</h1></body></html>\n");
  res.statusCode = 404;
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}!`);
});