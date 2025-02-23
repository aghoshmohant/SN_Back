const express = require("express");
const router = express.Router();
const HeadRegisterController = require("../controllers/HeadRegisterController");

// Route for district head registration
router.post(
  "/register",
  HeadRegisterController.upload,
  HeadRegisterController.registerHead
);

// Route for district head login
router.post("/login", HeadRegisterController.loginHead);

module.exports = router;
