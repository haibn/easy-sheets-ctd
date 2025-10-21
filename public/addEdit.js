import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showSpreadsheets } from "./spreadsheets.js";

let addEditDiv = null;
let googleSpreadsheetId = null;
let spreadsheetName = null;
let mappings = null;
let addingSpreadsheet = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-spreadsheet");
  googleSpreadsheetId = document.getElementById("google-spreadsheet-id");
  spreadsheetName = document.getElementById("spreadsheet-name");
  mappings = document.getElementById("mappings");
  addingSpreadsheet = document.getElementById("adding-spreadsheet");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingSpreadsheet) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/spreadsheets";

        if (addingSpreadsheet.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/spreadsheets/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              googleSpreadsheetId: googleSpreadsheetId.value,
              name: spreadsheetName.value,
              mappings: mappings.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The spreadsheet entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The spreadsheet entry was created.";
            }

            googleSpreadsheetId.value = "";
            spreadsheetName.value = "";
            mappings.value = "pending";
            showSpreadsheets();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showSpreadsheets();
      }
    }
  });
};

export const showAddEdit = async (spreadsheetId) => {
  if (!spreadsheetId) {
    googleSpreadsheetId.value = "";
    spreadsheetName.value = "";
    mappings.value = "pending";
    addingSpreadsheet.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/spreadsheets/${spreadsheetId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("DATA: ", data);
      if (response.status === 200) {
        googleSpreadsheetId.value = data.spreadsheet.googleSpreadsheetId;
        spreadsheetName.value = data.spreadsheet.name;
        mappings.value = data.spreadsheet.mappings;
        addingSpreadsheet.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = spreadsheetId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The spreadsheets entry was not found";
        showSpreadsheets();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showSpreadsheets();
    }

    enableInput(true);
  }
};

export const deleteSpreadsheet = async (spreadsheetId) => {
  if (spreadsheetId) {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/spreadsheets/${spreadsheetId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      showSpreadsheets();
    } catch (err) {
      console.log(err);
      message.textContent = "Your todo couldn't be deleted.";
      showSpreadsheets();
    }

    enableInput(true);
  }
};
