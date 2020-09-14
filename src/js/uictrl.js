const DOMstrings = {
    betInput: ".bets__value--input",
    totalCash: ".bets__value",
    acceptBtn: ".bets__btn--accept",
    allInBtn: ".bets__btn--all-in",
    standBtn: ".action__btn--stand",
    hitBtn: ".action__btn--hit",
    doubleBtn: ".action__btn--double",
};
const DOMselectors = {
    betInput: document.querySelector(DOMstrings.betInput),
    totalCash: document.querySelector(DOMstrings.totalCash),
    acceptBtn: document.querySelector(DOMstrings.acceptBtn),
    allInBtn: document.querySelector(DOMstrings.allInBtn),
};

export const UIController = {

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
        DOMselectors.betInput.disabled === true
            ? (DOMselectors.betInput.disabled = false)
            : (DOMselectors.betInput.disabled = true);
    },

    clearBetInput: () => {
        DOMselectors.betInput.value = "";
        DOMselectors.betInput.focus();
    },

    generateCardUI: (playerName, obj) => {
        const cardTemplate = `<div class="card card--1">
                <div class="card__face card__face--front">
                    <img src="./img/${obj.id}.png" alt="${obj.figure} of ${obj.color}" id="${obj.id}" class="card__picture" />
                </div>
                <div class="card__face card__face--back"></div>
            </div>`;
        // console.log(cardTemplate);
        document
            .querySelector(`#${playerName}-cards`)
            .insertAdjacentHTML("beforeend", cardTemplate);
    },

    showPoints: (person, points) => {
        let n = 1;
        for (const entry of points) {
            document.querySelector(`.${person}__value--${n}`).innerText = entry;
            n++;
        }

    },

    getDOMstrings: () => DOMstrings,
};