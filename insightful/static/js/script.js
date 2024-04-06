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
const resultContainer = document.getElementById("result-container");
const shareIcon = document.getElementById("share-icon");
const toggleButton = document.getElementById("toggleButton");
const copyLinkButton = document.getElementById("copyLinkButton");


let isToggled = false;
let queryData = null;

copyLinkButton.addEventListener("click", () => {
  copyLinkToClipBoard();
})
//Function to share link via apps
function copyLinkToClipBoard() {
  try {
    let queryParam = encodeURIComponent(userInput.value);
    const urlToCopy = `http://127.0.0.1:5000/display?query=${queryParam}`; // Replace with your link
    navigator.clipboard.writeText(urlToCopy);
    alert("Link copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy link:", error);
    alert("Failed to copy link. Please try again.");
  }
}

// Event listener for send button click
sendButton.addEventListener("click", () => {
  fetchQueryResults();
});

//Event listener for searching on hit of enter key
userInput.addEventListener("keyup", function (event) {
  toggleClearButton(this.value, event);
});

//Event listener to clear search input
clearButton.addEventListener("click", (event) => {
  clearInputField(event);
});

//Event listener for dispaying data toggle type
toggleButton.addEventListener("click", () => {
  toggleButtonDisplay();
});

function toggleButtonDisplay() {
  // Toggle the state
  isToggled = !isToggled;

  // Update the button value based on the state
  if (isToggled) {
    toggleButton.textContent = "Display as paragraph";
    toggleDisplayText(queryData);
  } else {
    toggleButton.textContent = "Display as list";
    toggleDisplayText(queryData);
  }
}
//Function to fetch query results
function fetchQueryResults() {
  displayMessage("", "", "");
  queryData = null;
  resultContainer.style.display = "none";
  const query = userInput.value;
  if (query !== "") {
    // displayMessage(query, "user");

    toggleLoaderSymbol();

    // Send query to backend and fetch response

    // let data = " There is a limited period of time during which you can register for the Diversity Immigrant Visa (DV) Program . Each year, the Department of State publishes detailed instructions for entering the DV Program . Detailed guidance for completing the online entry form is included in the DV Instructions . After you submit a complete entry, you will see a confirmation screen containing your name and a unique confirmation number .  Number of Online Entries Received During Each Registration Period Number of Selected Entrants for Recent DV Programs Number of Visa Issuances and Adjustments of Status in the Diversity Immigrant Category A-Z Index .  Each year, the Department of State conducts a random selection of Diversity Immigrant Visa (DV) applicants . Entrants in the Diversity Visa 2024 program may check the status of their entries on the E-DV website from May 6 2023 through September 30, 2024 . If your entry is selected, you will be directed to a confirmation page that will provide further instructions .  Merriam-Webster.com Dictionary is America's largest dictionary and get thousands more definitions and advanced search—ad free!  Get Word of the Day daily email! Learn a new word every day .  The strains du/dx, dv/dy, dw/dz are therefore stretches parallel to the axes . They saye ther Masses also 29 Dv in the honor of this / or of that saincte .  DV may refer to DV, DV or DV . DV may be the name of a film or television series . DV is a television series of films and television shows .  This website is using a security service to protect itself from online attacks . There are several actions that could trigger this block . You can email the site owner to let them know you were blocked .  The Diversity Immigrant Visa Program (DV Program) makes immigrant visas available to citizens of countries with low immigration rates . The dates you can register for the DV Lottery change each year . Ask a real person any government-related question for free ."

    fetch(`/search?query=${query}`)
      .then((response) => response.text())
      .then((data) => {
        let res = JSON.parse(data)
        res[0] = res[0].replace(/^\S+\s*/, '').replace(/^./, str => str.toUpperCase());

        toggleLoaderSymbol();
        queryData = res;
        displayMessage(res, "insightful", query);
      })
      .catch((error) => {
        toggleLoaderSymbol();
        console.error("Error fetching search results:", error);
        toggleButton.style.display = "none";
        copyLinkButton.style.display = "none";
        displayMessage(
          "We couldn't find any results for you. Don't worry, you can try again later!",
          "system",
          "Sorry :("
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
  resultContainer.style.display = "block";

  //   resultData.textContent = message;

  toggleDisplayText(message);
}

//Function to hide or show loader symbol
function toggleLoaderSymbol() {
  loaderSymbol.classList.toggle("hide-loader");
  loaderSymbol.classList.toggle("show-loader");
}

//Function to clear input
function clearInputField(event) {
  userInput.value = "";
  clearButton.style.display = "none";
  toggleClearButton("", event);
}

//Function to hide or show clear button
function toggleClearButton(value, event) {
  clearButton.style.display = value ? "block" : "none";
  if (event.key === "Enter") {
    fetchQueryResults();
  }
}

//Function to share link via apps
function copyLinkToClipBoard() {
  try {
    const urlToCopy = "http://example.com"; // Replace with your link
    navigator.clipboard.writeText(urlToCopy);
    alert("Link copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy link:", error);
    alert("Failed to copy link. Please try again.");
  }
}

//Function to display data as selected
function toggleDisplayText(res) {
  let data = res;
  resultData.textContent = "";
  if (isToggled === false) {
    //para
    const paraElement = document.createElement("p");
    paraElement.innerText = Array.isArray(data) ? data.join(" ") : data;
    resultData.appendChild(paraElement);
  } else {
    //else list
    const ulElement = document.createElement("ul");
    for (const item of data) {
      const liElement = document.createElement("li");
      liElement.textContent = item;
      ulElement.appendChild(liElement);
    }

    resultData.appendChild(ulElement);
  }
}
