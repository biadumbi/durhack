
//
// LOVE, LIES & LIABILITIES
// Game logic
//

// Each boy has a possible loss and gain percentage
const boys = {
    "1": {
        name: "Alex",
        loss: -5,
        gain: 10,
        image: "alex.png"
    },
    "2": {
        name: "Jamie",
        loss: -15,
        gain: 25,
        image: "jamie.png"
    },
    "3": {
        name: "Taylor",
        loss: -30,
        gain: 50,
        image: "taylor.png"
    }
};

// Good relationship news
const goodNews = {
    "1": [
        "Alex plans a surprise date!",
        "Alex buys you flowers!",
        "Alex bakes you cookies!",
        "Alex wants to go on holiday with you!",
        "Alex cleans the house!"
    ],

    "2": [
        "Jamie sends you a flirty message!",
        "Jamie asks you on a romantic date!",
        "Jamie falls asleep on ft with you!",
        "Jamie serenades you with his guitar!",
        "Jamie blocks his ex!"
    ],

    "3": [
        "Taylor texts: 'I miss you...'",
        "Taylor wants to get back together!",
        "Taylor sends £1000!",
        "Taylor uses your birthday to slide back into your dms!",
        "Taylor slid up on your instagram story!"
    ]
};

// Bad relationship news
const badNews = {
    "1": [
        "Alex forgets your date!",
        "Alex catches you texting Jamie!",
        "Alex sees a suspicious Instagram comment!",
        "Alex doesnt watch the 84 insta reels you sent him!",
        "Alex doesnt text you good morning!"
    ],

    "2": [
        "Jamie leaves you on read!",
        "Jamie goes on a date with his coworker!",
        "Jamie responds to your heartfelt paragraph message with a thumbs up!",
        "Jamie spends your whole date on his phone!",
        "Jamie insulted your best friend!"
    ],

    "3": [
        "Taylor gets back with his ex!",
        "Taylor blocks you on Instagram!",
        "Taylor goes on a boys trip to Las Vegas!",
        "Taylor asks you to come over at 2am!",
        "Taylor calls you his exes name!"
    ]
};

// Extra scandal events
const scandals = {
    "1": [
        ["Alex finds your secret dating profile!", -20],
        ["Alex proposes to you!", 30],
        ["Alex finds Jamie's hoodie in your room!", -25]
    ],

    "2": [
        ["Jamie accidentally posts you on his story!", -15],
        ["Jamie confesses his love for you!", 35],
        ["Jamie finds out about Taylor!", -30]
    ],

    "3": [
        ["Taylor turns up at your house uninvited!", -20],
        ["Taylor buys you a car!", 50],
        ["Taylor exposes your group chat!", -40]
    ]
};


// GAME VARIABLES
let time = 100;
let roundNumber = 1;
const maxRounds = 3;
let scandalRound = Math.floor(Math.random() * 3) + 1;

let investments = {
    "1": 0,
    "2": 0,
    "3": 0
};


let stockPrices = {
    "1": 100,
    "2": 100,
    "3": 100
};

let priceHistory = {
    "1": [100],
    "2": [100],
    "3": [100]
};



// HTML ELEMENTS
const balanceDisplay = document.getElementById("balance");
const roundDisplay = document.getElementById("round");
const remainingDisplay = document.getElementById("remaining");

const alexInput = document.getElementById("alex");
const jamieInput = document.getElementById("jamie");
const taylorInput = document.getElementById("taylor");

const investButton = document.getElementById("invest-button");
const nextButton = document.getElementById("next-button");

const resultsSection = document.getElementById("results");
const newsDisplay = document.getElementById("news");
const scandalDisplay = document.getElementById("scandal");
const scandalSection = document.getElementById("scandal-section");

const roundProfitDisplay = document.getElementById("round-profit");
const newBalanceDisplay = document.getElementById("new-balance");

const charactersSection = document.getElementById("characters");
const portfolioSection = document.getElementById("portfolio");


// Choose one random element from an array
function randomChoice(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}


function updateStockPrice(choice, percentage) {

    const oldPrice = stockPrices[choice];

    const newPrice = oldPrice * (1 + percentage / 100);

    stockPrices[choice] = Math.round(newPrice * 100) / 100;
}



// Calculate the total number of minutes invested
function totalInvested() {
    return (
        Number(alexInput.value) +
        Number(jamieInput.value) +
        Number(taylorInput.value)
    );
}


// Update the remaining minutes display
function updateRemaining() {
    const remaining = time - totalInvested();

    remainingDisplay.textContent = remaining;

    if (remaining < 0) {
        remainingDisplay.style.color = "red";
    } else {
        remainingDisplay.style.color = "green";
    }
}


// Listen for changes to investment inputs
alexInput.addEventListener("input", updateRemaining);
jamieInput.addEventListener("input", updateRemaining);
taylorInput.addEventListener("input", updateRemaining);


