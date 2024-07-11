document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        fetch('http://localhost:3000/register', { // Actualiza la URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        fetch('http://localhost:3000/login', { // Actualiza la URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadQuiz();
        })
        .catch(error => console.error('Error:', error));
    });

    function loadQuiz() {
        const quizCode = document.getElementById('quizCode').value;
        fetch(`http://localhost:3000/quiz/${quizCode}`) // Actualiza la URL
            .then(response => response.json())
            .then(data => generateForm(data.questions));
    }

    function generateForm(questions) {
        console.log("quizCode:", document.getElementById('quizCode').value, " ---");
        const form = document.getElementById('quizForm');
        form.innerHTML = ''; // Clear existing form content
        questions.forEach((q, index) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.innerHTML = `
                <input type="hidden" id="quizCode" value="quiz1">
                <p>${index + 1}. ${q.question}</p>
                ${q.options.map((option, i) => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="question${index + 1}" value="${String.fromCharCode(97 + i)}" id="q${index + 1}${String.fromCharCode(97 + i)}">
                        <label class="form-check-label" for="q${index + 1}${String.fromCharCode(97 + i)}">${String.fromCharCode(97 + i)}) ${option}</label>
                    </div>
                `).join('')}
            `;
            form.appendChild(formGroup);
            form.appendChild(document.createElement('hr'));
        });

        const submitButton = document.createElement('div');
        submitButton.className = 'text-center';
        submitButton.innerHTML = `<button type="submit" class="btn btn-primary">Enviar</button>`;
        form.appendChild(submitButton);

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            validateForm(questions);
        });
    }

    function validateForm(questions) {
        const quizCode = document.getElementById('quizCode').value;
        let answers = [];
        questions.forEach((q, index) => {
            const options = document.getElementsByName(`question${index + 1}`);
            for (let option of options) {
                if (option.checked) {
                    answers.push(option.value);
                }
            }
        });

        fetch('http://localhost:3000/submit', { // Actualiza la URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quizCode, answers })
        })
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<div class="alert alert-info text-center">Tu calificación es ${data.score} de ${questions.length}.</div>`;
        })
        .catch(error => console.error('Error:', error));
    }
});
