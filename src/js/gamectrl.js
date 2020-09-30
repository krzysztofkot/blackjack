//game controller
const startCash = 1000;

const activePlayer = {
    playerId: 0,
    player: ["player", "croupier"], //for changing current player

    changePlayer() {
        this.playerId === 0 ? (this.playerId = 1) : (this.playerId = 0);
    },
};

const data = {
    totalCash: 0,
    bet: 0,
    allCards: [],
    persons: [],
    maxCards: 8,
    croupierMustPlayPoints: 16,
    doubleBtnActive: false
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
        this.totalPoints = [];
        this.totalAces = 0;
    };

    countPoints() {
        let total = 0;
        for (const values of this.allCards) {
            total += values.value;
        }
        this.totalPoints[0] = total;
        if (this.totalAces) {
            this.totalPoints[1] = total + 10;
        }
        return this.totalPoints;
    };

    countAces() {
        const acesArr = this.allCards.filter((value) => value.isAce === true);
        this.totalAces = acesArr.length;
    };
}

export const gameController = {
    updateData: (value, type) => (data[type] = parseInt(value)),

    setInitCash: () => data.totalCash = startCash,

    getData: () => data,

    getStartCash: () => startCash,

    getPlayer: () => activePlayer,

    changeCash: () => data.totalCash -= data.bet,

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
                    cardData.push(1);
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

    doubleBet: () => {
        data.bet *= 2;
    },

    countCashWon: (result) => {
        let baseWin;
        switch (result) {
            case 'draw':
                baseWin = 1;
                break;
            case 'win':
                baseWin = 2;
                break;
            case 'Blackjack':
                baseWin = 3;
                break;
            case 'lost':
                baseWin = 0;
        }
        return baseWin;
    },

    updateCash: (multiplier) => data.totalCash += multiplier * data.bet,

    clearAllData: () => {
        data.allCards = [];
        data.bet = 0;
        data.persons = [];
    }
};
