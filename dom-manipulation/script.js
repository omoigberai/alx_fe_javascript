// Initial quotes data
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" },
  { text: "The secret of getting ahead is getting started.", category: "Productivity" },
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteSection = document.getElementById("addQuoteSection");

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  populateCategoryDropdown();
  showRandomQuote();
  createAddQuoteForm();
});

// Populate category dropdown dynamically
function populateCategoryDropdown() {
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";
  
  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All Categories";
  categorySelect.appendChild(allOption);
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Display random quote
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = categorySelect.value;
  
  if (selectedCategory && selectedCategory !== "All") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category } = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p>"${text}"</p>
    <p class="category">Category: ${category}</p>
  `;
}

// Create form for adding new quotes dynamically
function createAddQuoteForm() {
  const form = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addBtn);

  addQuoteSection.appendChild(form);
}

// Add a new quote dynamically
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category!");
    return;
  }

  quotes.push({ text, category });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategoryDropdown();
  showRandomQuote();
  alert("Quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);
