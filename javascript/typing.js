import { Timer } from './timer.js';

const game = document.getElementById('game');
const codebox = document.getElementById('code');
const info = document.getElementById('info');

const LINE_HEIGHT = 35;
const CURSOR_LINE = 2;

let text = '';      // the code the user has to type
let letters = [];   // one <span> for every character in text
let position = 0;   // index of the next character the user should type

let typedCount = 0;     // every character typed, right or wrong
let mistakeCount = 0;   // wrong characters (still counted after Backspace)
let finished = false;

const timer = new Timer((seconds) => {
    info.textContent = `${Math.floor(seconds)}s`;
});


// ---------- Drawing the code ----------

function renderCode(code) {
    text = code.trim();
    letters = [];
    position = 0;
    codebox.innerHTML = '';
    resetStats();

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = 'letter';
        // A newline is invisible, so show a ↵ symbol before it
        span.textContent = char === '\n' ? '↵\n' : char;
        codebox.appendChild(span);
        letters.push(span);
    }

    updateCursor();
}

function updateCursor() {
    const old = codebox.querySelector('.current');
    if (old) {
        old.classList.remove('current');
    }

    if (position < letters.length) {
        letters[position].classList.add('current');
        scrollToCursor();
    }
}

function scrollToCursor(){
    const letterTop = letters[position].getBoundingClientRect().top;
    const codeTop = codebox.getBoundingClientRect().top;
    const cursorLine = Math.floor((letterTop - codeTop) / LINE_HEIGHT);
    const hiddenLines = Math.max(0, cursorLine - CURSOR_LINE);
    codebox.style.transform = `translateY(-${hiddenLines * LINE_HEIGHT}px)`;
}


// ---------- Typing logic ----------

function typeChar(char) {
    if (position >= text.length) {
        return;
    }

    if (!timer.hasStarted()) {
        timer.start();
    }
    typedCount++;

    if (char === text[position]) {
        letters[position].classList.add('correct');
    } else {
        letters[position].classList.add('incorrect');
        mistakeCount++;
    }
    position++;

    skipIndentation();

    if (position === text.length) {
        endGame();
    }
}

// Like a code editor: after a newline, jump over the spaces at the start of the line
function skipIndentation() {
    if (text[position - 1] !== '\n') {
        return;
    }
    while (text[position] === ' ' || text[position] === '\t') {
        letters[position].classList.add('auto');
        position++;
    }
}

function goBack() {
    // Step back over indentation that was skipped automatically
    while (position > 0 && letters[position - 1].classList.contains('auto')) {
        position--;
    }

    if (position === 0) {
        return;
    }

    position--;
    letters[position].classList.remove('correct', 'incorrect');
}


// ---------- Stats ----------

function getWpm() {
    const correctCount = codebox.querySelectorAll('.correct').length;
    const minutes = timer.getSeconds() / 60;
    if (minutes === 0) {
        return 0;
    }
    // A "word" is counted as 5 characters, the standard used by typing tests
    return Math.round(correctCount / 5 / minutes);
}

function getAccuracy() {
    if (typedCount === 0) {
        return 0;
    }
    return Math.round((typedCount - mistakeCount) / typedCount * 100);
}

function resetStats() {
    timer.reset();
    typedCount = 0;
    mistakeCount = 0;
    finished = false;
    info.textContent = '0s';
}

function endGame() {
    finished = true;
    timer.stop();
    info.textContent = `${getWpm()} wpm · ${getAccuracy()}% acc · ${timer.getSeconds().toFixed(1)}s`;
}


// ---------- Keyboard ----------

game.addEventListener('keydown', (event) => {
    // Let shortcuts like Cmd+R or Ctrl+C work normally
    if (event.ctrlKey || event.metaKey) {
        return;
    }

    if (finished) {
        return;
    }

    const key = event.key;

    if (key === 'Backspace') {
        goBack();
    } else if (key === 'Enter') {
        typeChar('\n');
    } else if (key.length === 1) {
        typeChar(key);
    } else if (key !== 'Tab') {
        return; // Shift, arrows, etc. do nothing
    }

    // Stop the browser's own behaviour (Space scrolling the page, Tab leaving the game)
    event.preventDefault();
    updateCursor();
});


// ---------- Loading a new game ----------

async function newGame() {
    const language = document.getElementById('language').value;
    const difficulty = document.getElementById('difficulty').value;
    const response = await fetch(`/api/snippet/${language}/${difficulty}`);
    const data = await response.json();

    if (!response.ok) {
        text = '';
        letters = [];
        resetStats();
        codebox.textContent = data.error;
        return;
    }

    renderCode(data.code);
    game.focus();
}

// allowing user to paste own code
async function pasteCode(){
    //first clear the codebox, then allow user to paste the code 
    //then when user click OK, the code will be rendered in the codebox and new game will start 
    codebox.textContent = '';
    const userCode = prompt("Paste your code here:");
    resetStats();
    if (userCode) {
        renderCode(userCode);
        game.focus();
    }
}

document.getElementById('language').addEventListener('change', newGame);
document.getElementById('difficulty').addEventListener('change', newGame);
document.querySelector('button').addEventListener('click', newGame);
document.getElementById("logo").addEventListener('click', newGame);
document.getElementById('pasteCode').addEventListener('click', pasteCode);


newGame();