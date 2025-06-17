import { showAlert } from "./utils.mjs";

const historyList = document.getElementById("history-list");
const savedPrompts = JSON.parse(localStorage.getItem("prompts")) || [];
const clearHistoryBtn = document.getElementById("clear-history");

savedPrompts.forEach((prompt, index) => {
  const listItem = document.createElement("li");
  listItem.textContent = prompt.title;

  const copyBtn = document.createElement("button");
  copyBtn.innerHTML = "<img src='../assets/images/copy.png' alt='Copy Prompt'>";
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
    });
  });
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML =
    "<img src='../assets/images/delete.png' alt='Delete Prompt'>";
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
