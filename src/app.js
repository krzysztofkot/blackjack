import { gameController } from './js/gamectrl';
import { UIController } from './js/uictrl';
import { controller } from './js/appctrl';
import scss from './sass/main.scss';

controller(gameController, UIController);

//vh fix for mobile browsers 
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);



window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const paginationBtns = document.querySelector(".rules__btns");
const nextBtn = document.querySelector("[data-btn='next']");
const prevBtn = document.querySelector("[data-btn='prev']");
const active = 'rules__page--active'

const changePage = (e) => {
    const action = e.target.dataset.btn;
    const allPages = document.querySelectorAll(".rules__page");
    const activePage = [...allPages].findIndex((page) =>
        page.classList.contains(active)
    );
    if (action === "next") {
        if (allPages.length - 1 > activePage) {
            allPages[activePage].classList.toggle(active);
            allPages[activePage + 1].classList.toggle(active);
        }
    } else if (action === "prev") {
        if (activePage > 0) {
            allPages[activePage].classList.toggle(active);
            allPages[activePage - 1].classList.toggle(active);
        }
    }
    const newActive = [...allPages].findIndex((page) =>
        page.classList.contains(active));
    if (newActive === 0) {
        prevBtn.classList.add("display");
        nextBtn.classList.remove("display");
    } else {
        prevBtn.classList.remove("display");
        nextBtn.classList.add("display");
    }
};

paginationBtns.addEventListener("click", changePage);



