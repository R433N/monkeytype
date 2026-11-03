const code = `function generateCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  console.log(generateCode());
`.split(' ');

function formatCode(code){
    return `<div class="code">
    <span class="letter">${code.split('').join('</span><span class="letter">')}</span>
    </div>`;

}

function randomWord(){
    const randomIndex = Math.floor(Math.random() * code.length);
    return code[randomIndex];
}

async function newGame(){
    const language = document.getElementById('language').value;
    const difficulty = document.getElementById('difficulty').value;
    const response = await fetch(`/api/snippet/${language}/${difficulty}`);
    const data = await response.json();

    const codebox = document.getElementById('code');
     if (!response.ok) {
        codebox.textContent = data.error;
        return;
    }
      let html = '';
    for (const word of data.code.split(' ')) {
        html += formatCode(word);
    }
    codebox.innerHTML = html;
}
document.getElementById('language').addEventListener('change', newGame);
document.getElementById('difficulty').addEventListener('change', newGame);
document.querySelector('button').addEventListener('click', newGame);

newGame();