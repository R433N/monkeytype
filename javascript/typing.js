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

function newGame(){
    document.getElementById(elementId='code').innerHTML = '';
    for (let i = 0; i < code.length; i++) {
        document.getElementById(elementId='code').innerHTML += formatCode(randomWord());;
    }
}

newGame();