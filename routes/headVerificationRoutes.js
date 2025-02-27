const express = require("express");
const router = express.Router();
const { getUnverifiedDistrictHeads, approveDistrictHead, rejectDistrictHead } = require("../controllers/headVerificationController");

// Route to fetch unverified district heads
router.get("/district-verify", getUnverifiedDistrictHeads);

// Route to approve a district head
router.put("/district-verify", approveDistrictHead);

// Route to reject a district head
router.delete("/district-verify/reject/:id", rejectDistrictHead);

module.exports = router;