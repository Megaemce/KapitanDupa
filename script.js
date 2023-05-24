const gameOver = document.getElementById("gameOver");
const element1 = document.getElementById("element1");
const elements = document.getElementById("elements-container");
const playerImg = document.getElementById("playerImg");
const nameInput = document.getElementById("nameInput");
const opponentImg = document.getElementById("opponentImg");
const scoreValue = document.getElementById("scoreValue");
const timerValue = document.getElementById("timerValue");
const scoreboardDisplay = document.getElementById("scoreboard");

let gameActive = true;
let keyDownTime;
let spacebarCount = 0;
let isSpacebarHeld = false;
let keyPressTimeout;
let countdownTimeout;
let isSpacebarPressed = false;

function startCountdown() {
    let timeLeft = 10;
    countdownTimeout = setInterval(function () {
        if (timeLeft > 0) {
            timerValue.textContent = timeLeft + "sek";
            timeLeft--;
        } else {
            clearInterval(countdownTimeout);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    gameOver.style.display = "block";
    elements.style.display = "none";

    setTimeout(() => {
        gameOver.style.display = "none";
        setTimeout(() => {
            gameOver.style.display = "block";
            setTimeout(() => {
                gameOver.style.display = "none";
                setTimeout(() => {
                    nameInput.style.display = "block";
                    nameInput.focus();
                }, 500);
            }, 1000);
        }, 500);
    }, 1000);

    clearInterval(countdownTimeout);
}

function showScoreboard() {
    scoreboardDisplay.innerHTML = "<h3>Scoreboard</h3>";
    const savedScores = JSON.parse(localStorage.getItem("scores")) || [];

    // Sort the scores array in descending order
    savedScores.sort((a, b) => b.spacebarCount - a.spacebarCount);

    // Display only the top 10 scores
    const topScores = savedScores.slice(0, 10);

    topScores.forEach(function (score, index) {
        scoreboardDisplay.innerHTML +=
            "<p>" +
            (index + 1) +
            ". " +
            score.name +
            ": " +
            score.spacebarCount +
            "</p>";
    });
    scoreboardDisplay.style.display = "flex";
}

function saveScore() {
    const name = nameInput.value.trim();
    if (name !== "") {
        const score = { name: name, spacebarCount: spacebarCount };
        const savedScores = JSON.parse(localStorage.getItem("scores")) || [];
        savedScores.push(score);
        localStorage.setItem("scores", JSON.stringify(savedScores));
        nameInput.value = "";
        nameInput.style.display = "none";
        scoreboardDisplay.innerHTML = "";
        showScoreboard();
    }
}

function handleKeyDown() {
    if (!isSpacebarPressed) {
        playerImg.setAttribute("src", "active.svg");
        isSpacebarPressed = true;
        keyDownTime = new Date().getTime();
        keyPressTimeout = setTimeout(handleKeyUp, 100);
    }
}

function handleKeyUp() {
    if (isSpacebarPressed && !isSpacebarHeld) {
        playerImg.setAttribute("src", "deactive.svg");
        isSpacebarHeld = true;
    }
    isSpacebarPressed = false;
    clearTimeout(keyPressTimeout);
    spacebarCount++;
    scoreValue.textContent = spacebarCount * 10;
}

function handleInputKeyPress(event) {
    if (event.keyCode === 13) {
        saveScore();
    }
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && gameActive) {
        handleKeyDown();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.code === "Space" && gameActive) {
        clearTimeout(keyPressTimeout);
        if (isSpacebarPressed) {
            handleKeyUp();
        }
        isSpacebarHeld = false;
    }
});

nameInput.addEventListener("keypress", handleInputKeyPress);

startCountdown();
