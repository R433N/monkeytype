const mongoose = require('mongoose');

const LANGUAGES = ['javascript', 'python', 'cpp'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const snippetSchema = new mongoose.Schema({
    language: { type: String, required: true , enum: LANGUAGES, index:true},
    code: { type: String, required: true },
    difficulty: { type: String, required: true, enum: DIFFICULTIES } 
});
snippetSchema.index({ language: 1 , difficulty: 1});

module.exports = mongoose.model('Snippet', snippetSchema);
module.exports.LANGUAGES = LANGUAGES;
module.exports.DIFFICULTIES = DIFFICULTIES;