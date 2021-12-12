/// <reference types="cypress" />

Cypress.Commands.add("ClosePopup", function () {
  cy.window().its("app").invoke("startApp");
});

Cypress.Commands.add("setBetAA", (val) => {
  cy.window().its("app").invoke(`gameCtrl.updateData`, val, "bet");
  cy.window().its("app").invoke(`gameCtrl.changeCash`);
  cy.window().then(({ app }) => {
    app.UICtrl.printNewCash(app.currentData.totalCash);
    app.UICtrl.inputToggleDisable();
    app.removeBetsEventListener();
    app.UICtrl.changeElementsColors(app.btnNode);
    app.initPlayers();
  });
});

Cypress.Commands.add("checkCroupierCards", () => {
  cy.window().its("app").invoke("curPlayer.changePlayer");
  cy.window().its("app").invoke("croupierTurn");
});

Cypress.Commands.add("createCard", (id) => {
  let cardSuit, value, cardRank;
  let [num, firstLetter] = id.split("");

  switch (firstLetter) {
    case "H":
      cardSuit = "Hearts";
      break;
    case "C":
      cardSuit = "Clubs";
      break;
    case "D":
      cardSuit = "Diamonds";
      break;
    case "S":
      cardSuit = "Spades";
      break;
  }

  switch (num) {
    case "D":
      value = 1;
      cardRank = "Deuce";
      break;
    case "J":
      value = 10;
      cardRank = "Jack";
      break;
    case "Q":
      value = 10;
      cardRank = "Queen";
      break;
    case "K":
      value = 10;
      cardRank = "King";
      break;
    case "1":
      value = 10;
      cardRank = num;
      break;
    default:
      value = Number(num);
      cardRank = num;
      break;
  }
  return { cardRank, cardSuit, id, value };
});

Cypress.Commands.add("showPoints", (player) => {
  cy.window().its("app").invoke("UICtrl.toggleDisplayPoints", player);
});

Cypress.Commands.add("switchPlayers", () => {
  cy.window().its("app").invoke("curPlayer.changePlayer");
});

Cypress.Commands.add("ShowCroupierCard", () => {
  cy.window().its("app").invoke("UICtrl.rotateCroupierCard");
});

Cypress.Commands.add("results", () => {
  cy.window().its("app").invoke("results");
});

Cypress.Commands.add("addCard", (player, ID) => {
  const players = ["player", "croupier"];
  cy.createCard(ID).then(($card) => {
    const { cardRank, cardSuit, id, value } = $card;
    cy.window().then(({ app }) => {
      const index = players.indexOf(player);
      app.useCard(index, cardRank, cardSuit, id, value);
      app.UICtrl.generateCardUI(
        player,
        app.returnCard(index),
        app.currentData.persons[index].allCards
      );
      app.generatePoints();
    });
  });
  cy.window()
    .its("app.currentData.persons")
    .then(($val) => {});
});

Cypress.Commands.add("blackjack", () => {
  cy.window().its("app").invoke("isBlackjack");
});

Cypress.Commands.add("showBet", (val) => {
  cy.window().its("app").invoke("UICtrl.showBet", val);
});
