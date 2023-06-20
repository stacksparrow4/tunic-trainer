const c = document.getElementById("c");
const ctx = c.getContext("2d");

const statusSpan = document.getElementById("status");

const vowelAmnt = document.getElementById("vowelamnt");
const totalVowel = document.getElementById("totalvowel");
const constAmnt = document.getElementById("constamnt");
const totalConst = document.getElementById("totalconst");

const SYMBOLS_WIDTH = 9;
const SYMBOLS_HEIGHT = 5;

const VOWEL_COLUMNS = 4;
const CONST_COLUMNS = 5;

// removing counting bad symbols
// BAD SYMBOLS: 3, 18, 44 (in normal array)
let VOWELS = VOWEL_COLUMNS * SYMBOLS_HEIGHT - 2;
let CONSTS = CONST_COLUMNS * SYMBOLS_HEIGHT - 1;

vowelAmnt.value = VOWELS;
vowelAmnt.max = VOWELS;
constAmnt.value = CONSTS;
constAmnt.max = CONSTS;

totalVowel.innerText = VOWELS;
totalConst.innerText = CONSTS;

const rand = (a) => {
  return Math.floor(Math.random() * a);
};

class Symbols {
  constructor(img) {
    this.img = img;

    this.dx = this.img.width / SYMBOLS_WIDTH;
    this.dy = this.img.height / SYMBOLS_HEIGHT;
  }

  idToPos(id) {
    if (id < VOWELS) {
      // remap due to bad characters
      const mid = id + (id >= 3 ? (id >= 17 ? 2 : 1) : 0);
      return [
        this.dx * (mid % VOWEL_COLUMNS),
        this.dy * Math.floor(mid / VOWEL_COLUMNS),
      ];
    } else {
      const mid = id - VOWELS;
      return [
        this.dx * (VOWEL_COLUMNS + (mid % CONST_COLUMNS)),
        this.dy * Math.floor(mid / CONST_COLUMNS),
      ];
    }
  }

  drawSymbol(id, x, y, withBottom) {
    const [mx, my] = this.idToPos(id);

    const h = this.dy * (withBottom ? 1 : 5 / 6);

    ctx.drawImage(this.img, mx, my, this.dx, h, x, y, this.dx, h);
  }
}

const main = async () => {
  const symbolsImg = new Image();
  symbolsImg.src = "symbols.png";

  await new Promise((res) => (symbolsImg.onload = res));

  const symbols = new Symbols(symbolsImg);

  let currSymbol = 0;
  let answer = false;
  let shownVowels = VOWELS;
  let shownConsts = CONSTS;

  const randSymbol = () => {
    currSymbol = rand(shownVowels + shownConsts);
    if (currSymbol >= shownVowels) {
      currSymbol += VOWELS - shownVowels;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    symbols.drawSymbol(currSymbol, 0, 0, false);
  };

  randSymbol();

  vowelAmnt.onchange = () => {
    const newVal = parseInt(vowelAmnt.value);
    if (!Number.isNaN(newVal)) {
      shownVowels = newVal;
      randSymbol();
    }
  };

  constAmnt.onchange = () => {
    const newVal = parseInt(constAmnt.value);
    if (!Number.isNaN(newVal)) {
      shownConsts = newVal;
      randSymbol();
    }
  };

  c.onclick = (e) => {
    e.preventDefault();
    answer = !answer;
    if (answer) {
      ctx.clearRect(0, 0, c.width, c.height);
      symbols.drawSymbol(currSymbol, 0, 0, true);
    } else {
      randSymbol();
    }
  };
};

main();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
