// script.js
// Add JavaScript code for chat functionality

// Select DOM elements
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const chatMessages = document.getElementById("chat-messages");

const loaderSymbol = document.getElementById("loader-symbol");
const clearButton = document.getElementById("clearBtn");
const resultHeader = document.getElementById("result-header");
const resultData = document.getElementById("result-data");

let controller = null;

// Event listener for send button click
sendButton.addEventListener("click", () => {
  fetchQueryResults();
});

//Function to fetch query results
function fetchQueryResults() {
  displayMessage("", "", "");
  const query = userInput.value;
  if (query !== "") {
    // displayMessage(query, "user");

    toggleLoaderSymbol();

    // Send query to backend and fetch response
    fetch(`/search?query=${query}`)
      .then((response) => response.text())
      .then((data) => {
        toggleLoaderSymbol();
        displayMessage(data, "insightful", query);
      })
      .catch((error) => {
        toggleLoaderSymbol();
        console.error("Error fetching search results:", error);
        displayMessage(
          "Error fetching search results. Please try again.",
          "system"
        );
      });

    // clearInputField(); // Clear input field
  }
}

// Function to display messages in chat
function displayMessage(message, sender, query) {
  //   const messageElement = document.createElement("div");
  //   messageElement.classList.add("message", sender);
  //   messageElement.innerText = message;
  //   chatMessages.appendChild(messageElement);

  resultHeader.textContent = query;
  resultData.textContent = message;
}

//hide or show loader symbol
function toggleLoaderSymbol() {
  loaderSymbol.classList.toggle("hide-loader");
  loaderSymbol.classList.toggle("show-loader");
}

//Event listener for searching on hit of enter key
userInput.addEventListener("keyup", function (event) {
  toggleClearButton(this.value, event);
});

clearButton.addEventListener("click", (event) => {
  clearInputField(event);
});

function clearInputField(event) {
  userInput.value = "";
  clearButton.style.display = "none";
  toggleClearButton("", event);
}

function toggleClearButton(value, event) {
  clearButton.style.display = value ? "block" : "none";
  if (event.key === "Enter") {
    fetchQueryResults();
  }
}
