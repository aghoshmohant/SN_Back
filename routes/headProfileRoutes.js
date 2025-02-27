const express = require("express");
const router = express.Router();
const headProfileController = require("../controllers/headProfileController");

router.get("/profile", headProfileController.getProfile);
router.put("/profile", headProfileController.updateProfile);
router.put("/change-password", headProfileController.changePassword);

module.exports = router;