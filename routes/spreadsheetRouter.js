const express = require("express");
const router = express.Router();

const {
  getAllSpreadsheets,
  getSpreadsheet,
  addSpreadsheet,
  updateSpreadsheet,
  deleteSpreadsheet,
  getSpreadsheetData,
  updateSpreadsheetData,
} = require("../controllers/spreadsheetController");

router.route("/").post(addSpreadsheet).get(getAllSpreadsheets);
router
  .route("/:id")
  .get(getSpreadsheet)
  .delete(deleteSpreadsheet)
  .patch(updateSpreadsheet);

// New Google Sheets API routes
router.route("/:id/data").get(getSpreadsheetData);
router.route("/:id/data").post(updateSpreadsheetData);

module.exports = router;
