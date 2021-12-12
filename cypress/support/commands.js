// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="cypress" />

Cypress.Commands.add("closeStartGamePopup", () => {
  cy.get('[data-btn="start"]').click();
});

Cypress.Commands.add("setBet", (bet = "") => {
  if (!bet) cy.get(".bets__btn--accept").click();
  else {
    cy.get(".bets__value--input").type(bet);
    cy.get(".bets__btn--accept").click();
  }
});

Cypress.Commands.add("assertInputNotDisabled", () => {
  cy.get(".bets__btn--accept").should("not.be.disabled");
});

Cypress.Commands.add("accessToApp", () => {
  cy.window().then(({ app }) => {
    console.log(app);
  });
});

Cypress.Commands.add("blackjackOnStart", () => {
  cy.get(`.points__player`)
    .children()
    .then(($el) => {
      const pointsArr = Array.from($el);
      const getValues = pointsArr.map((val) => {
        return Number(val.textContent);
      });
      const points = getValues.filter((el) => el > 0);
      if (getValues.some((val) => val === 21)) {
        cy.reload();
        cy.closeStartGamePopup();

        cy.setBet(500);
        cy.wait(4000);
        cy.blackjackOnStart();
      }
    });
});

Cypress.Commands.add("checkPointsFromCard", (player) => {
  return cy.get(`#${player}-cards .card__face--front>img`).then(($cards) => {
    let flag;
    const cards = Array.from($cards);
    flag = cards.some((el) => Number(el.dataset.value) === 1);
    const pointsFromCard = cards
      .map((el) => parseInt(el.dataset.value))
      .reduce((first, next) => {
        return first + next;
      });
    return pointsFromCard;
  });
});

Cypress.Commands.add("CheckPoints", (player) => {
  cy.get(`#${player}-cards .card__face--front>img`).then(($cards) => {
    let flag;
    const cards = Array.from($cards);
    flag = cards.some((el) => Number(el.dataset.value) === 1);
    const pointsFromCard = cards
      .map((el) => parseInt(el.dataset.value))
      .reduce((first, next) => {
        return first + next;
      });
    const pointsCardArr = [pointsFromCard];

    if (flag) {
      pointsCardArr.push(pointsFromCard + 10);
    }

    cy.get(`.points__${player}`)
      .children()
      .then(($el) => {
        const pointsArr = Array.from($el);
        const getValues = pointsArr.map((val) => {
          return Number(val.textContent);
        });
        const points = getValues.filter((el) => el > 0);
        points.forEach((el, index) => {
          expect(el).to.equals(pointsCardArr[index]);
        });
      });
  });
});

Cypress.Commands.add("comparePoints", (results) => {
  cy.get(`.points__player`)
    .children()
    .then(($el) => {
      const pointsArr = Array.from($el);
      const getValues = pointsArr.map((val) => {
        return Number(val.textContent);
      });
      const playerPoints = getValues[0];

      cy.get(`.points__croupier`)
        .children()
        .then(($el) => {
          const pointsArr = Array.from($el);
          const getValues = pointsArr.map((val) => {
            return Number(val.textContent);
          });
          const croupierPoints = getValues[0];

          switch (results) {
            case "win":
              expect(playerPoints).to.be.greaterThan(croupierPoints);
              break;
            case "lost":
              expect(playerPoints).to.be.lessThan(croupierPoints);
              break;
            case "draw":
              expect(playerPoints).to.equal(croupierPoints);
              break;
          }
        });
    });
});

Cypress.Commands.add("checkEndGamePopup", (results, value) => {
  cy.get(".highscores").children().as("popup").should("be.visible");
  cy.get("@popup").then(($content) => {
    const content = $content.text().toLowerCase();
    expect(content).to.contain(results.toLowerCase());
    if (results === "blackjack") expect($content).to.contain(2 * value);
    else expect(content).to.contain(value);
  });
});

Cypress.Commands.add("closeHighscoresPopup", () => {
  cy.get(".highscores").click();
});

Cypress.Commands.add("startAgainPopup", () => {
  cy.get(".popup__container--start-game").as("popup").should("be.visible");
});

Cypress.Commands.add("checkCurrentCash", (results, bet, startValue) => {
  cy.get(".bets__value").then(($val) => {
    const currentValue = parseInt($val.text());
    switch (results) {
      case "win":
        expect(currentValue).to.equal(startValue + bet);
        break;
      case "lost":
        expect(currentValue).to.equal(startValue - bet);
        break;
      case "draw":
        expect(currentValue).to.equal(startValue);
        break;
      case "blackjack":
        expect(currentValue).to.equal(startValue + bet * 2);
        break;
    }
  });
});

Cypress.Commands.add("assertCardsQty", (player, qty, flag) => {
  if (flag)
    cy.get(`#${player}-cards`).children().should("have.length.above", qty);
  else cy.get(`#${player}-cards`).children().should("have.length", qty);
});
