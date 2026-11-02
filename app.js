const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(7070, () => {
    console.log("server running on port 7070")
})