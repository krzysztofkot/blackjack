//game controller
const startCash = 1000;
const totalCards = 8;
const croupierMustPlayPoints = 16;

const activePlayer = {
    currentPlayer: 0,
    player: ["player", "croupier"], //for changing current player

    changePlayer() {
        this.currentPlayer === 0
            ? (this.currentPlayer = 1)
            : (this.currentPlayer = 0);
    },
};

const data = {
    totalCash: startCash,
    bet: 0,
    allCards: [],
    persons: [],
};

class Card {
    constructor(figure, color, id, value) {
        this.figure = figure;
        this.color = color;
        this.id = id;
        this.value = value;
    }

    checkAce() {
        this.figure === "Ace" ? (this.isAce = true) : (this.isAce = false);
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.allCards = [];
        this.totalPoints = 0; // wymysleć jak to ma działać!! Ma sumować punkty kart z allCards
        this.totalPoints2 = 0; // dodać tu wersje z asami tylko jak to zrobić.
        this.totalAces = 0;
    };

    countPoints() {
        console.log(this);
        this.totalPoints = this.allCards.reduce((prev, cur) => prev.value += cur.value);
        console.log(this.totalPoints);
        return this.totalPoints;
    };

    countAces() {
        const acesArr = this.allCards.filter((value) => value.isAce === true);
        console.log(acesArr.length);
        this.totalAces = acesArr.length;
    };
}

export const gameController = {
    updateData: (value, type) => (data[type] = parseInt(value)),

    getData: () => data,

    getPlayer: () => activePlayer,

    changeCash: () => (data.totalCash -= data.bet),

    createPlayers: () => {
        const person = new Player("player");
        const croupier = new Player("croupier");
        return [person, croupier];
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
                    cardData.push("Jack");
                    cardData.push(10);
                    break;
                case 12:
                    cardData.push("Queen");
                    cardData.push(10);
                    break;
                case 13:
                    cardData.push("King");
                    cardData.push(10);
                    break;
                case 14:
                    cardData.push("Ace");
                    cardData.push(11);
                    break;
            }
        }
        return cardData;
    },

    generateCardSuit: (num) => {
        const arrOfSuits = ["Spades", "Hearts", "Diamonds", "Clubs"];
        return arrOfSuits[num];
    },

    createCardID: (cardRank, cardSuit) =>
        cardRank.substring(0, 1).concat(cardSuit.substring(0, 1)),

    createCardInstance: (figure, color, id, value) =>
        new Card(figure, color, id, value),
};
