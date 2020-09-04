//game controller
const gameController = (function () {
    //primary settings
    const startCash = 1000;
    totalCards = 8;
    croupierMustPlayPoints = 16;
    // players = [0, 1];

    const card = {
        id: 'AA'
    };

    const data = {
        totalCash: startCash,
        bet: 0,
        allCards: [card],
    };

    class Card {
        constructor(figure, color, id, value) {
            this.figure = figure;
            this.color = color;
            this.id = id;
            this.value = value;
        }

        checkAce() {
            if (this.figure === "Ace") {
                return (this.isAce = true);
            }
        }
    }

    class Player {
        constructor(name) {
            this.name = name;
            this.allCards = [];
            this.totalPoints; // wymysleć jak to ma działać!! Ma sumować punkty kart z allCards
        }
    };

    return {
        updateData: (value, type) => (data[type] = parseInt(value)),

        getData: () => data,

        changeCash: () => (data.totalCash -= data.bet),

        createPlayers: () => {
            const person = new Player("person");
            const croupier = new Player("croupier");
        },

        getRandomInt: (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        generateCardRank: (num) => {
            const cardData = [];
            if (num <= 10) {
                cardData.push(num.toString());
                cardData.push(num);
            } else {
                switch (num) {
                    case 11:
                        cardData.push('Jack');
                        cardData.push(10);
                        break;
                    case 12:
                        cardData.push('Queen');
                        cardData.push(10);
                        break;
                    case 13:
                        cardData.push('King');
                        cardData.push(10);
                        break;
                    case 14:
                        cardData.push('Ace');
                        cardData.push(11);
                        break;
                }
            };
            return cardData;
        },

        generateCardSuit: (num) => {
            const arrOfSuits = ['Spades', 'Hearts', 'Diamonds', 'Clubs']
            return arrOfSuits[num];
        },

        createCardID: (cardRank, cardSuit) => cardRank.substring(0, 1).concat(cardSuit.substring(0, 1)),
    };

})();

//UI controller

const UIController = (function () {
    const DOMstrings = {
        betInput: ".bets__value--input",
        totalCash: ".bets__value",
        acceptBtn: ".bets__btn--accept",
        allInBtn: ".bets__btn--all-in",
    };
    const DOMselectors = {
        betInput: document.querySelector(DOMstrings.betInput),
        totalCash: document.querySelector(DOMstrings.totalCash),
        acceptBtn: document.querySelector(DOMstrings.acceptBtn),
        allInBtn: document.querySelector(DOMstrings.allInBtn),
    };

    return {
        insertBet: (e) => {
            const val = e.target.value;
            const len = val.length;

            if (val.includes(".") || val.includes(" ") || isNaN(val)) {
                const newVal = val.slice(0, len - 1);
                e.target.value = newVal; // poprawić aby wyświetlalo '' jesli NaN ===true
            }
        },

        returnBet: () => DOMselectors.betInput.value,

        preventPaste: (e) => {
            console.log("wklejanie!");
            e.preventDefault();
        },

        addAllIn: () => {
            const retriveCash = DOMselectors.totalCash.innerText;
            DOMselectors.betInput.value = retriveCash;
        },

        printNewCash: (updateCash) =>
            (DOMselectors.totalCash.innerText = updateCash),

        inputToggleDisable: () => {
            DOMselectors.betInput.disabled === true ?
                (DOMselectors.betInput.disabled = false) :
                (DOMselectors.betInput.disabled = true);
        },

        clearBetInput: () => {
            DOMselectors.betInput.value = "";
            DOMselectors.betInput.focus();
        },

        getDOMstrings: () => DOMstrings,
    };
})();

//app controller

const controller = (function (gameCtrl, UICtrl) {
    const DOM = UICtrl.getDOMstrings();
    const currentData = gameCtrl.getData();

    //Setup event listeners for bets
    const setupBetsEventListeners = () => {
        document.querySelector(DOM.betInput).addEventListener("keyup", UICtrl.insertBet);
        document.querySelector(DOM.betInput).addEventListener("paste", UICtrl.preventPaste);
        document.querySelector(DOM.allInBtn).addEventListener("click", UICtrl.addAllIn);
        document.querySelector(DOM.acceptBtn).addEventListener("click", accept);
    };

    //Remove event listeners for bets

    const removeBetsEventListener = () => {
        document.querySelector(DOM.betInput).removeEventListener("keyup", UICtrl.insertBet);
        document.querySelector(DOM.betInput).removeEventListener("paste", UICtrl.preventPaste);
        document.querySelector(DOM.allInBtn).removeEventListener("click", UICtrl.addAllIn);
        document.querySelector(DOM.acceptBtn).removeEventListener("click", accept);
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

    const cardRankGenerator = () => {
        const randNum = gameCtrl.getRandomInt(2, 14);
        console.log(`wygenerowany nr: ${randNum}`);
        //pass random card number to generate card rank
        const cardRankParams = gameCtrl.generateCardRank(randNum);
        console.log(cardRankParams);
        return cardRankParams;

    };

    const cardSuitGenerator = () => {
        const randNum = gameCtrl.getRandomInt(0, 3);
        const cardSuit = gameCtrl.generateCardSuit(randNum);
        console.log(`wygenerowany kolor karty to: ${cardSuit}`);
        return cardSuit;
    };

    const isUniqueID = (cardID) => {
        console.log('inside isUniqueID fn')
        console.log(currentData.allCards)
        if (currentData.allCards.some(value => value.id === cardID)) {
            createCard();
        } else {
            //stworzyć instancję karty oraz pushnąć ja do odpowiedniego miejsca !!
        }
    };
    // WAŻNE!! dodać, ze pierwsza osoba, to Player bo teraz nikt nie jest wybierany i nie dopisze sie do odpowiedniej instancji karty


    const createCard = () => {
        console.log("creating card");

        //generate random card number
        const [newCardRank, newcardValue] = cardRankGenerator();
        //generate card suit
        const newCardSuit = cardSuitGenerator();
        //Create card ID
        const ID = gameCtrl.createCardID(newCardRank, newCardSuit);
        console.log(ID);
        //check if card is unique
        isUniqueID('AA');
    };

    const startGame = () => {
        console.log("game has started");
        gameCtrl.createPlayers();
        createCard(); //dodać argument
    };

    setupBetsEventListeners();
})(gameController, UIController);