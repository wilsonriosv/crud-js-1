const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Importar cors
const User = require('./models/User');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');
const Score = require('./models/Score');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/quizDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Usar cors
app.use(cors());

app.use(express.json());

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.send('Usuario registrado con éxito');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        res.send('Inicio de sesión exitoso');
        console.log(user);
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

app.get('/quiz/:quizCode', async (req, res) => {
    const quiz = await Quiz.findOne({ code: req.params.quizCode }).populate('questions');
    if (quiz) {
        res.json(quiz);
    } else {
        res.status(404).send('Quiz no encontrado');
    }
});

app.post('/submit', async (req, res) => {
    const { quizCode, answers } = req.body;
    const quiz = await Quiz.findOne({ code: quizCode }).populate('questions');
    if (quiz) {
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correct) {
                score++;
            }
        });
        const newScore = new Score({ userId: req.userId, quizCode, score });
        await newScore.save();
        res.json({ score });
    } else {
        res.status(404).send('Quiz no encontrado');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
