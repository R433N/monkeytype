require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Snippet = require('./models/snippet');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/api/snippet/:language/:difficulty', async (req, res) => {
    const { language, difficulty } = req.params;
    if (!Snippet.LANGUAGES.includes(language) || !Snippet.DIFFICULTIES.includes(difficulty)) {
        return res.status(400).json({ error: 'Unsupported language or difficulty' });
    }
    const [snippet] = await Snippet.aggregate([
        { $match: { language, difficulty } },
        { $sample: { size: 1 } }
    ]);
    if (!snippet) {
        return res.status(404).json({ error: 'No snippets found' });
    }
    res.json({ language, difficulty, code: snippet.code });
});



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(7070, () => {
            console.log("server running on port 7070")
        });
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });