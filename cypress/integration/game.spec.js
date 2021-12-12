/// <reference types="cypress" />

describe("Test form component", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.closeStartGamePopup();
  });

  it("Should not pass empty input", () => {
    cy.setBet();
    cy.assertInputNotDisabled();
  });

  it("Should not accept Not a number values", () => {
    cy.setBet("NaN");
    cy.assertInputNotDisabled();
  });

  it("Should not accept bigger values than current cash", () => {
    cy.get(".bets__value").then(($val) => {
      let val = parseInt($val.val());
      val++;
      cy.setBet(val);
      cy.assertInputNotDisabled();
    });
  });

  it("Should not accept float numbers", () => {
    cy.get(".bets__value--input")
      .type("100.5")
      .then(($val) => {
        const val = parseFloat($val.val());
        expect(Number.isInteger(val)).to.be.true;
      });
  });

  it("All in button should pass all cash as bet", () => {
    cy.get("span.bets__value")
      .as("cash")
      .then(($val) => {
        const val = $val.text();
        cy.setBet(val);
        cy.get("@cash").then(($val) => {
          const val = parseInt($val.text());
          expect(val).to.equal(0);
        });
      });
  });
});

describe("Test hint popup", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".rules__container").as("rules");
    cy.get(".rules__btn").as("hintBtn");
  });

  it("Hints should be opened and closed", () => {
    cy.get("@hintBtn").should("be.visible");
    cy.get("@hintBtn").click();
    cy.get("@rules").should("be.visible");
    cy.get("@hintBtn").click();
  });
});

describe("Test game functionalities", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".action__btn--double").as("db");
    cy.get(".action__btn--hit").as("hit");
    cy.get(".action__btn--stand").as("stand");

    cy.closeStartGamePopup();

    cy.setBet(500);
    cy.wait(4000);
    cy.blackjackOnStart();
  });

  it("Should draw extra card when clicked hit button", () => {
    cy.assertCardsQty("player", 2);
    cy.assertCardsQty("croupier", 2);
    cy.get("#croupier-cards .card--2")
      .not(".card--rotated")
      .children()
      .first()
      .should("not.be.visible");
    cy.get("@hit").click();
    cy.assertCardsQty("player", 3);
  });

  it("Player should not be able to get next card, when clicked stand button", () => {
    cy.get("#player-cards")
      .children()
      .then(($cards) => {
        cy.get("@stand").click();
        cy.get("@hit").click();
        cy.get("#player-cards")
          .children()
          .then(($nextCards) => {
            // const nextCards= Array.from($nextCards);
            expect($cards.length).to.be.equal($nextCards.length);
          });
      });
  });

  it("When player choose double, then his bet should be doubled, and then only get 1 card extra ", () => {
    cy.get("@db").should("not.satisfy", ($el) => {
      const [el] = Array.from($el);
      return el.classList.contains("u-btn--active");
    });
    cy.get(".bets__value--input")
      .as("input")
      .then(($value) => {
        let value = parseInt($value.val());
        cy.get("@db").click();
        cy.get("@input").then(($newVal) => {
          const newVal = parseInt($newVal.val());
          expect(newVal).to.be.equal(value * 2);
        });
      });
    cy.get("#player-cards").children().should("have.length", 3);
  });

  it("Points should match displayed cards", () => {
    cy.get("@stand").click();
    cy.get(".highscores", { timeout: 6000 }).should("be.visible");
    cy.CheckPoints("player");
    cy.CheckPoints("croupier");
  });
});

describe("Setting app state", () => {
  const betValue = 1000;
  const startValue = 1000;
  beforeEach(() => {
    cy.visit("/");
    cy.ClosePopup();
    cy.setBetAA(betValue);
    cy.showBet(betValue);
    cy.showPoints("player");
  });

  it("Player should loose bet", () => {
    cy.addCard("player", "8C");
    cy.addCard("player", "1D");
    cy.switchPlayers();
    cy.showPoints("croupier");
    cy.addCard("croupier", "3H");
    cy.addCard("croupier", "9H");
    cy.addCard("croupier", "8S");
    cy.ShowCroupierCard();
    cy.wait(500);
    cy.results();
    cy.CheckPoints("player");
    cy.CheckPoints("croupier");
    cy.comparePoints("lost");
    cy.checkEndGamePopup("lost", betValue);
    cy.checkCurrentCash("lost", betValue, startValue);
    cy.closeHighscoresPopup();
    cy.startAgainPopup();
  });

  it("Player should have blackjack from start", () => {
    cy.addCard("player", "DC");
    cy.addCard("player", "1D");
    cy.switchPlayers();
    cy.showPoints("croupier");
    cy.addCard("croupier", "3H");
    cy.addCard("croupier", "9H");
    cy.ShowCroupierCard();
    cy.blackjack();
    cy.wait(500);
    cy.checkEndGamePopup("blackjack", betValue);
    cy.checkCurrentCash("blackjack", betValue, startValue);
  });

  it("There should be draw in game", () => {
    cy.addCard("player", "5D");
    cy.addCard("player", "8H");
    cy.addCard("player", "6C");
    cy.switchPlayers();
    cy.showPoints("croupier");
    cy.addCard("croupier", "2H");
    cy.addCard("croupier", "9H");
    cy.addCard("croupier", "8S");
    cy.ShowCroupierCard();
    cy.wait(500);
    cy.results();
    cy.CheckPoints("player");
    cy.CheckPoints("croupier");
    cy.comparePoints("draw");
    cy.checkEndGamePopup("draw", betValue);
    cy.checkCurrentCash("draw", betValue, startValue);
  });

  it("Player should win", () => {
    cy.addCard("player", "5D");
    cy.addCard("player", "8H");
    cy.addCard("player", "7C");
    cy.switchPlayers();
    cy.showPoints("croupier");
    cy.addCard("croupier", "2H");
    cy.addCard("croupier", "9H");
    cy.addCard("croupier", "8S");
    cy.ShowCroupierCard();
    cy.wait(500);
    cy.results();
    cy.CheckPoints("player");
    cy.CheckPoints("croupier");
    cy.comparePoints("win");
    cy.checkEndGamePopup("win", betValue);
    cy.checkCurrentCash("win", betValue, startValue);
  });

  it("Croupier should draw card, when have less than 17 points", () => {
    cy.addCard("player", "8C");
    cy.addCard("player", "1D");
    cy.switchPlayers();
    cy.addCard("croupier", "4S");
    cy.addCard("croupier", "9H");
    cy.assertCardsQty("croupier", 2);
    cy.checkPointsFromCard("croupier").then(($points) => {
      expect($points).to.be.below(17);
    });
    cy.wait(700);
    cy.checkCroupierCards();
    cy.assertCardsQty("croupier", 2, true);
  });

  it("Croupier should not draw card, when have at least 17 points", () => {
    cy.addCard("player", "8C");
    cy.addCard("player", "1D");
    cy.switchPlayers();
    cy.addCard("croupier", "9S");
    cy.addCard("croupier", "9H");
    cy.assertCardsQty("croupier", 2);
    cy.checkPointsFromCard("croupier").then(($points) => {
      expect($points).to.be.above(16);
    });
    cy.wait(700);
    cy.checkCroupierCards();
    cy.assertCardsQty("croupier", 2);
  });
});
