const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
//signup
router.route("/signup")
    .get( userController.userSignUp)
    .post( wrapAsync(userController.userSign))

//Login
router.route("/login")
    .get(userController.userLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

//Logout
router.get("/logout", userController.logOut);


module.exports = router;