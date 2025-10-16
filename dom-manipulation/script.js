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
const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ====== FUNCTIONS ======

// Populate the category dropdown dynamically
function populateCategories() {
  const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Display a random quote (filtered by category)
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all categories"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = randomQuote.text;

  // ✅ Save the last shown quote so it can be restored on refresh
  localStorage.setItem("lastQuote", JSON.stringify(randomQuote));
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

// ====== EVENT LISTENERS ======
newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);

// ====== INITIALIZATION ======
populateCategories();

// ✅ Restore the last shown quote after refresh, if available
const lastQuote = JSON.parse(localStorage.getItem("lastQuote"));
if (lastQuote) {
  quoteDisplay.textContent = lastQuote.text;
} else {
  showRandomQuote();
}

// Create the dynamic form
createAddQuoteForm();
