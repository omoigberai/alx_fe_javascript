// ====== Dynamic Quote Generator ======

// Default quotes to start with
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
  { text: "Act as if what you do makes a difference. It does.", category: "Positivity" }
];

// Load saved quotes from localStorage (if any)
const savedQuotes = JSON.parse(localStorage.getItem("quotes"));
if (savedQuotes && Array.isArray(savedQuotes)) {
  quotes = savedQuotes;
}

// Select DOM elements
const categoryFilter = document.getElementById("categoryFilter");
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ====== FUNCTIONS ======

// Populate the category dropdown dynamically
function populateCategories() {
  const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // ✅ Restore last selected filter from localStorage
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && categories.map(c => c.toLowerCase()).includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  }
}

// Filter and display quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory); // ✅ Remember filter choice

  const filteredQuotes =
    selectedCategory === "all" || selectedCategory === "all categories"
      ? quotes
      : quotes.filter(q => q.category.toLowerCase() === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = randomQuote.text;
  localStorage.setItem("lastQuote", JSON.stringify(randomQuote)); // ✅ Save last shown quote
}

// Dynamically create the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  const title = document.createElement("h3");
  title.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = () => addQuote(quoteInput, categoryInput);

  formContainer.append(title, quoteInput, categoryInput, addButton);
  document.body.appendChild(formContainer);
}

// Add a new quote and save it to localStorage
function addQuote(quoteInput, categoryInput) {
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes)); // ✅ Save updated quotes
  populateCategories();
  quoteInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// ====== EXPORT FUNCTION ======
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  // Clean up the object URL after download
  URL.revokeObjectURL(url);
}

document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

// ====== IMPORT FUNCTION ======
document.getElementById("importQuotes").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Please upload a JSON array of quotes.");
      }
    } catch (err) {
      alert("Error reading file. Ensure it's a valid JSON file.");
    }
  };

  reader.readAsText(file);
});

// ====== EVENT LISTENERS ======
newQuoteBtn.addEventListener("click", filterQuotes);
categoryFilter.addEventListener("change", filterQuotes);

// ====== INITIALIZATION ======
populateCategories();
filterQuotes();
createAddQuoteForm();
// ====== SERVER SYNC & CONFLICT HANDLING ======

// Simulated server URL (JSONPlaceholder)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Create a small sync status banner
const syncStatus = document.createElement("div");
syncStatus.style.position = "fixed";
syncStatus.style.bottom = "10px";
syncStatus.style.right = "10px";
syncStatus.style.background = "#0078d7";
syncStatus.style.color = "white";
syncStatus.style.padding = "8px 12px";
syncStatus.style.borderRadius = "5px";
syncStatus.style.fontSize = "0.9em";
syncStatus.textContent = "🔄 Sync: Idle";
document.body.appendChild(syncStatus);

// Fetch quotes from the server
async function fetchServerQuotes() {
  try {
    syncStatus.textContent = "🔄 Syncing with server...";
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate converting server data into quote objects
    const serverQuotes = serverData.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
    syncStatus.textContent = "✅ Synced with server";
  } catch (error) {
    console.error("Error syncing with server:", error);
    syncStatus.textContent = "⚠️ Sync failed";
  }
}

// Conflict resolution logic
function resolveConflicts(serverQuotes) {
  let updated = false;

  // Create a map for easy lookup
  const localMap = new Map(quotes.map(q => [q.text.toLowerCase(), q]));

  serverQuotes.forEach(serverQuote => {
    const key = serverQuote.text.toLowerCase();
    if (!localMap.has(key)) {
      quotes.push(serverQuote);
      updated = true;
    } else {
      // Conflict resolution: server version wins
      const localQuote = localMap.get(key);
      if (localQuote.category !== serverQuote.category) {
        localQuote.category = serverQuote.category;
        updated = true;
      }
    }
  });

  if (updated) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuotes();
    alert("Quotes synced with server. Some conflicts were resolved using server data.");
  }
}

// Periodic sync (every 30 seconds)
setInterval(fetchServerQuotes, 30000);

// Manual sync button (optional)
const manualSyncButton = document.createElement("button");
manualSyncButton.textContent = "Sync Now";
manualSyncButton.style.marginTop = "10px";
manualSyncButton.onclick = fetchServerQuotes;
document.body.appendChild(manualSyncButton);

// Initial sync on load
fetchServerQuotes();
