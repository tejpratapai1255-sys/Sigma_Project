require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);



const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");


const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL exists:", !!dbUrl);
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");
app.engine("ejs", ejsMate);

const path = require("path");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));



main().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter : 24 * 3600
});
store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 * 60*60*  24 * 3,
        maxAge : 1000 * 60*60*  24 * 3,
        httpOnly:true
    },
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);
app.use("/search",searchRouter);

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("error.ejs", { message });
});



app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
