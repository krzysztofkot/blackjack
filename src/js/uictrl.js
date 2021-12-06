const DOMstrings = {
  betInput: ".bets__value--input",
  totalCash: ".bets__value",
  acceptBtn: ".bets__btn--accept",
  allInBtn: ".bets__btn--all-in",
  standBtn: ".action__btn--stand",
  hitBtn: ".action__btn--hit",
  doubleBtn: ".action__btn--double",
  btnToggleClass: "u-btn--active",
  displayElement: "display",
  grayBG: "gray-background",
  dataBet: "[data-bet]",
  startBtn: "[data-btn='start']",
  startAgainBtn: "[data-btn='start again']",
  popupStartWindow: "[data-window='welcome']",
  popupPlayAgainWindow: "[data-window='play again']",
  highscoresContainer: ".highscores",
  highscoresStatus: ".highscores__game-status",
  highscoresValue: ".highscores__value",
  croupierCardContainer: "#croupier-cards",
  pointsPartial: "points__value",
};

const DOMselectors = {
  betInput: document.querySelector(DOMstrings.betInput),
  totalCash: document.querySelector(DOMstrings.totalCash),
  acceptBtn: document.querySelector(DOMstrings.acceptBtn),
  allInBtn: document.querySelector(DOMstrings.allInBtn),
  standBtn: document.querySelector(DOMstrings.standBtn),
  hitBtn: document.querySelector(DOMstrings.hitBtn),
  doubleBtn: document.querySelector(DOMstrings.doubleBtn),
  dataBet: document.querySelectorAll(DOMstrings.dataBet),
  startBtn: document.querySelector(DOMstrings.startBtn),
  popupStart: document.querySelector(DOMstrings.popupStartWindow),
  popupPlayAgain: document.querySelector(DOMstrings.popupPlayAgainWindow),
  highscores: document.querySelector(DOMstrings.highscoresContainer),
  highscoresGameStatus: document.querySelector(DOMstrings.highscoresStatus),
  highscoresValueInput: document.querySelector(DOMstrings.highscoresValue),
  croupierContainer: document.querySelector(DOMstrings.croupierCardContainer),
};

export default class UIController {
  constructor() {}

  hideWindow(element) {
    // DOMselectors.element.classList.toggle('display');
    document.querySelector(element).classList.toggle("display");
    //popupStartWindow dla start Window//  popupPlayAgainWindow dla play again
  }

  insertBet(e) {
    const val = e.target.value;

    const newVal = val.replace(/\D/g, "").replace(/^[0]+/g, "");
    e.target.value = newVal;
  }

  returnBet() {
    return DOMselectors.betInput.value;
  }

  showBet(value) {
    DOMselectors.betInput.value = value;
  }

  toggleStandAndHitBtns() {
    DOMselectors.standBtn.classList.toggle(DOMstrings.btnToggleClass);
    DOMselectors.hitBtn.classList.toggle(DOMstrings.btnToggleClass);
  }

  toggleDoubleBtn() {
    return DOMselectors.doubleBtn.classList.toggle(DOMstrings.btnToggleClass);
  }

  preventPaste(e) {
    e.preventDefault();
  }

  initCash(cash) {
    return (DOMselectors.totalCash.textContent = cash);
  }

  addAllIn() {
    const retriveCash = DOMselectors.totalCash.textContent;
    DOMselectors.betInput.value = retriveCash;
  }

  printNewCash(updateCash) {
    DOMselectors.totalCash.innerText = updateCash;
  }

  inputToggleDisable() {
    DOMselectors.betInput.disabled === true
      ? (DOMselectors.betInput.disabled = false)
      : (DOMselectors.betInput.disabled = true);
  }

  clearBetInput() {
    DOMselectors.betInput.value = "";
    // DOMselectors.betInput.focus();
  }

  generateCardUI(playerName, obj, allCards) {
    const cardContainer = document.querySelector(`#${playerName}-cards`);
    const outerDiv = document.createElement("div");
    const innerDivFront = document.createElement("div");
    const innerDivBack = document.createElement("div");
    const createImg = document.createElement("img");

    const rotate = () => outerDiv.classList.add("card--rotated");

    outerDiv.classList.add("card");
    if (allCards.length === 1) {
      outerDiv.classList.add(`card--${allCards.length}`);
    } else {
      //change all cards classes to classes with current amount of cards (for CSS styling)
      cardContainer
        .querySelectorAll(".card")
        .forEach((el) =>
          el.classList.replace(
            `card--${allCards.length - 1}`,
            `card--${allCards.length}`
          )
        );
      outerDiv.classList.add(`card--${allCards.length}`);
    }
    innerDivFront.classList.add("card__face", "card__face--front");
    innerDivBack.classList.add("card__face", "card__face--back");
    createImg.src = `./img/${obj.id}.png`;
    createImg.alt = `${obj.figure} of ${obj.color}`;
    createImg.id = obj.id;
    createImg.dataset.value = obj.value;
    createImg.classList.add("card__picture");
    innerDivFront.appendChild(createImg);
    outerDiv.appendChild(innerDivFront);
    outerDiv.appendChild(innerDivBack);
    cardContainer.appendChild(outerDiv);

    if (playerName === "croupier" && allCards.length === 2) {
    } else {
      setTimeout(rotate, 500);
    }
  }

  rotateCroupierCard() {
    const firstCard =
      DOMselectors.croupierContainer.querySelector(".card:nth-child(2)");
    firstCard.classList.toggle("card--rotated");
  }

  removeAllCards(player) {
    const cardsParentNode = document.querySelector(`#${player}-cards`);
    while (cardsParentNode.firstChild) {
      cardsParentNode.removeChild(cardsParentNode.lastChild);
    }
  }

  showPoints(person, points) {
    if (points.length > 1) {
      document.querySelector(`.${person}__value--backslash`).textContent =
        " / ";
    }
    let n = 1;
    for (const entry of points) {
      document.querySelector(`.${person}__value--${n}`).textContent = entry;
      n++;
    }
  }

  clearPoints() {
    const allPoints = document.querySelectorAll(
      `[class^='${DOMstrings.pointsPartial}']`
    );
    for (const el of allPoints) {
      el.textContent = "";
    }
  }

  changeElementsColors(nodes) {
    nodes.forEach((node) => {
      node.classList.toggle(DOMstrings.grayBG);
    });
  }

  toggleDisplayPoints(player) {
    document
      .querySelector(`.points__${player}`)
      .classList.toggle(DOMstrings.displayElement);
  }

  removeDisplayPoints(player) {
    document
      .querySelector(`.points__${player}`)
      .classList.add(DOMstrings.displayElement);
  }

  togglePopup() {
    DOMselectors.highscores.classList.toggle("display");
  }

  toggleStartAgainWindow() {
    DOMselectors.popupPlayAgain.classList.toggle("display");
  }

  highscoresPopup(status, value) {
    let text;
    switch (status) {
      case "win":
        text = `You ${status}: $${value}`;
        break;
      case "draw":
        text = ` ${status}, got back: $${value}`;
        break;
      case "lost":
        text = `You ${status}: $${value}`;
        break;
      case "Blackjack":
        text = `Blackjack! You won: $${2 * value}`;
        break;
    }

    DOMselectors.highscoresGameStatus.textContent = `${text}`;
  }

  getDOMstrings() {
    return DOMstrings;
  }
  getDOMSelectors() {
    return DOMselectors;
  }
}
