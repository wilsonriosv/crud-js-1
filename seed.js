const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');
const Score = require('./models/Score');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/quizDB', { useNewUrlParser: true, useUnifiedTopology: true });

const seedDB = async () => {
    // Limpiar la base de datos
    await User.deleteMany({});
    await Question.deleteMany({});
    await Quiz.deleteMany({});
    await Score.deleteMany({});

    // Crear usuarios
    const users = [
        {
            email: "user1@example.com",
            password: await bcrypt.hash("password123", 10)
        },
        {
            email: "user2@example.com",
            password: await bcrypt.hash("password123", 10)
        }
    ];
    const createdUsers = await User.insertMany(users);

    // Crear preguntas
    const questions = [
        {
            question: "¿Qué es JavaScript?",
            options: ["Un lenguaje de programación", "Un navegador web", "Un sistema operativo", "Un lenguaje de marcado"],
            correct: "a"
        },
        {
            question: "¿Cuál es el propósito de JavaScript?",
            options: ["Desarrollo de aplicaciones de servidor", "Desarrollo de aplicaciones de escritorio", "Desarrollo de aplicaciones web", "Desarrollo de sistemas operativos"],
            correct: "c"
        },
        {
            question: "¿Cuál de las siguientes es una estructura de control en JavaScript?",
            options: ["<if>", "<else>", "if-else", "<when>"],
            correct: "c"
        },
        {
            question: "¿Cómo se declara una variable en JavaScript?",
            options: ["variable x;", "let x;", "var x;", "declare x;"],
            correct: "b"
        },
        {
            question: "¿Cuál de las siguientes es una biblioteca de JavaScript?",
            options: ["React", "Laravel", "Django", "Ruby on Rails"],
            correct: "a"
        }
    ];
    const createdQuestions = await Question.insertMany(questions);

    // Crear quizzes
    const quizzes = [
        {
            code: "quiz1",
            questions: createdQuestions.map(q => q._id)
        }
    ];
    await Quiz.insertMany(quizzes);

    // Crear calificaciones
    const scores = [
        {
            userId: createdUsers[0]._id,
            quizCode: "quiz1",
            score: 3
        },
        {
            userId: createdUsers[1]._id,
            quizCode: "quiz1",
            score: 4
        }
    ];
    await Score.insertMany(scores);

    console.log('Base de datos sembrada!');
};

seedDB().then(() => {
    mongoose.connection.close();
});
