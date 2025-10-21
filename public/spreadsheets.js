import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit, deleteSpreadsheet } from "./addEdit.js";

let spreadsheetsDiv = null;
let spreadsheetsTable = null;
let spreadsheetsTableHeader = null;

export const handleSpreadsheets = () => {
  spreadsheetsDiv = document.getElementById("spreadsheets");
  const logoff = document.getElementById("logoff");
  const addSpreadsheet = document.getElementById("add-spreadsheet");
  spreadsheetsTable = document.getElementById("spreadsheets-table");
  spreadsheetsTableHeader = document.getElementById(
    "spreadsheets-table-header"
  );

  spreadsheetsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addSpreadsheet) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        spreadsheetsTable.replaceChildren([spreadsheetsTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "Your todo has been deleted successfully.";
        deleteSpreadsheet(e.target.dataset.id);
      }
    }
  });
};

export const showSpreadsheets = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/spreadsheets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [spreadsheetsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        spreadsheetsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.spreadsheets.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.spreadsheets[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.spreadsheets[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.spreadsheets[i].googleSpreadsheetId}</td>
            <td>${data.spreadsheets[i].name}</td>
            <td>${data.spreadsheets[i].mappings}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        spreadsheetsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(spreadsheetsDiv);
};
