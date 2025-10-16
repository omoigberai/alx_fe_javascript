// Load quotes from localStorage or default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do one thing every day that scares you.", category: "Motivation" }
];

// Build category list
function updateCategorySelect() {
  const categorySelect = document.getElementById("categorySelect");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  
  categorySelect.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");
}

// Show a random quote (filtered by category)
function showRandomQuote() {
  const category = document.getElementById("categorySelect").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  let filteredQuotes = quotes;
  if (category !== "all") {
    filteredQuotes = quotes.filter(q => q.category === category);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>"${randomQuote.text}"</strong><br><em>— ${randomQuote.category}</em>`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });

  // Save quotes in localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Update category dropdown
  updateCategorySelect();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("✅ Quote added successfully!");
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categorySelect").addEventListener("change", showRandomQuote);

// Initialize
updateCategorySelect();
showRandomQuote();
