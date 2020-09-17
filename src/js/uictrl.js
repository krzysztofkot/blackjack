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

        const newVal = val.replace(/\D/g, '').replace(/^[0]+/g, '');
        e.target.value = newVal;
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
        DOMselectors.betInput.disabled === true ? (DOMselectors.betInput.disabled = false) : (DOMselectors.betInput.disabled = true);
    },

    updateBet: (newValue) => {
        DOMselectors.betInput.value = 2 * newValue;
    },

    clearBetInput: () => {
        DOMselectors.betInput.value = "";
        DOMselectors.betInput.focus();
    },

    generateCardUI: (playerName, obj) => {
        const outerDiv = document.createElement('div');
        outerDiv.classList.add('card', 'card--1');
        const innerDivFront = document.createElement('div');
        innerDivFront.classList.add('card__face', 'card__face--front');
        const innerDivBack = document.createElement('div');
        innerDivBack.classList.add('card__face', 'card__face--back');
        const createImg = document.createElement('img');
        createImg.src = `./img/${obj.id}.png`;
        createImg.alt = `${obj.figure} of ${obj.color}`;
        createImg.id = obj.id;
        createImg.classList.add('card__picture');
        innerDivFront.appendChild(createImg);
        outerDiv.appendChild(innerDivFront);
        outerDiv.appendChild(innerDivBack);
        document.querySelector(`#${playerName}-cards`).appendChild(outerDiv);

        // const cardTemplate = `<div class="card card--1">
        //         <div class="card__face card__face--front">
        //             <img src="./img/${obj.id}.png" alt="${obj.figure} of ${obj.color}" id="${obj.id}" class="card__picture" />
        //         </div>
        //         <div class="card__face card__face--back"></div>
        //     </div>`;
        // console.log(cardTemplate);
        // document
        //     .querySelector(`#${playerName}-cards`)
        //     .insertAdjacentHTML("beforeend", cardTemplate);
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