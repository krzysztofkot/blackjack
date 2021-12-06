// import { gameController } from "./gamectrl";

//TODO check AD cart why it's not rendering!!

export default class Controller {
  constructor(game, UI) {
    this.gameCtrl = new game();
    this.UICtrl = new UI();
    this.currentData = this.gameCtrl.getData();
    this.curPlayer = this.gameCtrl.getPlayer();
    this.DOM = this.UICtrl.getDOMstrings();
    this.btnNode = document.querySelectorAll(this.DOM.dataBet);
    this.acceptBind = this.accept.bind(this);
    this.standActionBind = this.standAction.bind(this);
    this.hitActionBind = this.hitAction.bind(this);
    this.doubleActionBind = this.doubleAction.bind(this);
    this.nextGameBind = this.nextGame.bind(this);

    document
      .querySelector(this.DOM.startBtn)
      .addEventListener("click", this.startApp.bind(this));
    document
      .querySelector(this.DOM.startAgainBtn)
      .addEventListener("click", this.startAgain.bind(this));
  }

  //Setup event listeners for bets
  setupBetsEventListeners() {
    document
      .querySelector(this.DOM.betInput)
      .addEventListener("keyup", this.UICtrl.insertBet);
    document
      .querySelector(this.DOM.betInput)
      .addEventListener("paste", this.UICtrl.preventPaste);
    document
      .querySelector(this.DOM.allInBtn)
      .addEventListener("click", this.UICtrl.addAllIn);
    document
      .querySelector(this.DOM.acceptBtn)
      .addEventListener("click", this.acceptBind);
  }

  //Remove event listeners for bets

  removeBetsEventListener() {
    document
      .querySelector(this.DOM.betInput)
      .removeEventListener("keyup", this.UICtrl.insertBet);
    document
      .querySelector(this.DOM.betInput)
      .removeEventListener("paste", this.UICtrl.preventPaste);
    document
      .querySelector(this.DOM.allInBtn)
      .removeEventListener("click", this.UICtrl.addAllIn);
    document
      .querySelector(this.DOM.acceptBtn)
      .removeEventListener("click", this.acceptBind);
  }

  setupBtnEventListener() {
    document
      .querySelector(this.DOM.standBtn)
      .addEventListener("click", this.standActionBind);
    document
      .querySelector(this.DOM.hitBtn)
      .addEventListener("click", this.hitActionBind);
    this.UICtrl.toggleStandAndHitBtns();
    if (this.currentData.bet <= this.currentData.totalCash) {
      // doubleBtn flag
      this.currentData.doubleBtnActive = !this.currentData.doubleBtnActive;
      this.UICtrl.toggleDoubleBtn();
      document
        .querySelector(this.DOM.doubleBtn)
        .addEventListener("click", this.doubleActionBind);
    }
  }

  removeBtnEventListener() {
    document
      .querySelector(this.DOM.standBtn)
      .removeEventListener("click", this.standActionBind);
    document
      .querySelector(this.DOM.hitBtn)
      .removeEventListener("click", this.hitActionBind);
    if (this.currentData.doubleBtnActive) {
      document
        .querySelector(this.DOM.doubleBtn)
        .removeEventListener("click", this.doubleActionBind);
    }
  }

  setupHighscoresEventListener() {
    document
      .querySelector(this.DOM.highscoresContainer)
      .addEventListener("click", this.nextGameBind);
  }
  removeHighscoresEventListener() {
    document
      .querySelector(this.DOM.highscoresContainer)
      .removeEventListener("click", this.nextGameBind);
  }

  isBlackjack() {
    this.currentData.persons[0].totalPoints.filter((val) => val === 21).length
      ? this.bjResults()
      : this.setupBtnEventListener();
  }

  //accept bet
  accept() {
    //1. get current bet value
    const value = this.UICtrl.returnBet();
    //2. Update bet data
    this.gameCtrl.updateData(value, "bet");

    if (
      this.currentData.bet <= this.currentData.totalCash &&
      this.currentData.bet > 0
    ) {
      //update player total cash
      this.gameCtrl.changeCash();
      this.UICtrl.printNewCash(this.currentData.totalCash);

      //disable bet input
      this.UICtrl.inputToggleDisable();

      //remove bet event listeners
      this.removeBetsEventListener();
      //set bet btn colors to inactive
      this.UICtrl.changeElementsColors(this.btnNode);
      this.startGame();
    } else {
      this.UICtrl.clearBetInput();
    }
  }

  bjResults() {
    let result;
    this.curPlayer.changePlayer();
    this.UICtrl.toggleDisplayPoints(this.curPlayer.player[1]);
    this.UICtrl.rotateCroupierCard();
    this.UICtrl.toggleStandAndHitBtns();

    if (this.currentData.doubleBtnActive) {
      this.currentData.doubleBtnActive = !this.currentData.doubleBtnActive;
      this.UICtrl.toggleDoubleBtn();
    }

    const croupierResult = this.currentData.persons[1].totalPoints.filter(
      (val) => val === 21
    ).length;
    if (croupierResult) {
      result = "draw";
    } else {
      result = "Blackjack";
    }
    this.updateStatistics(result);
    this.setupHighscoresEventListener();
  }

