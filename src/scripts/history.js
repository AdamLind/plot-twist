import { showAlert } from "./utils.mjs";
import copyIconPath from "../assets/images/copy.png";
import deleteIconPath from "../assets/images/delete.png";

const historyList = document.getElementById("history-list");
const savedPrompts = JSON.parse(localStorage.getItem("prompts")) || [];
const clearHistoryBtn = document.getElementById("clear-history");

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("prompts");
  historyList.innerHTML = ""; // Clear the list in the DOM
  showAlert("History cleared!");
  checkIfEmpty();
});

function checkIfEmpty() {
  if (historyList.children.length === 0) {
    historyList.innerHTML = "<li>No saved prompts found.</li>";
  }
}

[...savedPrompts].reverse().forEach((prompt, index) => {
  const listItem = document.createElement("li");
  listItem.textContent = prompt.title;

  const copyBtn = document.createElement("button");
  const copyIcon = document.createElement("img");
  copyIcon.src = copyIconPath;
  copyIcon.alt = "Copy Prompt";
  copyBtn.appendChild(copyIcon);
  copyBtn.classList.add("history-copy-button");
  copyBtn.addEventListener("click", () => {
    const promptText = `Title: ${prompt.title}\nSeed: ${
      prompt.seed
    }\nSetting: ${prompt.setting}\nPoint of View: ${
      prompt.point_of_view
    }\nGenre: ${prompt.genre}\nTone: ${prompt.tone}\nFirst Line: ${
      prompt.first_line
    }\nSummary: ${prompt.summary}\nKeywords: ${prompt.keywords.join(", ")}`;
    navigator.clipboard.writeText(promptText).then(() => {
      showAlert("Prompt copied to clipboard!");
      checkIfEmpty();
    });
  });
  const deleteBtn = document.createElement("button");
  const deleteIcon = document.createElement("img");
  deleteIcon.src = deleteIconPath;
  deleteIcon.alt = "Delete Prompt";
  deleteBtn.appendChild(deleteIcon);
  deleteBtn.classList.add("trash-button");
  deleteBtn.addEventListener("click", () => {
    // Remove the prompt from localStorage
    savedPrompts.splice(index, 1);
    localStorage.setItem("prompts", JSON.stringify(savedPrompts));
    // Remove the list item from the DOM
    historyList.removeChild(listItem);
    showAlert("Prompt deleted!");
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("history-button-container");

  buttonContainer.appendChild(copyBtn);
  buttonContainer.appendChild(deleteBtn);
  listItem.appendChild(buttonContainer);
  historyList.appendChild(listItem);
});
