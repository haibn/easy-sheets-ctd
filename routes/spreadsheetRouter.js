const express = require('express')
const router = express.Router()

const { getAllSpreadsheets, getSpreadsheet, addSpreadsheet, updateSpreadsheet, deleteSpreadsheet } = require('../controllers/spreadsheetController')

router.route('/').post(addSpreadsheet).get(getAllSpreadsheets)
router.route('/:id').get(getSpreadsheet).delete(deleteSpreadsheet).patch(updateSpreadsheet)

module.exports = router