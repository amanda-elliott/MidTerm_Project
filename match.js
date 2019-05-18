"use strict";

window.onload = function () {

    const cardList = [
        {
            name: "cancer",
            image: "images/cancer.png"
        },

        {
            name: "gemini",
            image: "images/gemini.png"
        },
        {
            name: "leo",
            image: "images/leo.png"
        },
        {
            name: "libra",
            image: "images/libra.png"
        },
        {
            name: "sagittarius",
            image: "images/sagittarius.png"
        },
        {
            name: "scorpio",
            image: "images/scorpio.png"
        },
        {
            name: "cancer",
            image: "images/cancer.png"
        },

        {
            name: "gemini",
            image: "images/gemini.png"
        },
        {
            name: "leo",
            image: "images/leo.png"
        },
        {
            name: "libra",
            image: "images/libra.png"
        },
        {
            name: "sagittarius",
            image: "images/sagittarius.png"
        },
        {
            name: "scorpio",
            image: "images/scorpio.png"
        }
    ];


    //hiding end-of-game popup
    document.querySelector(".win_popup").classList.add("hide");
    document.querySelector(".modal").classList.add("hide");
    
    //adding event listeners to buttons
    document.querySelector(".start_button").addEventListener("click", startGame);
    document.querySelector(".reset_button").addEventListener("click", startGame);
    document.querySelector(".playAgain_button").addEventListener("click", startGame);
    
    //adding sounds to variables
    let cardSound = new Audio("/sounds/laser-sound.mp3");
    let startSound = new Audio("/sounds/start-sound.wav");
    let winSound = new Audio("/sounds/win-sound.wav");

    //start timer function
    let second = 0;
    let minute = 0;
    let timer = document.querySelector(".timer_section");
    let interval;
    function startTimer() {
        interval = setInterval(function () {
            timer.innerHTML = minute + " mins  " + second + " secs ";
            second++;
            if (second == 60) {
                minute++;
                second = 0;
            }
            if (minute == 60) {
                hour++;
                minute = 0;
            }
        }, 1000);
    };

    //function to show card flip when reset button clicked
    function resetFlip() {
        if (event.target.matches(".start_button") || event.target.matches(".playAgain_button")) {
            return;
        }
        let resetInfo = document.querySelectorAll(".card");
        function flipUp() {
            resetInfo.forEach(function (card) {
                setTimeout(card.classList.add("selected"), 3000);
            });
        }
        setTimeout(flipUp, 500);

        function flipDown() {
            resetInfo.forEach(function (card) {
                card.classList.remove("selected");
            });
        }
        setTimeout(flipDown, 1000);
    }

    //start game function
    function startGame(event) {
        event.preventDefault();

        //clears card section inner html so that reset and play again buttons clear the current deck to be replaced
        document.querySelector("#card_section").innerHTML = "";
        
        //hiding start game and end-of-game popups
        document.querySelector(".start_popup").classList.add("hide");
        document.querySelector(".win_popup").classList.add("hide");
        document.querySelector(".modal").classList.add("hide");

        //adds sound to start button click
        let buttonClick = event.target;
        if (buttonClick) {
            startSound.play();
        }

        //sets timer to 0 at start of game
        second = 0;
        minute = 0;
        let timer = document.querySelector(".timer_section");
        timer.innerHTML = "0 mins 0 secs";
        clearInterval(interval);

        startTimer();

        //randomizes cards
        cardList.sort(function () {
            return 0.5 - Math.random();
        });

        //clears click variables at start of game for functions
        let firstClick = "";
        let secondClick = "";
        let clickCount = 0;
        let previousTarget = null;
        let delay = 1200;

        //builds out card deck 
        let cardSection = document.getElementById("card_section");
        let grid = document.createElement("section");
        grid.setAttribute("class", "grid");
        cardSection.appendChild(grid);

        cardList.forEach(function (item) {
            let name = item.name,
                image = item.image;

            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.name = name;

            let cardFront = document.createElement("div");
            cardFront.classList.add("cardFront");

            let cardBack = document.createElement("div");
            cardBack.classList.add("cardBack");
            cardBack.style.backgroundImage = "url(" + image + ")";

            grid.appendChild(card);
            card.appendChild(cardFront);
            card.appendChild(cardBack);

        });

        resetFlip();

        //function if the selected cards match, adds class of match 
        const checkMatch = function checkMatch() {
            let selected = document.querySelectorAll(".selected");
            selected.forEach(function (card) {
                card.classList.add("match");
            });

            //if all cards have matched, populates the time it took and unhides the end-of-game popup and plays sound
            let ourMatches = document.querySelectorAll(".match").length
            if (ourMatches === 12) {
                clearInterval(interval);
                let finalTime = timer.innerHTML;
                document.getElementById("totalTime").innerHTML = finalTime;
                document.querySelector(".win_popup").classList.add("scale-up-ver-top");
                document.querySelector(".win_popup").classList.remove("hide");
                document.querySelector(".modal").classList.remove("hide");
                console.log("you win");

                winSound.play();
            }
        }

        //function if selected cards do not match, removes class of selected
        const noMatch = function noMatch() {
            firstClick = "";
            secondClick = "";
            clickCount = 0;
            previousTarget = null;

            let selected = document.querySelectorAll(".selected");
            selected.forEach(function (card) {
                card.classList.remove("selected");
            });
        }

        //adds click event to cards
        cardSection.addEventListener("click", function (event) {
            let clicked = event.target;

            //adds sound to clicked card
            if (clicked) {
                cardSound.play();
            }

            //if selected card is any the below, the card will flip back
            if (clicked.nodeName === "SECTION" || clicked === previousTarget || clicked.parentNode.classList.contains("selected") || clicked.parentNode.classList.contains("match")) {
                return;
            }

            //if less than 2 card clicks, click count increases and add class of selected
            if (clickCount < 2) {
                clickCount++;
                if (clickCount === 1) {
                    firstClick = clicked.parentNode.dataset.name;
                    console.log(firstClick);
                    clicked.parentNode.classList.add("selected");

                    //adds class of selected to 2nd clicked card
                } else {
                    secondClick = clicked.parentNode.dataset.name;
                    console.log(secondClick);
                    clicked.parentNode.classList.add("selected");
                }

                //if the selected cards match, runs checkMatch function after a short delay
                if (firstClick && secondClick) {
                    if (firstClick === secondClick) {
                        setTimeout(checkMatch, delay);
                    }

                    //if selected cards don't match, runs noMatch function after a short delay
                    setTimeout(noMatch, delay);
                }
                
                //changes the previous from null to clicked, returns via line 227 condition
                previousTarget = clicked;
            }
        });

    }

}

