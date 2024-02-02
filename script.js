document.addEventListener("DOMContentLoaded", function () {
    const words = {
        easy: [
            { word: "hangman", question: "A game where players guess a word by suggesting letters." },
            { word: "iceberg", question: "The reason why the Titanic sank." },
            { word: "giraffe", question: "The tallest mammal in the world." },
            { word: "paris", question: "The capital of France." },
            { word: "february", question: "When is Valentines Day celebrated?" },
            { word: "russia", question: "The largest country in the world." },
            { word: "luzon", question: "Largest island in the Philippines by land area." },
            { word: "cebu", question: "The oldest city in the Philippines." },
            { word: "seven", question: "How many continents are there in the world?" },
            { word: "wednesday", question: "Comes after Tuesday." },
        ],
        moderate: [
            { word: "python", question: "A high-level programming language known for its readability." },
            { word: "debugging", question: "The term for finding and fixing errors in a computer programming ." },
            { word: "sorting", question: "The process of rearranging elements in a list in a particular order." },
            { word: "microsoft", question: "Which company developed the Windows operating system?" },
            { word: "blockchain", question: "Technology used to record cryptocurrency transactions." },
            { word: "data", question: "Raw facts and figures." },
            { word: "booting", question: "The process of starting or restarting a computer." },
            { word: "processor", question: "A component often referred to as a 'brain' of the motherboard." },
            { word: "space bar", question: "Largest key in the keyboard." },
            { word: "database", question: "SQL is used for?" },
        ],
        difficult: [
            { word: "algorithm", question: "A step-by-step procedure or formula for solving a problem." },
            { word: "framework", question: "A pre-built set of tools and conventions for developing software applications." },
            { word: "encryption", question: "The process of converting information into a code to prevent unauthorized access." },
            { word: "backspace", question: "Deletes character from the left" },
            { word: "software", question: "A Set of instructions that a computer has to carry out" },
            { word: "information", question: "Organized data that brings out meaning and context" },
            { word: "creeper", question: "The first computer virus is known as ___ program." },
            { word: "archie", question: "The first search engine on the internet" },
            { word: "network", question: "A group of two or more computers linked together." },
            { word: "router", question: "Device that acts as an interface between two networks." },
        ]
    };

    let currentQuestion = 0;
    let selectedWord = "";
    let guessedWord = [];
    let incorrectGuesses = 0;
    let maxIncorrectGuesses = 3;
    let score = 0;
    let cluesUsed = 0;
    let chosenLetters = [];

    const difficultyContainer = document.getElementById("difficulty-container");
    const startGameButton = document.getElementById("start-game-btn");
    const hangmanContainer = document.getElementById("hangman-container");
    const wordDisplay = document.getElementById("word-display");
    const guessesLeft = document.getElementById("guesses");
    const scoreDisplay = document.getElementById("points");
    const clueContainer = document.getElementById("clue-container");
    const clueButton = document.getElementById("clue-btn");
    const clueDisplay = document.getElementById("clue");
    const lettersContainer = document.getElementById("letters");
    const questionDisplay = document.getElementById("question");

    startGameButton.addEventListener("click", function () {
        const selectedDifficulty = getDifficulty();
        if (selectedDifficulty) {
            difficultyContainer.style.display = "none";
            hangmanContainer.style.display = "block";
            startNewRound(selectedDifficulty);
        }
    });

    function checkGuess(letter) {
        letter = letter.toUpperCase();

        if (!chosenLetters.includes(letter)) {
            chosenLetters.push(letter);

            if (selectedWord.includes(letter)) {
                for (let i = 0; i < selectedWord.length; i++) {
                    if (selectedWord[i] === letter) {
                        guessedWord[i] = letter;
                    }
                }

                if (!guessedWord.includes("_")) {
                    alert("Correct! You guessed the word: " + selectedWord);
                    score += 10;
                    currentQuestion++;
                    startNewRound(getDifficulty());
                }
            } else {
                incorrectGuesses++;

                if (incorrectGuesses === maxIncorrectGuesses) {
                    alert("Incorrect! The correct word was: " + selectedWord);
                    resetGame();
                    return;
                }
            }

            updateWordDisplay();
            updateGuessesLeft();
            updateScore();
            updateLetters();
        }
    }

    function startNewRound(difficulty) {
        selectedWord = words[difficulty][currentQuestion].word.toUpperCase();
        guessedWord = Array(selectedWord.length).fill("_");
        incorrectGuesses = 0;
        cluesUsed = 0;
        chosenLetters = [];

        const currentQuestionText = words[difficulty][currentQuestion].question;
        questionDisplay.innerHTML = `
            <p>Question ${currentQuestion + 1}:</p>
            <p>${currentQuestionText}</p>
        `;

        updateWordDisplay();
        updateGuessesLeft();
        updateScore();
        updateLetters();
        clearClue();

        if (currentQuestion >= words[difficulty].length) {
            alert("Game Over! Your total score is: " + score);
            resetGame();
        }
    }

    function updateWordDisplay() {
        wordDisplay.innerHTML = "";

        for (let i = 0; i < guessedWord.length; i++) {
            const letterSpan = document.createElement("span");

            letterSpan.textContent = guessedWord[i] !== "_" ? guessedWord[i] : "_";

            letterSpan.style.display = "inline-block";
            letterSpan.style.background = "rgba(210, 210, 210, 0.9)";
            letterSpan.style.padding = "5px";
            letterSpan.style.margin = "2px";
            letterSpan.style.borderRadius = "5px";

            wordDisplay.appendChild(letterSpan);
        }
    }

    function updateGuessesLeft() {
        guessesLeft.textContent = maxIncorrectGuesses - incorrectGuesses;
    }

    function updateScore() {
        scoreDisplay.textContent = Math.max(0, score);
    }
    

    function updateLetters() {
        lettersContainer.innerHTML = "";

        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement("button");
            button.textContent = letter;
            button.addEventListener("click", function () {
                checkGuess(letter);
            });

            if (chosenLetters.includes(letter)) {
                button.disabled = true;
                button.style.color = "gray";
            }

            lettersContainer.appendChild(button);
        }
    }

    function getDifficulty() {
        const difficultySelect = document.getElementById("difficulty-select");
        return difficultySelect.value.toLowerCase();
    }

    function clearClue() {
        clueDisplay.textContent = "";
        clueButton.disabled = false;
    }

    function getClue() {
        if (score < 25) {
            clueDisplay.textContent = "Not enough points for a clue!";
            return;
        }

        clueDisplay.innerHTML = `
            <p>Choose a letter type for the clue:</p>
            <button id="consonant-btn">Consonant</button>
            <button id="vowel-btn">Vowel</button>
        `;

        document.getElementById("consonant-btn").addEventListener("click", () => provideClue("consonant"));
        document.getElementById("vowel-btn").addEventListener("click", () => provideClue("vowel"));

        clueButton.disabled = true;
    }

    function provideClue(letterType) {
        const unusedLetters = [];

        for (let i = 0; i < guessedWord.length; i++) {
            if (guessedWord[i] === "_") {
                unusedLetters.push(selectedWord[i]);
            }
        }

        if (unusedLetters.length === 0) {
            clueDisplay.textContent = "No more clues available!";
            return;
        }

        const filteredLetters = unusedLetters.filter(letter => {
            const isVowel = "AEIOU".includes(letter);
            return (letterType.toLowerCase() === "consonant" && !isVowel) ||
                (letterType.toLowerCase() === "vowel" && isVowel);
        });

        if (filteredLetters.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredLetters.length);
            const randomLetter = filteredLetters[randomIndex];

            clueDisplay.textContent = `Clue ${cluesUsed + 1}: Choose a ${letterType} letter - ${randomLetter}`;
            cluesUsed++;
        } else {
            clueDisplay.textContent = `No available ${letterType} clues. Choose the other type.`;
        }

        score -= 25;
        updateScore();

        if (cluesUsed >= 3) {
            clueButton.disabled = true;
        }
    }

    function resetGame() {
        currentQuestion = 0;
        difficultyContainer.style.display = "block";
        hangmanContainer.style.display = "none";
    }

    document.getElementById("new-game").addEventListener("click", function () {
        resetGame();
    });

    clueButton.addEventListener("click", getClue);
});