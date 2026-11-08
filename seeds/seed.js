//PRODUCTION:
//WILL USE AI GENERATED CODE SNIPPETS, ONCE READY WILL USE IMPORT SOURCE SNIPPETS
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Snippet = require('../models/snippet.js');

const DATA_FOLDER = path.join(__dirname, 'data');
const SEPARATOR = /^===$/m;   // a line containing only ===

// Reads a file like data/python/beginner.txt and returns its snippets as an array
function readSnippets(language, difficulty) {
    const filePath = path.join(DATA_FOLDER, language, `${difficulty}.txt`);

    if (!fs.existsSync(filePath)) {
        console.warn(`Skipping missing file: ${filePath}`);
        return [];
    }

    // Windows saves line breaks as \r\n, so turn them into plain \n
    const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

    return content
        .split(SEPARATOR)
        .map(snippet => snippet.trim())
        .filter(snippet => snippet.length > 0);
}

async function seed() {
    const docs = [];
    for (const language of Snippet.LANGUAGES) {
        for (const difficulty of Snippet.DIFFICULTIES) {
            for (const code of readSnippets(language, difficulty)) {
                docs.push({ language, difficulty, code });
            }
        }
    }

    await mongoose.connect(process.env.MONGO_URI);
    await Snippet.deleteMany({});
    await Snippet.insertMany(docs);
    console.log(`Inserted ${docs.length} snippets`);

    const counts = await Snippet.aggregate([
        { $group: { _id: { language: '$language', difficulty: '$difficulty' }, count: { $sum: 1 } } },
        { $sort: { '_id.language': 1, '_id.difficulty': 1 } }
    ]);
    console.table(counts.map(c => ({ ...c._id, count: c.count })));

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});