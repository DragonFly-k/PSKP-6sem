const app = require("express")();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const { accessKey, refreshKey } = require("./security/jwtKeys");
const { Admin, Guest, User } = require("./security/roles");
const { GetAbilityFor } = require("./security/privilegies");
const homeController = require("./route/route");
const apiController = require("./route/api");

app.use(cookieParser("cookie_key"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.cookies.accessToken) {
    jwt.verify(req.cookies.accessToken, accessKey, (err, payload) => {
      if (err) {
        res.clearCookie("accessToken");
        res.redirect("/login");
      }
      req.payload = payload;
    });
  } else {
    req.payload = { role: Guest };
  }

  req.ability = GetAbilityFor(req); 
  next();
});

app.get("/resource", (req, res) => {
  if (req.payload)
    res.status(200).send(`Resource ${req.payload.id}-${req.payload.role}`);
  else res.status(401).send("To access the resource, you need to log in");
});

app.use("/api", apiController);
app.use("/", homeController);

app.listen(3000, () => console.log("http://localhost:3000/login"));