// Normal investment outcome
function invest(choice, amount) {

    const boy = boys[choice];

    // Randomly choose loss or gain
    const percentage =
    Math.floor(Math.random() * (boy.gain - boy.loss + 1)) + boy.loss;

    // Calculate profit or loss
    const profit = Math.round(amount * percentage / 100);

    // Select matching news
    let news;

    if (percentage > 0) {
        news = randomChoice(goodNews[choice]);
    } else if (percentage < 0) {
        news = randomChoice(badNews[choice]);
    } else {
        news = `${boy.name}' has been busy this week!`;
    }      

    return {
        name: boy.name,
        percentage: percentage,
        profit: profit,
        news: news
    };
}


// Generate one additional random scandal
function randomScandal(investments) {

    // Select one random boy
    const choice = randomChoice(["1", "2", "3"]);

    const name = boys[choice].name;

    // Choose one of his scandal events
    const selectedScandal = randomChoice(scandals[choice]);

    const event = selectedScandal[0];
    const percentage = selectedScandal[1];

    // Find the amount invested in him
    const amount = investments[choice];

    // Calculate extra profit or loss
    const profit = Math.round(amount * percentage / 100);

    return {
    choice: choice,
    name: name,
    image: boys[choice].image,
    event: event,
    percentage: percentage,
    profit: profit
    };
}


// Run one round
function playRound() {

    // Read the investment inputs
    const amounts = [
        alexInput.value,
        jamieInput.value,
        taylorInput.value
    ].map(Number);

    // Validate the inputs
    if (amounts.some(amount =>
        !Number.isSafeInteger(amount) || amount < 0
    )) {
        alert("Please enter whole numbers of minutes.");
        return;
    }

    if (amounts.reduce((sum, amount) => sum + amount, 0) > time) {
        alert("You don't have enough minutes!");
        return;
    }

    investments = {
        "1": amounts[0],
        "2": amounts[1],
        "3": amounts[2]
    };

    let totalProfit = 0;

    // Clear previous results
    newsDisplay.innerHTML = "";
    scandalDisplay.innerHTML = "";

    // Normal movements for all three boys
    for (const choice of ["1", "2", "3"]) {

        const amount = investments[choice];

        const result = invest(choice, amount);

        totalProfit += result.profit;


    updateStockPrice(choice, result.percentage);

        
    const resultCard = document.createElement("div");
    resultCard.className = "result-card";

    // Create the boy's image
    const image = document.createElement("img");
    image.src = boys[choice].image;
    image.alt = result.name;
    image.className = "result-avatar";

    // Create a container for the text
    const textContainer = document.createElement("div");
    textContainer.className = "result-text";

    // Boy's name
    const name = document.createElement("h3");
    name.textContent = result.name;

    // Relationship news
    const news = document.createElement("p");
    news.textContent = result.news;

    // Percentage change and profit/loss
    const movement = document.createElement("p");

    movement.textContent =
        `${result.percentage > 0 ? "+" : ""}${result.percentage}% | ` +
        `${result.profit > 0 ? "+" : ""}${result.profit} minutes`;

    movement.className =
        result.profit > 0 ? "positive" :
        result.profit < 0 ? "negative" : "";

    // Put the text together
    textContainer.appendChild(name);
    textContainer.appendChild(news);
    textContainer.appendChild(movement);

    // Put the image and text inside the card
    resultCard.appendChild(image);
    resultCard.appendChild(textContainer);

    // Display the finished card
    newsDisplay.appendChild(resultCard);

    }
       


if (roundNumber === scandalRound) {

    const scandal = randomScandal(investments);

    totalProfit += scandal.profit;

    updateStockPrice(scandal.choice, scandal.percentage);

    // Fill the popup with scandal information
    document.getElementById("popup-image").src = scandal.image;

    document.getElementById("popup-name").textContent =
        scandal.name;

    document.getElementById("popup-event").textContent =
        scandal.event;

    document.getElementById("popup-affection").textContent =
        `Affection change: ${scandal.percentage > 0 ? "+" : ""}${scandal.percentage}%`;

    document.getElementById("popup-profit").textContent =
        `Your return: ${scandal.profit > 0 ? "+" : ""}${scandal.profit} minutes`;

    // Show the pink popup
    document.getElementById("scandal-overlay").hidden = false;
}

// Hide the old scandal section on the main screen
scandalSection.hidden = true;


// Record stock prices after all events
for (const choice of ["1", "2", "3"]) {
    priceHistory[choice].push(stockPrices[choice]);
}

// Update balance
time += totalProfit;

// Update the graph
displayPriceHistory();

// Display round results
roundProfitDisplay.textContent =
    `Total profit/loss: ${totalProfit > 0 ? "+" : ""}${totalProfit} minutes`;

newBalanceDisplay.textContent =
    `New balance: ${time} minutes`;

// Hide investment screen
charactersSection.hidden = true;
portfolioSection.hidden = true;

// Show results screen
resultsSection.hidden = false;

// Update next button
if (roundNumber === maxRounds || time <= 0) {
    nextButton.textContent = "See Final Results ♡";
} else {
    nextButton.textContent = "Next Round ♡";
}

// Close the playRound function
}




