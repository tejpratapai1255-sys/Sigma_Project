const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

router.get("/", async (req, res) => {
    let { country } = req.query;

    if (!country) {
        req.flash("error","This listing is no longer available.");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        country: country
    });

    res.render("search/search.ejs", { listings });
});

module.exports = router;