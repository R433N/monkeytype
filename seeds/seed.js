require('dotenv').config();
const mongoose = require('mongoose');
const Snippet = require('../models/snippet.js');

const snippets = {
    python: {
        beginner: [
`print("Hello, World!")`
        ],
        intermediate: [
`numbers = [1, 2, 3, 4, 5]
squares = [n * n for n in numbers]
print(sum(squares))`
        ],
        advanced: [
`def memoize(func):
    cache = {}
    def wrapper(n):
        if n not in cache:
            cache[n] = func(n)
        return cache[n]
    return wrapper`
        ]
    },
    java: { beginner: [], intermediate: [], advanced: [] },
    cpp:  { beginner: [], intermediate: [], advanced: [] }
};

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    const docs = [];
    for (const language in snippets) {
        for (const difficulty in snippets[language]) {
            for (const code of snippets[language][difficulty]) {
                docs.push({ language, difficulty, code });
            }
        }
    }
    await Snippet.deleteMany({});
    await Snippet.insertMany(docs);
    console.log(`Inserted ${docs.length} snippets`);
    const counts = await Snippet.aggregate([
        { $group: { _id: { language: '$language', difficulty: '$difficulty' }, count: { $sum: 1 } } }
    ]);
    console.table(counts.map(c => ({ ...c._id, count: c.count })));
    await mongoose.disconnect();
}
seed().catch(err => {
    console.error(err);
    process.exit(1);
});