// Move to the next round
function nextRound() {

    if (roundNumber === maxRounds || time <= 0) {
        showGameOver();
        return;
    }

    roundNumber++;

    roundDisplay.textContent = roundNumber;
    balanceDisplay.textContent = time;

    // Reset investment inputs
    alexInput.value = 0;
    jamieInput.value = 0;
    taylorInput.value = 0;

    updateRemaining();

    // Show investment screen again
    charactersSection.hidden = false;
    portfolioSection.hidden = false;

    // Hide results
    resultsSection.hidden = true;

    displayStockPrices();
}


// Display final results
function showGameOver() {

    resultsSection.hidden = false;
    charactersSection.hidden = true;
    portfolioSection.hidden = true;

    newsDisplay.innerHTML = "";
    scandalDisplay.innerHTML = "";

    const overallProfit = time - 100;

    let message;

    if (overallProfit > 0) {
        message = "You're the queen of the dating market!";
    } else if (overallProfit < 0) {
        message = "The dating market has humbled you.";
    } else {
        message = "No heartbreak, no profit.";
    }

    // Change the results heading
    resultsSection.querySelector("h2").textContent =
        "GAME OVER! ♡";

    roundProfitDisplay.textContent =
        `Overall profit/loss: ${overallProfit > 0 ? "+" : ""}${overallProfit} minutes`;

    newBalanceDisplay.textContent =
        `Final balance: ${time} minutes. ${message}`;

    nextButton.textContent = "Play Again ♡";

    // Make the button restart the game
    nextButton.onclick = restartGame;
}


// Restart everything
function restartGame() {

    time = 100;
    roundNumber = 1;

    investments = {
        "1": 0,
        "2": 0,
        "3": 0
    };

    roundDisplay.textContent = 1;
    balanceDisplay.textContent = 100;

    alexInput.value = 0;
    jamieInput.value = 0;
    taylorInput.value = 0;

    resultsSection.querySelector("h2").textContent =
        "Breaking Relationship News!";

    resultsSection.hidden = true;
    charactersSection.hidden = false;
    portfolioSection.hidden = false;

    nextButton.textContent = "Next Round ♡";
    nextButton.onclick = nextRound;

    updateRemaining();

    stockPrices = {
        "1": 100,
        "2": 100,
        "3": 100
    };

    priceHistory = {
        "1": [100],
        "2": [100],
        "3": [100]
    };

    scandalRound = Math.floor(Math.random() * 3) + 1;

    displayStockPrices();

}



let stockChart = null;

function displayPriceHistory() {

    const canvas = document.getElementById("stock-chart");

    // Create labels for each recorded round
    const labels = priceHistory["1"].map((price, index) => {
        if (index === 0) {
            return "Start";
        }
        return `Round ${index}`;
    });

    // Remove the previous chart before drawing a new one
    if (stockChart !== null) {
        stockChart.destroy();
    }

    stockChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "Alex",
                    data: priceHistory["1"],
                    borderColor: "#e879a5",
                    backgroundColor: "#e879a5",
                    tension: 0.3
                },
                {
                    label: "Jamie",
                    data: priceHistory["2"],
                    borderColor: "#9b59b6",
                    backgroundColor: "#9b59b6",
                    tension: 0.3
                },
                {
                    label: "Taylor",
                    data: priceHistory["3"],
                    borderColor: "#f39c55",
                    backgroundColor: "#f39c55",
                    tension: 0.3
                }
            ]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    position: "top"
                },
            },

            scales: {
                y: {
                    title: {
                        display: true,
                        text: "Affection Level"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Game Round"
                    }
                }
            }
        }
    });
}



function displayStockPrices() {

    document.getElementById("price-alex").textContent =
        stockPrices["1"].toFixed(2);

    document.getElementById("price-jamie").textContent =
        stockPrices["2"].toFixed(2);

    document.getElementById("price-taylor").textContent =
        stockPrices["3"].toFixed(2);
}



// Connect the buttons
investButton.addEventListener("click", playRound);
nextButton.onclick = nextRound;

// Set the initial display
updateRemaining();


// INTRO SCREEN

const introOverlay = document.getElementById("intro-overlay");
const startGameButton = document.getElementById("start-game-button");

startGameButton.addEventListener("click", function() {

    // Hide the introduction
    introOverlay.style.display = "none";

});

document.getElementById("close-scandal").addEventListener("click", function() {
    document.getElementById("scandal-overlay").hidden = true;
});