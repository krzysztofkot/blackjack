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

    const setBtnEventListener = () => {
        console.log('enable btn event listeners')
        document.querySelector(DOM.standBtn).addEventListener('click', standAction);
        document.querySelector(DOM.hitBtn).addEventListener('click', hitAction);
        if (currentData.bet <= currentData.totalCash) {
            document.querySelector(DOM.doubleBtn).addEventListener('click', doubleAction);
        }
    }

    //accept bet
    const accept = () => {
        //1. get current bet value
        const value = UICtrl.returnBet();
        //2. Update bet data
        gameCtrl.updateData(value, "bet");

        if (currentData.bet <= currentData.totalCash && currentData.bet > 0) {
            //update player total cash
            gameCtrl.changeCash();
            const updatedData = gameCtrl.getData();
            UICtrl.printNewCash(updatedData.totalCash);

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

    const standAction = () => {
        console.log('click stand');

    };

    const hitAction = () => {
        const player = currentData.persons[curPlayer.currentPlayer];
        console.log(curPlayer.player)
        console.log(currentData.persons[curPlayer.currentPlayer])
        console.log('max kart:' + currentData.maxCards)
        if (player.allCards.length >= currentData.maxCards) {
            console.log('przekroczono 8 kart')
        } else {
            createCard();
        }
        console.log('click hit');
    };

    const doubleAction = () => {
        console.log('click double');
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
        console.log(card.value, card.id)
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

    const initCards = () => {
        //add 2 cards to player
        // console.log(activePlayer);
        console.log('karta nr 1 dla player')
        createCard();
        console.log('karta nr 2 dla player')
        createCard();
        //change to croupier
        curPlayer.changePlayer();
        //add 2 cards to croupier
        console.log('karta nr 1 dla krupier')
        createCard();
        console.log('karta nr 2 dla krupier')
        createCard();
        setBtnEventListener();


        // change to player
        curPlayer.changePlayer();
        console.log(curPlayer.player[curPlayer.currentPlayer]);

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
        uniqueCard
            ? useCard(playerNum, newCardRank, newCardSuit, ID, newCardValue)
            : createCard();
        const newCard = returnCard(playerNum);
        UICtrl.generateCardUI(playerName, newCard);
        generatePoints();
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
