import { showAlert } from "./utils.mjs";
// Ensure the DOM is fully loaded before running the script

const generateBtn = document.getElementById("generateBtn");
const seedOutput = document.getElementById("seedOutput");
const output = document.getElementById("promptOutput");
const saveBtn = document.getElementById("saveBtn");
const copyBtn = document.getElementById("copyBtn");
const promptContainer = document.getElementById("generatePage");
const spinner = document.getElementById("spinner");
const loadingText = document.getElementById("loading-messages");

window.addEventListener("DOMContentLoaded", () => {
  generateBtn.click();
});

const loadingMessages = [
  "Generating your prompt...",
  "Please wait a moment...",
  "Almost there...",
  "Crafting your creative spark...",
  "Finding the perfect words...",
  "Just a few seconds more...",
  "Loading your inspiration...",
  "Preparing your unique prompt...",
  "Creating a world of possibilities...",
  "Your prompt is on its way...",
  "Hold tight, creativity is brewing...",
  "Generating a masterpiece for you...",
];
function getRandomLoadingMessage() {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex];
}

let loadingInterval = null;

function loading() {
  promptContainer.classList.toggle("hidden", true);
  spinner.classList.toggle("hidden", false);
  loadingText.classList.toggle("hidden", false);
  output.textContent = getRandomLoadingMessage();
  loadingInterval = setInterval(() => {
    output.textContent = getRandomLoadingMessage();
  }, 5000);
}

function doneLoading() {
  promptContainer.classList.toggle("hidden", false);
  spinner.classList.toggle("hidden", true);
  loadingText.classList.toggle("hidden", true);

  clearInterval(loadingInterval);
  loadingInterval = null;
  output.textContent = "";
}

// Declare variables in a higher scope so they are accessible in event listeners
let parsed = {};
let sentence = parsed
  ? `Title: ${parsed.title}\nSeed: ${parsed.seed}\nSetting: ${
      parsed.setting
    }\nPoint of View: ${parsed.point_of_view}\nGenre: ${parsed.genre}\nTone: ${
      parsed.tone
    }\nFirst Line: ${parsed.first_line}\nSummary: ${
      parsed.summary
    }\nKeywords: ${parsed.keywords?.join(", ")}`
  : "";
let wordSeed = "";

// The rest of your code...

copyBtn.addEventListener("click", () => {
  if (sentence) {
    navigator.clipboard.writeText(sentence).then(() => {
      showAlert("Prompt copied to clipboard!");
    });
  }
});

saveBtn.addEventListener("click", () => {
  if (parsed && wordSeed) {
    const promptData = {
      title: parsed.title,
      setting: parsed.setting,
      point_of_view: parsed.point_of_view,
      genre: parsed.genre,
      tone: parsed.tone,
      first_line: parsed.first_line,
      summary: parsed.summary,
      keywords: parsed.keywords,
      seed: wordSeed,
      date: new Date().toISOString(),
    };
    const savedPrompts = JSON.parse(localStorage.getItem("prompts")) || [];
    // Check for duplicate: same title and seed
    const isDuplicate = savedPrompts.some(
      (p) => p.title === promptData.title && p.seed === promptData.seed
    );
    if (isDuplicate) {
      showAlert("This prompt is already saved.");
      return;
    }
    savedPrompts.push(promptData);
    localStorage.setItem("prompts", JSON.stringify(savedPrompts));
    showAlert("Prompt saved successfully!");
  }
});

generateBtn.addEventListener("click", async () => {
  loading();

  try {
    // Step 1: Get random word
    wordSeed = await fetch(
      "https://random-word-api.herokuapp.com/word?number=1"
    )
      .then((response) => response.json())
      .then((data) => {
        seedOutput.textContent = data[0];
        const response = data[0];
        return response;
      })
      .catch((error) => {
        console.error("Error fetching random word:", error);
      });

    // Step 2: Use Cohere API to generate a writing prompt
    const cohereResponse = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer bj1sIpeboHcgkW6gZRhUo8U0nWLilR7ZS7H7zaC5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Generate a JSON object describing a creative writing prompt. Use the word "${wordSeed}" and follow this format:
        {
          "title": "...",
          "setting": "...",
          "point_of_view": "...",
          "genre": "...",
          "tone": "...",
          "first_line": "...",
          "summary": "...",
          "keywords": ["...", "..."]
          }
          Do not include any additional text or explanations. Each field should be concise to one short sentence. Response should not exceed 100 tokens.`,

        max_tokens: 200,
        temperature: 0.9,
      }),
    });

    const cohereData = await cohereResponse.json();
    try {
      parsed = JSON.parse(cohereData.generations[0].text.trim());

      sentence = `Title: ${parsed.title}\nSeed: ${wordSeed}\nSetting: ${
        parsed.setting
      }\nPoint of View: ${parsed.point_of_view}\nGenre: ${
        parsed.genre
      }\nTone: ${parsed.tone}\nFirst Line: ${parsed.first_line}\nSummary: ${
        parsed.summary
      }\nKeywords: ${parsed.keywords?.join(", ")}`;

      // Update each element by ID
      document.getElementById("title").textContent = parsed.title || "N/A";
      document.getElementById("setting").textContent = parsed.setting || "N/A";
      document.getElementById("point_of_view").textContent =
        parsed.point_of_view || "N/A";
      document.getElementById("genre").textContent = parsed.genre || "N/A";
      document.getElementById("tone").textContent = parsed.tone || "N/A";
      document.getElementById("first_line").textContent =
        parsed.first_line || "N/A";
      document.getElementById("summary").textContent = parsed.summary || "N/A";
      document.getElementById("keywords").textContent =
        (parsed.keywords && parsed.keywords.join(", ")) || "N/A";

      doneLoading();
    } catch (e) {
      console.error("Error parsing JSON:", e);
      output.textContent = "Oops! AI returned invalid JSON.";
      doneLoading();
      return;
    }

    if (!(cohereData.generations && cohereData.generations.length > 0)) {
      output.textContent = "No prompt generated.";
    }
  } catch (error) {
    console.error("Error:", error);
    output.textContent = "Failed to generate prompt.";
    doneLoading();
  }
});
