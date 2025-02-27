const express = require("express");
const router = express.Router();
const authorityController = require("../controllers/adminAuthController");

// Fetch authority details by ID
router.get("/:id", authorityController.getAuthorityDetails);

// Delete authority by ID
router.delete("/:id", authorityController.deleteAuthority);

module.exports = router;
