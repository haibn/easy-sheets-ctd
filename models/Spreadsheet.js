const mongoose = require('mongoose')

const spreadsheetSchema = new mongoose.Schema({
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'Please provide user']
    },
    googleSpreadsheetId: { 
        type: String, 
        required: [true, 'Please provide spreadsheet id'] 
    },
    name: { 
        type: String, 
        required: [true, 'Please provide spreadsheet name'] 
    },
    mappings: { 
        type: Object, 
        default: {} 
    }, // { customers: "Sheet1!A:D" }
}, { timestamps: true })

module.exports = mongoose.model('Spreadsheet', spreadsheetSchema);
