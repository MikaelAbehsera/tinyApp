// SETUP 
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
// SET UP 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  // encription keys
  keys: ["one", "two", "three"],
}));
app.set("view engine", "ejs");

/*----------------------------------------------------------------------------------------------------*/
/**
 * Function will give a random number between 2 numbers
 * @param {*} min min number to return 
 * @param {*} max max number to return 
 */
function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

/**
 * Function will return a randomized 6 character string
 */
function generateRandomId() {
  const alphaNum = "abcdefghigklmnopqrstuvwxyz1234567890";
  let str = "";
  for (let i = 0; i <= 6; i++) {
    str += alphaNum[random(0, 35)];
  }
  return str;
}

/*----------------------------------------------------------------------------------------------------*/
// Sample database for all urls this is where all urls will be stored for now.
let urlDatabase = {
  "52xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    id: "h5w2hr",
    date: "03/2012/20:50:28",
    used: 0,
    users: {}
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    id: "h5w2hr",
    date: "05/2015/11:50:28",
    used: 0,
    users: {}
  },
  "f3f3f3": {
    longURL: "http://www.random.com",
    id: "123456",
    date: "010/2016/13:50:28",
    used: 0,
    users: {}
  },
  "123f42": {
    longURL: "http://www.apple.com",
    id: "123456",
    date: "06/2018/14:50:28",
    used: 0,
    users: {}
  },
  "23fr43": {
    longURL: "http://www.youtube.com",
    id: "h24hr2",
    date: "06/2018/14:30:28",
    used: 0,
    users: {}
  }
};

//sample database for users this is were all users will be stored for now.
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

app.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/urls");
  } else {
    res.redirect("login");
  }

});


app.get("/register", (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", {
      currentUser: req.session.currentUser,
      users: users
    });
    if (req.session.currentUser) {
      res.redirect("/login");
    }
  }
});

app.post("/register", (req, res) => {
  //checking if email or password are empty when submitted
  if (req.body.password === "" || req.body.email === "") {
    res.status(400).render("statusErrors/400", {
      currentUser: req.session.currentUser,
      users: users
    });
  }
  console.log(req.body.email);
  const password = req.body.password;
  const randomId = generateRandomId();
  users[randomId] = {
    id: randomId,
    email: req.body.email,
    password: bcrypt.hashSync(password, 10)
  };
  urlDatabase[randomId] = {};
  req.session.currentUser = users[randomId]["id"];
  res.redirect("/register");
});

app.get("/login", (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/urls");
  } else {
    res.render("urls_login", {
      currentUser: req.session.currentUser,
      users: users
    });
  }
});


app.post("/login", (req, res) => {
  if (req.body.password === "" || req.body.email === "") {
    res.status(400).render("statusErrors/400", {
      currentUser: req.session.currentUser,
      users: users
    });
  } else {
    let currentId;
    //check for user in fake database
    for (let id in users) {
      if ((req.body.user) === (users[id]["email"]) && bcrypt.compareSync(req.body.password, users[id]["password"])) {
        currentId = id;
      }
    }
    //if user does not exist in fake database send him to register for an account insted of giving him a status message
    //update cookie 
    if (currentId === undefined) {
      res.redirect("/register");
    } else {
      req.session.currentUser = users[currentId]["id"];
      res.redirect("/urls");
    }
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("../urls");
});

/* this is the /urls route and will display urls*/
app.get("/urls", (req, res) => {
  if (req.session.currentUser) {
    const currentUrls = {};
    for (let key in urlDatabase) {
      if (urlDatabase[key]["id"] === req.session.currentUser) {
        currentUrls[key] = urlDatabase[key];
      }
    }
    res.render("urls_index", {
      urls: currentUrls,
      currentUser: req.session.currentUser,
      users: users,
      urlDatabase: urlDatabase
    });
  } else {
    res.status(302).render("statusErrors/302", {
      currentUser: req.session.currentUser,
      users: users
    });
  }
});
/* this post will get the input from the /urls/new input form */
app.post("/urls", (req, res) => {
  var datetime = Date();
  const date = String(datetime).split("").splice(8, 16).join("").replace(/\s/g, "/");
  const template = {
    longURL: req.body.longURL,
    id: req.session.currentUser,
    date: date,
    users: {}
  };
  if (req.session.currentUser) {
    let randomString = generateRandomId();
    urlDatabase[randomString] = template;
    res.redirect(`/urls/${randomString}`);
  } else {
    res.status(404).render("statusErrors/404", template);
  }
});

/* This route will have a form to input a url */
app.get("/urls/new", (req, res) => {
  if (req.session.currentUser) {
    res.render("urls_new", {
      currentUser: req.session.currentUser,
      users: users
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:id", (req, res) => {
  const template = {
    urlOwnerId: urlDatabase[req.params.id]["id"],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]["longURL"],
    currentUser: req.session.currentUser,
    users: users
  };
  //checking authentication 
  if (urlDatabase[req.params.id] && req.session.currentUser === urlDatabase[req.params.id]["id"] && req.body.update !== undefined) {
    urlDatabase[req.params.id]["longURL"] = req.body.update;
    res.redirect("/urls");
  } else if (req.session.currentUser && req.session.currentUser !== urlDatabase[req.params.id]["id"]) {
    res.status(403).render("statusErrors/403", template);
  } else {
    res.redirect("/urls");
  }
});

app.get("/u/:id", (req, res) => {
  const template = {
    shortURL: req.params.id,
    currentUser: req.session.currentUser,
    users: users
  };

  if (urlDatabase[req.params.id]) {
    res.redirect(urlDatabase[req.params.id]["longURL"]);
    // count how many times it way used 
    if (urlDatabase[req.params.id]["used"]) {
      urlDatabase[req.params.id]["used"]++;
    } else {
      urlDatabase[req.params.id]["used"] = 1;
    }
    //add a loop
    if (req.session.currentUser) {
      urlDatabase[req.params.id]["users"][req.session.currentUser] = true;
    }
  } else {
    res.status(404).render("statusErrors/404", template);
  }
});

app.get("/urls/:id", (req, res) => {
  const template = {
    currentDate: urlDatabase[req.params.id]["date"],
    urlOwnerId: urlDatabase[req.params.id]["id"],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]["longURL"],
    currentUser: req.session.currentUser,
    used: urlDatabase[req.params.id]["used"],
    users: users,
    viewed: Object.keys(urlDatabase[req.params.id]["users"]).length
  };
  //checking authentication 
  if (urlDatabase[req.params.id] && req.session.currentUser === urlDatabase[req.params.id]["id"]) {
    res.render("urls_show", template);
  } else if (!req.session.currentUser) {
    //if user is not logged in 
    res.status(403).render("statusErrors/403", template);
  } else if (req.session.currentUser !== req.params.id["id"]) {
    //if user does not own this url 
    res.status(403).render("statusErrors/403", template);
  } else {
    res.status(404).render("statusErrors/404", template);
  }
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
/* this is the /hello route and will display "hello world"*/
app.get("/hello", (req, res) => {
  let templateVars = {
    greeting: "Hello World!",
    shortURL: req.params.id,
    currentUser: req.session.currentUser,
    users: users
  };
  res.render("hello_world", templateVars);
});

app.get("/*", (req, res) => {
  const template = {
    shortURL: req.params.id,
    currentUser: req.session.currentUser,
    users: users
  };
  res.status(404).render("statusErrors/404", template);
  res.statusCode = 404;
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}!`);
});