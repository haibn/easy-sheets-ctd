const { google } = require("googleapis");

const getAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_KEY environment variable");
  }

  // Parse the JSON key from environment variable
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

  // Create authentication object
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"), // handle escaped newlines
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};

const getSheetsClient = () => {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
};

// Read data from sheet
const readSheet = async (spreadsheetId, range) => {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values;
};

// Write data to sheet
const writeSheet = async (spreadsheetId, range, values) => {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
  return response.data;
};

module.exports = { readSheet, writeSheet };
