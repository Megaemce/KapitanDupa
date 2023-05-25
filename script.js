const start = document.getElementById("start");
const inputDiv = document.getElementById("input");
const gameOver = document.getElementById("gameOver");
const element1 = document.getElementById("element1");
const elements = document.getElementById("elements-container");
const playerImg = document.getElementById("playerImg");
const nameInput = document.getElementById("nameInput");
const opponentImg = document.getElementById("opponentImg");
const scoreValue = document.getElementById("scoreValue");
const timerValue = document.getElementById("timerValue");
const finalScoreValue = document.getElementById("finalScoreValue");
const exclamationMark = document.getElementById("!");
const finalScoreMessage = document.getElementById("finalScore");
const scoreboardDisplay = document.getElementById("scoreboard");

let gameActive = true;
let keyDownTime;
let spacebarCount = 0;
let isSpacebarHeld = false;
let keyPressTimeout;
let countdownTimeout;
let isSpacebarPressed = false;

function startCountdown() {
    let timeLeft = 1;
    countdownTimeout = setInterval(function () {
        if (timeLeft >= 0) {
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
    gameOver.style.animation = "blink 0.3s 10";

    setTimeout(() => {
        gameOver.style.display = "none";

        finalScoreValue.textContent = spacebarCount;
        finalScoreMessage.style.display = "flex";
        exclamationMark.style.animation = "blink 0.6s 5";
        finalScoreValue.style.animation = "blink 0.55s 5";

        setTimeout(() => {
            finalScoreMessage.style.display = "none";
            inputDiv.style.display = "flex";
            nameInput.style.display = "block";
            nameInput.focus();
        }, 3100);
    }, 3100);

    elements.style.display = "none";
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
        // clean after all
        nameInput.value = "";
        inputDiv.style.display = "none";
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
    spacebarCount += 10;

    const hitsNo = Math.floor(spacebarCount / 100);

    if (hitsNo > 0) {
        document
            .getElementById(`hit${hitsNo}`)
            .setAttribute("fill", "#a40000ff");
    }
    scoreValue.textContent = spacebarCount;
}

start.onclick = () => {
    start.style.display = "none";
    elements.style.display = "flex";
    startCountdown();
};

document.onkeydown = (event) => {
    if (event.code === "Space" && gameActive) {
        event.preventDefault();
        handleKeyDown();
    }
};

document.onkeyup = (event) => {
    if (event.code === "Space" && gameActive) {
        clearTimeout(keyPressTimeout);
        if (isSpacebarPressed) {
            handleKeyUp();
        }
        isSpacebarHeld = false;
        event.preventDefault();
    }
};

nameInput.onkeydown = (event) => {
    if (event.keyCode === 13) {
        saveScore();
    }
};
