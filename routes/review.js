const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
// review validation
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

// Create Review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// Delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
