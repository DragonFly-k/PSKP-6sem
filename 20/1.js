const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter.js");
const softwareRouter = require("./routes/softwareRouter")
const licenseRouter = require("./routes/licenseRouter")
const homeRouter =require("./routes/homeRouter")
const ulicRouter =require("./routes/ulicRouter")
const hbs = require('hbs')

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partial");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/software", softwareRouter);
app.use("/license", licenseRouter);
app.use("/ulic", ulicRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.use(function (err, req, res, next) {
    res.render('./partial/error.hbs', { message: err });
})


app.listen(3000);