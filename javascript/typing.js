const game = document.getElementById('game');
const codebox = document.getElementById('code');

let text = '';      // the code the user has to type
let letters = [];   // one <span> for every character in text
let position = 0;   // index of the next character the user should type


// ---------- Drawing the code ----------

//we need to break the string into characters
function renderCode(code) {
    text = code.trim();
    letters = [];
    position = 0;
    codebox.innerHTML = '';

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
        letters[position].scrollIntoView({ block: 'nearest' });
    }
}


// ---------- Typing logic ----------

function typeChar(char) {
    if (position >= text.length) {
        return;
    }

    if (char === text[position]) {
        letters[position].classList.add('correct');
    } else {
        letters[position].classList.add('incorrect');
    }
    position++;

    skipIndentation();
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


// ---------- Keyboard ----------
//keydown event handler
game.addEventListener('keydown', (event) => {
    // Let shortcuts like Cmd+R or Ctrl+C work normally
    if (event.ctrlKey || event.metaKey) {
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
        codebox.textContent = data.error;
        return;
    }

    renderCode(data.code);
    game.focus();
}

document.getElementById('language').addEventListener('change', newGame);
document.getElementById('difficulty').addEventListener('change', newGame);
document.querySelector('button').addEventListener('click', newGame);

newGame();