  results() {
    let result;
    //get player results
    const playerResults = this.currentData.persons[0].totalPoints.filter(
      (val) => val <= 21
    );
    const playerMax = Math.max(...playerResults);
    //get croupier results
    const croupierResults = this.currentData.persons[1].totalPoints.filter(
      (val) => val <= 21
    );
    const croupierMax = Math.max(...croupierResults);
    //compare results
    if (playerResults.length === 0) {
      result = "lost";
    } else {
      if (croupierResults.length) {
        if (playerMax > croupierMax) {
          result = "win";
        } else if (playerMax === croupierMax) {
          result = "draw";
        } else {
          result = "lost";
        }
      } else {
        result = "win";
      }
    }
    this.updateStatistics(result);
    this.setupHighscoresEventListener();
  }

  updateStatistics(result) {
    //count won cash
    const baseWin = this.gameCtrl.countCashWon(result);
    //update total cash
    const newCash = this.gameCtrl.updateCash(baseWin);
    // Print results
    this.UICtrl.printNewCash(newCash);
    //show popup
    this.UICtrl.highscoresPopup(result, this.currentData.bet);
    this.UICtrl.togglePopup();
  }

  croupierTurn() {
    this.curPlayer.changePlayer();
    //set points visible
    this.UICtrl.toggleDisplayPoints(this.curPlayer.player[1]);
    // rotate first card
    this.UICtrl.rotateCroupierCard();

    const playerObj = this.currentData.persons[this.curPlayer.playerId];

    ////Old way for croupier points check

    // check if croupier has more than 8 cards or total card points more than 21
    // const loop = () => {
    //     // store the interval id to clear in future
    //     const intr = setInterval(() => {
    //         if (playerObj.allCards.length < this.currentData.maxCards && playerObj.totalPoints.every(points => points <= this.currentData.croupierMustPlayPoints)) {
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
        if (playerObj.allCards.length < this.currentData.maxCards) {
          if (
            playerObj.totalPoints.every(
              (points) => points <= this.currentData.croupierMustPlayPoints
            )
          ) {
            this.createCard();
          } else if (
            playerObj.totalPoints.some(
              (points) => points > this.currentData.croupierMustPlayPoints
            ) &&
            playerObj.totalPoints.some((points) => points <= 21) &&
            playerObj.totalPoints.some(
              (points) => points <= this.currentData.croupierMustPlayPoints
            )
          ) {
            const playerResults =
              this.currentData.persons[0].totalPoints.filter(
                (val) => val <= 21
              );
            const playerMax = Math.max(...playerResults);
            //get croupier results
            const croupierResults =
              this.currentData.persons[1].totalPoints.filter(
                (val) => val <= 21
              );
            const croupierMax = Math.max(...croupierResults);
            if (croupierMax > playerMax) {
              clearInterval(intr);
              this.results();
            } else {
              this.createCard();
            }
          } else {
            clearInterval(intr);
            this.results();
          }
        } else {
          clearInterval(intr);
          this.results();
        }
      }, 1000);
    };

    loop();
  }

  standAction() {
    this.removeBtnEventListener();
    this.croupierTurn();
  }

  hitAction() {
    const playerObj = this.currentData.persons[this.curPlayer.playerId];
    this.createCard();
    // check if player has more than 21 points
    if (playerObj.totalPoints.every((points) => points > 21)) {
      this.curPlayer.changePlayer();
      this.removeBtnEventListener();
      this.results();
    } else {
      // check if player has more than 8 cards or total card points more or even: 21
      if (
        playerObj.allCards.length === this.currentData.maxCards ||
        playerObj.totalPoints.every((points) => points >= 21)
      ) {
        this.standAction();
      }
    }
  }

  doubleAction() {
    const player = this.currentData.persons[this.curPlayer.playerId];
    if (player.allCards.length === 2) {
      //get current bet
      // change current cash value
      this.gameCtrl.changeCash();
      //update UI of current cash
      this.UICtrl.printNewCash(this.currentData.totalCash);
      //double bet
      this.gameCtrl.doubleBet();
      //UpdateUI of curren cash
      this.UICtrl.showBet(this.currentData.bet);
      //create one card
      this.createCard();

      if (player.totalPoints.every((points) => points > 21)) {
        this.curPlayer.changePlayer();
        this.removeBtnEventListener();
        results();
      } else {
        //change player to croupier
        this.standAction();
      }
    }
  }

  initPlayers() {
    const [player, croupier] = this.gameCtrl.createPlayers(); //zwraca tablicę z instancjami index 0 player, index 1 croupier
    this.currentData.persons.push(player);
    this.currentData.persons.push(croupier);
  }

  cardRankGenerator() {
    const randNum = this.gameCtrl.getRandomInt(2, 14);
    //pass random card number to generate card rank
    const cardRankParams = this.gameCtrl.generateCardRank(randNum);
    return cardRankParams;
  }

  cardSuitGenerator() {
    const randNum = this.gameCtrl.getRandomInt(0, 3);
    const cardSuit = this.gameCtrl.generateCardSuit(randNum);
    return cardSuit;
  }

  isUniqueID(cardID) {
    return this.currentData.allCards.every((value) => value !== cardID);
  }

  useCard(currentPlayer, figure, color, id, value) {
    const card = this.gameCtrl.createCardInstance(figure, color, id, value);
    card.checkAce();
    //add card to Person class
    this.currentData.persons[currentPlayer].allCards.push(card);
    //add card ID to data storage
    this.currentData.allCards.push(id);
  }

  returnCard(currentPlayer) {
    return this.currentData.persons[currentPlayer].allCards[
      this.currentData.persons[currentPlayer].allCards.length - 1
    ];
  }

  generatePoints() {
    // count points
    this.currentData.persons[this.curPlayer.playerId].countAces();
    const points =
      this.currentData.persons[this.curPlayer.playerId].countPoints();

    //show them in UI
    this.UICtrl.showPoints(
      this.curPlayer.player[this.curPlayer.playerId],
      points
    );
  }

  generate2Cards() {
    this.createCard();
    setTimeout(() => {
      this.createCard();
      this.curPlayer.changePlayer();
    }, 1000);
  }

  //TODO Sprawdzic this w timeout!! problem z this. zle jest przekazywany w liniejce 391 i 393

  initCards() {
    //add 2 cards to the player
    this.generate2Cards();
    //display player points
    this.UICtrl.toggleDisplayPoints(this.curPlayer.player[0]);
    //add 2 cards to croupier with delay
    setTimeout(this.generate2Cards.bind(this), 2000);
    //check if player has blackjack
    setTimeout(this.isBlackjack.bind(this), 4000);
  }

  createCard() {
    const playerNum = this.curPlayer.playerId;
    const playerName = this.curPlayer.player[this.curPlayer.playerId];
    //generate random card number
    const [newCardRank, newCardValue] = this.cardRankGenerator();
    //generate card suit
    const newCardSuit = this.cardSuitGenerator();
    //Create card ID
    const ID = this.gameCtrl.createCardID(newCardRank, newCardSuit);
    //check if card is unique
    const uniqueCard = this.isUniqueID(ID);
    //is card unique?
    if (uniqueCard) {
      this.useCard(playerNum, newCardRank, newCardSuit, ID, newCardValue);
      const newCard = this.returnCard(playerNum);
      this.UICtrl.generateCardUI(
        playerName,
        newCard,
        this.currentData.persons[playerNum].allCards
      );
      this.generatePoints();
    } else {
      this.createCard();
    }
  }

  startGame() {
    this.initPlayers();
    this.initCards();
  }

  setCash() {
    //add startCash to game data
    this.gameCtrl.setInitCash();
    //add init cash to UI
    this.UICtrl.initCash(this.currentData.totalCash);
    // this.curPlayer.changePlayer();
  }

  deleteAllDataAndUI() {
    // set bet btn colors to active
    this.UICtrl.changeElementsColors(this.btnNode);
    //clear data
    this.gameCtrl.clearAllData();
    //clear UI cards
    this.UICtrl.removeAllCards(this.curPlayer.player[0]);
    this.UICtrl.removeAllCards(this.curPlayer.player[1]);
    //clear points
    this.UICtrl.clearPoints();
    //Enable input
    this.UICtrl.inputToggleDisable();
    //toggle display points
    this.UICtrl.removeDisplayPoints(this.curPlayer.player[0]);
    this.UICtrl.removeDisplayPoints(this.curPlayer.player[1]);
    //clear input
    this.UICtrl.clearBetInput();
  }

  nextGame() {
    //hide highscores
    this.UICtrl.togglePopup();
    //change player
    this.curPlayer.changePlayer();
    //disable btn UI
    this.UICtrl.toggleStandAndHitBtns();
    if (this.currentData.doubleBtnActive) {
      this.currentData.doubleBtnActive = !this.currentData.doubleBtnActive;
      this.UICtrl.toggleDoubleBtn();
    }

    if (this.currentData.totalCash) {
      //delete all data and UI
      this.deleteAllDataAndUI();

      //set Points display to none;
      this.setupBetsEventListeners();
      //remove highscores event listener
      this.removeHighscoresEventListener();
    } else {
      this.UICtrl.toggleStartAgainWindow();
    }
  }

  startApp() {
    this.UICtrl.hideWindow(this.DOM.popupStartWindow);
    this.setCash();
    this.deleteAllDataAndUI();
    this.setupBetsEventListeners();
  }

  startAgain() {
    this.UICtrl.hideWindow(this.DOM.popupPlayAgainWindow);
    this.setCash();
    this.deleteAllDataAndUI();
    this.setupBetsEventListeners();
  }
}
