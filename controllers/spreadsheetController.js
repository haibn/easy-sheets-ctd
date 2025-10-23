const Spreadsheet = require("../models/Spreadsheet");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { readSheet, writeSheet } = require("../googleSheetsService");

const getAllSpreadsheets = async (req, res) => {
  const spreadsheets = await Spreadsheet.find({
    createdBy: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ spreadsheets, count: spreadsheets.length });
};
const getSpreadsheet = async (req, res) => {
  // destructured data
  const {
    user: { userId },
    params: { id: spreadsheetId },
  } = req;

  // find spreadsheet by spreadsheetId and user
  const spreadsheet = await Spreadsheet.findOne({
    _id: spreadsheetId,
    createdBy: userId,
  });

  // check if spreadsheet exists
  if (!spreadsheet) {
    throw new NotFoundError(
      `The spreadsheet with the id ${spreadsheetId} does not exists`
    );
  }

  res.status(StatusCodes.OK).json({ spreadsheet });
};

const addSpreadsheet = async (req, res) => {
  // check if name and googleSpreadsheetId are provided
  const { googleSpreadsheetId, name } = req.body;
  if (!googleSpreadsheetId || !name) {
    throw new BadRequestError("googleSpreadsheetId and name are required");
  }

  // attach logged-in user from auth middleware
  req.body.createdBy = req.user.userId;

  // create document
  const spreadsheet = await Spreadsheet.create(req.body);
  res.status(StatusCodes.CREATED).json({ spreadsheet });
};

const updateSpreadsheet = async (req, res) => {
  // destructured data
  const {
    body: { googleSpreadsheetId, name },
    user: { userId },
    params: { id: spreadsheetId },
  } = req;

  // check if googleSpreadsheetId and name field are empty
  if (googleSpreadsheetId === "" || name === "") {
    throw new BadRequestError("googleSpreadsheetId and Name are required");
  }

  // find spreadsheet by id and user and update its googleSpreadsheetId and name
  const spreadsheet = await Spreadsheet.findByIdAndUpdate(
    { _id: spreadsheetId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  // check if spreadsheet exists
  if (!spreadsheet) {
    throw new NotFoundError(
      `The spreadsheet with the id ${spreadsheetId} does not exists`
    );
  }

  res.status(StatusCodes.OK).json({ spreadsheet });
};

const deleteSpreadsheet = async (req, res) => {
  const {
    params: { id: spreadsheetId },
    user: { userId },
  } = req;

  const spreadsheet = await Spreadsheet.findByIdAndRemove({
    _id: spreadsheetId,
    createdBy: userId,
  });

  if (!spreadsheet) {
    throw new NotFoundError(
      `The spreadsheet with the id ${spreadsheetId} does not exists`
    );
  }

  res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
};

// GET spreadsheet data from Google Sheets
const getSpreadsheetData = async (req, res) => {
  const {
    user: { userId },
    params: { id: spreadsheetId },
  } = req;

  // 1. Find spreadsheet document in DB
  const spreadsheet = await Spreadsheet.findOne({
    _id: spreadsheetId,
    createdBy: userId,
  });

  if (!spreadsheet) {
    throw new NotFoundError(`Spreadsheet with id ${spreadsheetId} not found`);
  }

  // 2. Read data from the actual Google Sheet
  const data = await readSheet(
    spreadsheet.googleSpreadsheetId,
    "Sheet1!A1:E10"
  );

  res.status(StatusCodes.OK).json({
    message: "Spreadsheet data fetched successfully",
    data,
  });
};

// POST data to Google Sheets (example)
const updateSpreadsheetData = async (req, res) => {
  const {
    user: { userId },
    params: { id: spreadsheetId },
    body: { range, values },
  } = req;

  const spreadsheet = await Spreadsheet.findOne({
    _id: spreadsheetId,
    createdBy: userId,
  });

  if (!spreadsheet) {
    throw new NotFoundError(`Spreadsheet with id ${spreadsheetId} not found`);
  }

  const result = await writeSheet(
    spreadsheet.googleSpreadsheetId,
    range,
    values
  );

  res.status(StatusCodes.OK).json({
    message: "Spreadsheet data updated successfully",
    result,
  });
};

module.exports = {
  getAllSpreadsheets,
  getSpreadsheet,
  addSpreadsheet,
  updateSpreadsheet,
  deleteSpreadsheet,
  getSpreadsheetData,
  updateSpreadsheetData,
};
