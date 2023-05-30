// ** CONSTANS ** //
const topOne = getBestScores(1)[0] ? getBestScores(1)[0].value : 0;
const figures = document.getElementById("figures");
const restart = document.getElementById("restart");
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
// ** SOUNDS ** //
const jakBabeSound = new Audio("sounds/jakBabe.mp3");
const truTuTuSound = new Audio("sounds/truTuTu.mp3");
const noCoJestSound = new Audio("sounds/noCoJest.mp3");
const dlaczegoSound = new Audio("sounds/dlaczego.mp3");
const gameOverSound = new Audio("sounds/gameOver.mp3");
const zCalychSilSound = new Audio("sounds/zCalychSil.mp3");
const wpiszLoginSound = new Audio("sounds/wpiszLogin.mp3");
const nicNieCzujeSound = new Audio("sounds/nicNieCzuje.mp3");
const kapitanDupaSound = new Audio("sounds/kapitanDupa.mp3");
const miernyWynikSound = new Audio("sounds/miernyWynik.mp3");
const sprobujJeszczeRaz = new Audio("sounds/sprobujJeszczeRaz.mp3");
const rundaPierwszaSound = new Audio("sounds/rundaPierwsza.mp3");
const najwyzszyWynikSound = new Audio("sounds/najwyzszyWynik.mp3");
// ** VARIABLES ** //
let time = 9;
let count = 0;
let gameActive = false;
let isPressed = false;

// ** FUNCTIONS ** //
// start the action sound, clock and show the seconds in the timer
function startCountdown() {
    truTuTuSound.play();
    // sounds loop
    truTuTuSound.onended = () => {
        const randomNum = Math.floor(Math.random() * 6);

        if (randomNum === 0) {
            nicNieCzujeSound.play();
            nicNieCzujeSound.onended = () => {
                truTuTuSound.play();
            };
        } else if (randomNum === 1) {
            dlaczegoSound.play();
            dlaczegoSound.onended = () => {
                truTuTuSound.play();
            };
        } else if (randomNum === 2) {
            jakBabeSound.play();
            jakBabeSound.onended = () => {
                truTuTuSound.play();
            };
        } else if (randomNum === 3) {
            noCoJestSound.play();
            noCoJestSound.onended = () => {
                truTuTuSound.play();
            };
        } else if (randomNum === 4) {
            zCalychSilSound.play();
            zCalychSilSound.onended = () => {
                truTuTuSound.play();
            };
        } else {
            truTuTuSound.play();
        }
    };

    const countdownInterval = setInterval(function () {
        if (time >= 0) {
            timerValue.textContent = time + "sek";
            time--;
        } else {
            clearInterval(countdownInterval);
            truTuTuSound.pause();
            jakBabeSound.onended = undefined;
            truTuTuSound.onended = undefined;
            dlaczegoSound.onended = undefined;
            noCoJestSound.onended = undefined;
            zCalychSilSound.onended = undefined;
            nicNieCzujeSound.onended = undefined;

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
        if (count < topOne) {
            miernyWynikSound.play();
            miernyWynikSound.onended = () => {
                kapitanDupaSound.play();
                kapitanDupaSound.onended = () => {
                    sprobujJeszczeRaz.play();
                    gameOver.style.display = "none";
                    restart.style.display = "block";
                };
            };
        } else {
            gameOver.style.display = "none";
            finalScoreValue.textContent = count;
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

    savedScores.sort((a, b) => b.value - a.value);

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
            score.value +
            "</p>";
    });
    scoreboardDisplay.style.display = "flex";
    kapitanDupaSound.play();
    kapitanDupaSound.onended = () => {
        scoreboardDisplay.style.display = "none";
        sprobujJeszczeRaz.play();
        restart.style.display = "block";
    };
}

function saveScore() {
    const name = nameInput.value.trim();
    if (name !== "") {
        const score = { name: name, value: count };
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
    if (isPressed) {
        playerImg.setAttribute("src", "images/deactive.svg");
    }
    isPressed = false;
    count += 10;

    const hitsNo = Math.floor(count / 100);

    if (hitsNo > 0 && hitsNo <= 9) {
        document
            .getElementById(`hit${hitsNo}`)
            .setAttribute("fill", "#a40000ff");
    }
    scoreValue.textContent = count;
}

startButton.onclick = () => {
    rundaPierwszaSound.play();
    startButton.style.animation = "blink 0.8s 10";
    // start the game when the sound has ended
    rundaPierwszaSound.onended = () => {
        startButton.style.display = "none";
        figures.style.display = "flex";

        gameActive = true;
        // add all the hooks for the space and touch
        document.onkeydown = (event) => {
            event.preventDefault();
            if (gameActive && !isPressed) {
                playerImg.setAttribute("src", "images/active.svg");
                isPressed = true;
            }
        };

        document.onkeyup = () => {
            gameActive && handleActionFinish();
        };

        document.ontouchstart = () => {
            if (gameActive && !isPressed) {
                playerImg.setAttribute("src", "images/active.svg");
                isPressed = true;
            }
        };

        document.ontouchend = () => {
            gameActive && handleActionFinish();
        };

        startCountdown();
    };
};

// no save button so just handle enter as it
nameInput.onkeydown = (event) => {
    event.keyCode === 13 && saveScore();
};

// restart the game
restart.onclick = () => {
    time = 9;
    count = 0;
    timerValue.textContent = "9sek";
    scoreValue.textContent = "0";
    restart.style.display = "none";

    for (let i = 1; i <= 9; i++) {
        document.getElementById(`hit${i}`).setAttribute("fill", "#8ae234");
    }

    startButton.style.display = "flex";
    startButton.style.animation = "blink 0.8s 10";
    startButton.click();
};
