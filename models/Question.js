const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: String,
    options: [String],
    correct: String
});

module.exports = mongoose.model('Question', questionSchema);
