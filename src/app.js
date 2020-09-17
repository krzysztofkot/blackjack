import { gameController } from './js/gamectrl';
import { UIController } from './js/uictrl';
import scss from './sass/main.scss';

const controller = (gameCtrl, UICtrl) => {
    const DOM = UICtrl.getDOMstrings();
    const currentData = gameCtrl.getData();
    const curPlayer = gameCtrl.getPlayer();

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
        if (currentData.bet <= currentData.totalCash) {
            document.querySelector(DOM.doubleBtn).addEventListener('click', doubleAction);
        }
    };

    const removeBtnEventListener = () => {

        document.querySelector(DOM.standBtn).removeEventListener('click', standAction);
        document.querySelector(DOM.hitBtn).removeEventListener('click', hitAction);
        document.querySelector(DOM.doubleBtn).removeEventListener('click', doubleAction);
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
            // const updatedData = gameCtrl.getData();
            UICtrl.printNewCash(currentData.totalCash);

            //disable bet input
            UICtrl.inputToggleDisable();
            ////////////////////TODO change bets component color to grey /////////////////////////////////////////

            //remove bet event listeners
            removeBetsEventListener();
            startGame();
        } else {
            UICtrl.clearBetInput();
        }
    };

    const bjResults = () => {
        const playerResult = currentData.persons[0].totalPoints.filter(val => val === 21).length;
        const croupierResult = currentData.persons[1].totalPoints.filter(val => val === 21).length;
        if (playerResult !== croupierResult) {
            updateStatistics('bjWin');
        } else {
            updateStatistics('draw');
        }
    };

    const results = () => {

        //get player results
        const playerResults = currentData.persons[0].totalPoints.filter(val => val <= 21);
        const playerMax = Math.max(...playerResults);
        //get croupier results
        const croupierResults = currentData.persons[1].totalPoints.filter(val => val <= 21);
        const croupierMax = Math.max(...croupierResults);
        //compare results
        // if (currentData.persons[0].totalPoints)
        if (!playerResults.length) {
            updateStatistics('lost');
        } else {
            if (croupierResults.length) {
                if (playerMax > croupierMax) {
                    updateStatistics('normalWin');
                } else if (playerMax === croupierMax) {
                    updateStatistics('draw')
                } else { updateStatistics('lost') };
            } else {
                updateStatistics('normalWin');
            }
        };
    };

    const updateStatistics = (result) => {
        //open div with results
        let baseWin;
        switch (result) {
            case 'draw':
                baseWin = 1;
                break;
            case 'normalWin':
                baseWin = 2;
                break;
            case 'bjWin':
                baseWin = 3;
                break;
            case 'lost':
                baseWin = 0;
        }
        const newCash = gameCtrl.updateCash(baseWin);
        // Print results
        UICtrl.printNewCash(newCash);
        //change data
    };

    const croupierTurn = () => {
        removeBtnEventListener();
        curPlayer.changePlayer();
        const player = currentData.persons[curPlayer.currentPlayer];
        // rotate first card
        //set points visible
        // check if croupier has more than 8 cards or total card points more than 21

        const loop = () => {
            // store the interval id to clear in future
            const intr = setInterval(() => {
                if (player.allCards.length < currentData.maxCards && player.totalPoints.some(points => points <= currentData.croupierMustPlayPoints)) {
                    createCard();

                } else {
                    clearInterval(intr);
                    results();
                };
            }, 1000)
        }
        loop();
    };

    const standAction = () => {
        croupierTurn();

    };

    const hitAction = () => {
        const player = currentData.persons[curPlayer.currentPlayer];
        createCard();
        // check if player has more than 21 points
        if (player.totalPoints.every(points => points > 21)) {
            results();
        } else {
            // check if player has more than 8 cards or total card points more or even: 21
            if (player.allCards.length === currentData.maxCards || player.totalPoints.every(points => points >= 21)) {
                croupierTurn();
            };
        }

    };

    const doubleAction = () => {
        const player = currentData.persons[curPlayer.currentPlayer];
        //get current bet
        const value = UICtrl.returnBet();
        // change current cash value
        gameCtrl.changeCash();
        //update UI of current cash
        UICtrl.printNewCash(currentData.totalCash);
        //update bet data
        gameCtrl.updateData(value, "bet");
        //update bet UI
        UICtrl.updateBet(currentData.bet);
        //create one card
        createCard();
        if (player.totalPoints.every(points => points > 21)) {
            results();
        } else {
            //change player to croupier
            croupierTurn();
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
    }
    // currentData.allCards.every((value) => value !== cardID);

    const useCard = (currentPlayer, figure, color, id, value) => {
        const card = gameCtrl.createCardInstance(figure, color, id, value);
        card.checkAce();
        // console.log(card.value, card.id)
        //add card to Person class
        currentData.persons[currentPlayer].allCards.push(card);
        // console.log(currentData.persons[currentPlayer].allCards)
        //add card ID to data storage
        currentData.allCards.push(id);
    };

    const returnCard = (currentPlayer) =>
        currentData.persons[currentPlayer].allCards[
        currentData.persons[currentPlayer].allCards.length - 1
        ];

    const generatePoints = () => {
        // count points
        currentData.persons[curPlayer.currentPlayer].countAces(); //tylko tymczasowo, pomysleć gdzie to uzyc!
        const points = currentData.persons[curPlayer.currentPlayer].countPoints();


        //show them in UI
        UICtrl.showPoints(curPlayer.player[curPlayer.currentPlayer], points);
    };

    const generate2Cards = () => {
        createCard();
        setTimeout(() => {
            createCard();
            curPlayer.changePlayer();
        }, 500);
    };

    const initCards = () => {
        //add 2 cards to the player
        generate2Cards();
        //add 2 cards to croupier with delay
        setTimeout(generate2Cards, 1000);
        //check if player has blackjack
        setTimeout(isBlackjack, 2000);
    };

    const createCard = () => {
        const playerNum = curPlayer.currentPlayer;
        const playerName = curPlayer.player[curPlayer.currentPlayer];
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
            UICtrl.generateCardUI(playerName, newCard);
            generatePoints();
        } else {
            createCard();
        };
    };

    const startGame = () => {
        initPlayers();
        initCards();
    };

    setupBetsEventListeners();
};
controller(gameController, UIController);

//TODO sprawdzić, czemu rozjezdza się talia kart jak nie ma zadnych kart- na początku jest niżej a dopiero póżniej idzie na swoje miejsce

// TODO naprawić funckję opóżniającą tworzenie kart

//TODO dodać kolory gdy nieaktywne są poszczególne pola!!
