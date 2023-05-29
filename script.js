// ** CONSTANS ** //
const topOne = getBestScores(1)[0] ? getBestScores(1)[0].spacebarCount : 0;
const figures = document.getElementById("figures");
const inputDiv = document.getElementById("input");
const gameOver = document.getElementById("gameOver");
const playerImg = document.getElementById("playerImg");
const nameInput = document.getElementById("nameInput");
const scoreValue = document.getElementById("scoreValue");
const timerValue = document.getElementById("timerValue");
const startButton = document.getElementById("start");
const opponentImg = document.getElementById("opponentImg");
const finalScoreValue = document.getElementById("finalScoreValue");
const exclamationMark = document.getElementById("!");
const finalScoreMessage = document.getElementById("finalScore");
const scoreboardDisplay = document.getElementById("scoreboard");
const nicSound = new Audio("nicNieCzuje.mp3");
const startSound = new Audio("rundaPierwsza.mp3");
const actionSound = new Audio("dlaczegoNieRypiecie.mp3");
const koncowkaSound = new Audio("koncowka.mp3");
const gameOverSound = new Audio("gameOver.mp3");
const wpiszLoginSound = new Audio("wpiszLogin.mp3");
const miernyWynikSound = new Audio("miernyWynik.mp3");
const najwyzszyWynikSound = new Audio("najwyzszyWynik.mp3");
// ** VARIABLES ** //
let time = 9;
let gameActive = false;
let spacebarCount = 0;
let isSpacebarPressed = false;

// ** FUNCTIONS ** //
// start the action sound, clock and show the seconds in the timer
function startCountdown() {
    actionSound.play();
    const countdownInterval = setInterval(function () {
        if (time >= 0) {
            timerValue.textContent = time + "sek";
            time--;
            // hacky sound loop
            actionSound.onended = () => {
                nicSound.play();
                nicSound.onended = () => {
                    actionSound.play();
                };
            };
        } else {
            actionSound.pause();
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);
}
//
function endGame() {
    gameActive = false;
    figures.style.display = "none";
    gameOver.style.display = "block";
    gameOver.style.animation = "blink 0.3s 10";

    document.onkeyup = undefined;
    document.onkeydown = undefined;

    gameOverSound.play();
    gameOverSound.onended = () => {
        // don't save the score if it's not best than before
        if (spacebarCount < topOne) {
            miernyWynikSound.play();
            miernyWynikSound.onended = () => {
                koncowkaSound.play();
            };
        } else {
            gameOver.style.display = "none";
            finalScoreValue.textContent = spacebarCount;
            finalScoreMessage.style.display = "flex";
            exclamationMark.style.animation = "blink 0.6s 5";
            finalScoreValue.style.animation = "blink 0.55s 5";

            najwyzszyWynikSound.play();
            najwyzszyWynikSound.onended = () => {
                wpiszLoginSound.play();
                finalScoreMessage.style.display = "none";
                inputDiv.style.display = "flex";
                nameInput.style.display = "block";
                nameInput.focus();
            };
        }
    };
}

// display only the top _number_ scores
function getBestScores(number) {
    const savedScores = JSON.parse(localStorage.getItem("scores")) || [];

    savedScores.sort((a, b) => b.spacebarCount - a.spacebarCount);

    return savedScores.slice(0, number);
}

function showScoreboard() {
    scoreboardDisplay.innerHTML = "<h3>Scoreboard</h3>";
    const topTen = getBestScores(10);

    topTen.forEach(function (score, index) {
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
    koncowkaSound.play();
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

// ** HANDLES ** //
// hanle when user finish pushing the space or finish the touch
function handleActionFinish() {
    if (isSpacebarPressed) {
        playerImg.setAttribute("src", "deactive.svg");
    }
    isSpacebarPressed = false;
    spacebarCount += 10;

    const hitsNo = Math.floor(spacebarCount / 100);

    if (hitsNo > 0) {
        document
            .getElementById(`hit${hitsNo}`)
            .setAttribute("fill", "#a40000ff");
    }
    scoreValue.textContent = spacebarCount;
}

startButton.onclick = () => {
    startSound.play();
    startButton.style.animation = "blink 0.9s 10";
    // start the game when the sound has ended
    startSound.onended = () => {
        startButton.style.display = "none";
        figures.style.display = "flex";

        gameActive = true;
        // add all the hooks for the space and touch
        document.onkeydown = (event) => {
            if (event.code === "Space") {
                event.preventDefault();
                if (gameActive && !isSpacebarPressed) {
                    playerImg.setAttribute("src", "active.svg");
                    isSpacebarPressed = true;
                }
            }
        };

        document.ontouchstart = () => {
            if (gameActive && !isSpacebarPressed) {
                playerImg.setAttribute("src", "active.svg");
                isSpacebarPressed = true;
            }
        };

        startCountdown();
    };
};

document.onkeyup = (event) => {
    gameActive && event.code === "Space" && handleActionFinish();
};

document.ontouchend = () => {
    gameActive && handleActionFinish();
};

// no save button so just handle enter as it
nameInput.onkeydown = (event) => {
    event.keyCode === 13 && saveScore();
};
