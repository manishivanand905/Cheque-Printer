const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { protect } = require("../middlewares/authMiddleware");
const {
  listCheques,
  createCheque,
  createBulkCheques,
} = require("../controllers/chequeController");

const router = express.Router();

router.use(protect);

router.route("/").get(asyncHandler(listCheques)).post(asyncHandler(createCheque));
router.route("/bulk").post(asyncHandler(createBulkCheques));

module.exports = router;
