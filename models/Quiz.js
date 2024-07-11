const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    code: { type: String, required: true, unique: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Quiz', quizSchema);
