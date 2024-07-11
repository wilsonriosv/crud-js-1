const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quizCode: { type: String, required: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model('Score', scoreSchema);
