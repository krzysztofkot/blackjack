import { gameController } from "./gamectrl";

export const controller = (gameCtrl, UICtrl) => {
    const DOM = UICtrl.getDOMstrings();

    const currentData = gameCtrl.getData();
    const curPlayer = gameCtrl.getPlayer();
    const btnNode = document.querySelectorAll(DOM.dataBet);



    //Setup event listeners for bets
    const setupBetsEventListeners = () => {
        document
            .querySelector(DOM.betInput)
            .addEventListener("keyup", UICtrl.insertBet);
        document
            .querySelector(DOM.betInput)
            .addEventListener("paste", UICtrl.preventPaste);
        document
            .querySelector(DOM.allInBtn)
            .addEventListener("click", UICtrl.addAllIn);
        document.querySelector(DOM.acceptBtn).addEventListener("click", accept);
    };

    //Remove event listeners for bets

    const removeBetsEventListener = () => {

        document
            .querySelector(DOM.betInput)
            .removeEventListener("keyup", UICtrl.insertBet);
        document
            .querySelector(DOM.betInput)
            .removeEventListener("paste", UICtrl.preventPaste);
        document
            .querySelector(DOM.allInBtn)
            .removeEventListener("click", UICtrl.addAllIn);
        document.querySelector(DOM.acceptBtn).removeEventListener("click", accept);
    };

    const setupBtnEventListener = () => {
        document.querySelector(DOM.standBtn).addEventListener('click', standAction);
        document.querySelector(DOM.hitBtn).addEventListener('click', hitAction);
        UICtrl.toggleStandAndHitBtns();
        if (currentData.bet <= currentData.totalCash) {
            // doubleBtn flag
            currentData.doubleBtnActive = !currentData.doubleBtnActive;
            UICtrl.toggleDoubleBtn();
            document.querySelector(DOM.doubleBtn).addEventListener('click', doubleAction);
        }
    };

    const removeBtnEventListener = () => {
        document.querySelector(DOM.standBtn).removeEventListener('click', standAction);
        document.querySelector(DOM.hitBtn).removeEventListener('click', hitAction);
        if (currentData.doubleBtnActive) {
            document.querySelector(DOM.doubleBtn).removeEventListener('click', doubleAction);
        }

    };

    const setupHighscoresEventListener = () => {
        document.querySelector(DOM.highscoresContainer).addEventListener('click', nextGame);
    };
    const removeHighscoresEventListener = () => {
        document.querySelector(DOM.highscoresContainer).removeEventListener('click', nextGame);
    };

    const isBlackjack = () => {
        return currentData.persons[0].totalPoints.filter(val => val === 21).length ? bjResults() : setupBtnEventListener();
    };


    //accept bet
    const accept = () => {
        //1. get current bet value
        const value = UICtrl.returnBet();
        //2. Update bet data
        gameCtrl.updateData(value, "bet");

        if (currentData.bet <= currentData.totalCash && currentData.bet > 0) {
            //update player total cash
            gameCtrl.changeCash();
            UICtrl.printNewCash(currentData.totalCash);

            //disable bet input
            UICtrl.inputToggleDisable();

            //remove bet event listeners
            removeBetsEventListener();
            //set bet btn colors to inactive
            UICtrl.changeElementsColors(btnNode);
            startGame();
        } else {
            UICtrl.clearBetInput();
        }
    };

    const bjResults = () => {
        let result;
        curPlayer.changePlayer();
        UICtrl.toggleDisplayPoints(curPlayer.player[1]);
        UICtrl.rotateCroupierCard();
        UICtrl.toggleStandAndHitBtns();

        if (currentData.doubleBtnActive) {
            currentData.doubleBtnActive = !currentData.doubleBtnActive;
            UICtrl.toggleDoubleBtn();
        }

        const croupierResult = currentData.persons[1].totalPoints.filter(val => val === 21).length;
        if (croupierResult) {
            result = 'draw';
        } else {
            result = 'Blackjack';
        }
        updateStatistics(result);
        setupHighscoresEventListener();
    };

    const results = () => {

        let result;
        //get player results
        const playerResults = currentData.persons[0].totalPoints.filter(val => val <= 21);
        const playerMax = Math.max(...playerResults);
        //get croupier results
        const croupierResults = currentData.persons[1].totalPoints.filter(val => val <= 21);
        const croupierMax = Math.max(...croupierResults);
        //compare results
        if (playerResults.length === 0) {
            result = 'lost';
        } else {
            if (croupierResults.length) {
                if (playerMax > croupierMax) {
                    result = 'win';
                } else if (playerMax === croupierMax) {
                    result = 'draw';
                } else { result = 'lost'; };
            } else {
                result = 'win';
            }
        };

        updateStatistics(result);
        setupHighscoresEventListener();
    };

    const updateStatistics = (result) => {
        //count won cash
        const baseWin = gameCtrl.countCashWon(result);
        //update total cash
        const newCash = gameCtrl.updateCash(baseWin);
        // Print results
        UICtrl.printNewCash(newCash);
        //show popup
        UICtrl.highscoresPopup(result, currentData.bet);
        UICtrl.togglePopup();
    };

    const croupierTurn = () => {
        curPlayer.changePlayer();
        //set points visible
        UICtrl.toggleDisplayPoints(curPlayer.player[1]);
        // rotate first card
        UICtrl.rotateCroupierCard();

        const playerObj = currentData.persons[curPlayer.playerId];

        ////Old way for croupier points check

        // check if croupier has more than 8 cards or total card points more than 21
        // const loop = () => {
        //     // store the interval id to clear in future
        //     const intr = setInterval(() => {
        //         if (playerObj.allCards.length < currentData.maxCards && playerObj.totalPoints.every(points => points <= currentData.croupierMustPlayPoints)) {
        //             createCard();

        //         } else {
        //             clearInterval(intr);
        //             results();
        //         };
        //     }, 1000)
        // }
        const loop = () => {
            // store the interval id to clear in future
            const intr = setInterval(() => {
                if (playerObj.allCards.length < currentData.maxCards) {
                    if (playerObj.totalPoints.every(points => points <= currentData.croupierMustPlayPoints)) {
                        createCard();

                    } else if (
                        (playerObj.totalPoints.some(points => points > currentData.croupierMustPlayPoints)) && (playerObj.totalPoints.some(points => points <= 21)) && (playerObj.totalPoints.some(points => points <= currentData.croupierMustPlayPoints))) {

                        const playerResults = currentData.persons[0].totalPoints.filter(val => val <= 21);
                        const playerMax = Math.max(...playerResults);
                        //get croupier results
                        const croupierResults = currentData.persons[1].totalPoints.filter(val => val <= 21);
                        const croupierMax = Math.max(...croupierResults);
                        if (croupierMax > playerMax) {
                            clearInterval(intr);
                            results();
                        } else {
                            createCard();
                        }
                    } else {
                        clearInterval(intr);
                        results();
                    }
                } else {
                    clearInterval(intr);
                    results();
                };
            }, 1000)
        }

        loop();
    };

    const standAction = () => {
        removeBtnEventListener();
        croupierTurn();

    };

    const hitAction = () => {
        const playerObj = currentData.persons[curPlayer.playerId];
        createCard();
        // check if player has more than 21 points
        if (playerObj.totalPoints.every(points => points > 21)) {
            curPlayer.changePlayer();
            removeBtnEventListener();
            results();
        } else {
            // check if player has more than 8 cards or total card points more or even: 21
            if (playerObj.allCards.length === currentData.maxCards || playerObj.totalPoints.every(points => points >= 21)) {
                standAction();
            };
        }
    };

    const doubleAction = () => {
        const player = currentData.persons[curPlayer.playerId]
        if (player.allCards.length === 2) {
            ;
            //get current bet
            // change current cash value
            gameCtrl.changeCash();
            //update UI of current cash
            UICtrl.printNewCash(currentData.totalCash);
            //double bet
            gameCtrl.doubleBet();
            //UpdateUI of curren cash
            UICtrl.showBet(currentData.bet);
            //create one card
            createCard();

            if (player.totalPoints.every(points => points > 21)) {
                curPlayer.changePlayer();
                removeBtnEventListener();
                results();
            } else {
                //change player to croupier
                standAction();
            };
        };
    };

    const initPlayers = () => {
        const [player, croupier] = gameCtrl.createPlayers(); //zwraca tablicę z instancjami index 0 player, index 1 croupier
        currentData.persons.push(player);
        currentData.persons.push(croupier);
    };

    const cardRankGenerator = () => {
        const randNum = gameCtrl.getRandomInt(2, 14);
        //pass random card number to generate card rank
        const cardRankParams = gameCtrl.generateCardRank(randNum);
        return cardRankParams;
    };

    const cardSuitGenerator = () => {
        const randNum = gameCtrl.getRandomInt(0, 3);
        const cardSuit = gameCtrl.generateCardSuit(randNum);
        return cardSuit;
    };

    const isUniqueID = (cardID) => {
        return currentData.allCards.every((value) => value !== cardID)
    };

    const useCard = (currentPlayer, figure, color, id, value) => {
        const card = gameCtrl.createCardInstance(figure, color, id, value);
        card.checkAce();
        //add card to Person class
        currentData.persons[currentPlayer].allCards.push(card);
        //add card ID to data storage
        currentData.allCards.push(id);
    };

    const returnCard = (currentPlayer) =>
        currentData.persons[currentPlayer].allCards[
        currentData.persons[currentPlayer].allCards.length - 1
        ];

    const generatePoints = () => {
        // count points
        currentData.persons[curPlayer.playerId].countAces();
        const points = currentData.persons[curPlayer.playerId].countPoints();

        //show them in UI
        UICtrl.showPoints(curPlayer.player[curPlayer.playerId], points);
    };

    const generate2Cards = () => {
        createCard();
        setTimeout(() => {
            createCard();
            curPlayer.changePlayer();
        }, 1000);
    };

    const initCards = () => {
        //add 2 cards to the player
        generate2Cards();
        //display player points
        UICtrl.toggleDisplayPoints(curPlayer.player[0]);
        //add 2 cards to croupier with delay
        setTimeout(generate2Cards, 2000);
        //check if player has blackjack
        setTimeout(isBlackjack, 4000);
    };

    const createCard = () => {
        const playerNum = curPlayer.playerId;
        const playerName = curPlayer.player[curPlayer.playerId];
        //generate random card number
        const [newCardRank, newCardValue] = cardRankGenerator();
        //generate card suit
        const newCardSuit = cardSuitGenerator();
        //Create card ID
        const ID = gameCtrl.createCardID(newCardRank, newCardSuit);
        //check if card is unique
        const uniqueCard = isUniqueID(ID);
        //is card unique?
        if (uniqueCard) {
            useCard(playerNum, newCardRank, newCardSuit, ID, newCardValue);
            const newCard = returnCard(playerNum);
            UICtrl.generateCardUI(playerName, newCard, currentData.persons[playerNum].allCards);
            generatePoints();
        } else {
            createCard();
        };
    };

    const startGame = () => {
        initPlayers();
        initCards();
    };

    const setCash = () => {
        //add startCash to game data
        gameCtrl.setInitCash();
        //add init cash to UI
        UICtrl.initCash(currentData.totalCash);
        // curPlayer.changePlayer();

    };

    const deleteAllDataAndUI = () => {
        // set bet btn colors to active
        UICtrl.changeElementsColors(btnNode);
        //clear data
        gameCtrl.clearAllData();
        //clear UI cards
        UICtrl.removeAllCards(curPlayer.player[0]);
        UICtrl.removeAllCards(curPlayer.player[1]);
        //clear points
        UICtrl.clearPoints();
        //Enable input
        UICtrl.inputToggleDisable();
        //toggle display points
        UICtrl.removeDisplayPoints(curPlayer.player[0]);
        UICtrl.removeDisplayPoints(curPlayer.player[1]);
        //clear input
        UICtrl.clearBetInput();
    };

    const nextGame = () => {
        //hide highscores
        UICtrl.togglePopup();
        //change player
        curPlayer.changePlayer();
        //disable btn UI
        UICtrl.toggleStandAndHitBtns();
        if (currentData.doubleBtnActive) {
            currentData.doubleBtnActive = !currentData.doubleBtnActive;
            UICtrl.toggleDoubleBtn();
        }

        if (currentData.totalCash) {
            //delete all data and UI
            deleteAllDataAndUI();

            //set Points display to none;
            setupBetsEventListeners();
            //remove highscores event listener
            removeHighscoresEventListener();
        } else {
            UICtrl.toggleStartAgainWindow();
        };

    };

    const startApp = () => {
        UICtrl.hideWindow(DOM.popupStartWindow);
        setCash();
        deleteAllDataAndUI();
        setupBetsEventListeners();
    };

    const startAgain = () => {
        UICtrl.hideWindow(DOM.popupPlayAgainWindow);
        setCash();
        deleteAllDataAndUI();
        setupBetsEventListeners();
    };

    document.querySelector(DOM.startBtn).addEventListener('click', startApp);
    document.querySelector(DOM.startAgainBtn).addEventListener('click', startAgain);
};