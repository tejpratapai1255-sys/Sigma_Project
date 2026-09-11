const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//Create and Index route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('image'),validateListing, wrapAsync(listingController.createListing));
    

    // New

router.get("/new", isLoggedIn, listingController.renderNewForm);

// show route

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch( isLoggedIn, isOwner,upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));



module.exports = router;