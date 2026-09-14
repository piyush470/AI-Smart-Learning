let questions = [];
let timer;
let timeLeft = 30;

// =======================
// STATIC QUIZ
// =======================
function generateStaticQuiz() {
    const topic = document.getElementById("topic").value || "General";
    const level = document.getElementById("difficulty").value;

    if (level === "easy") {
        questions = [
            {
                q: `Basic concept of ${topic}?`,
                options: ["Concept", "Tool", "Language", "None"],
                answer: 0
            }
        ];
    } else if (level === "medium") {
        questions = [
            {
                q: `Use of ${topic}?`,
                options: ["Development", "Design", "Cooking", "None"],
                answer: 0
            },
            {
                q: "Which language is used in AI?",
                options: ["Python", "HTML", "CSS", "C"],
                answer: 0
            }
        ];
    } else {
        questions = [
            {
                q: `Advanced concept of ${topic}?`,
                options: ["Algorithm", "Food", "Game", "None"],
                answer: 0
            },
            {
                q: "Which is ML algorithm?",
                options: ["Regression", "HTML", "CSS", "JS"],
                answer: 0
            }
        ];
    }

    loadQuiz();
    startTimer();
}

// =======================
// LOAD QUIZ UI
// =======================
function loadQuiz() {
    let html = "";

    questions.forEach((q, i) => {
        html += `<div class="question-card">`;
        html += `<h3>${i + 1}. ${q.q}</h3>`;

        q.options.forEach((opt, j) => {
            html += `
                <div class="option" onclick="selectOption(this, ${i}, ${j})">
                    ${opt}
                </div>
            `;
        });

        html += `</div>`;
    });

    document.getElementById("quizBox").innerHTML = html;
}

// =======================
// SELECT OPTION
// =======================
function selectOption(el, qIndex, optIndex) {
    const options = el.parentElement.querySelectorAll(".option");

    options.forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");

    questions[qIndex].selected = optIndex;
}

// =======================
// TIMER
// =======================
function startTimer() {
    clearInterval(timer);
    timeLeft = 60;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `⏱ ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

// =======================
// SUBMIT
// =======================
async function submitQuiz() {
    clearInterval(timer);

    let score = 0;

    // =========================
    // SHOW CORRECT / WRONG
    // =========================
    const cards = document.querySelectorAll(".question-card");

    cards.forEach((card, i) => {
        const options = card.querySelectorAll(".option");
        const correctIndex = questions[i].answer;
        const selectedIndex = questions[i].selected;

        options.forEach((opt, j) => {
            opt.classList.remove("correct", "wrong");

            // Mark correct answer
            if (j === correctIndex) {
                opt.classList.add("correct");
                opt.innerHTML += " ✔";
            }

            // Mark wrong selected
            if (j === selectedIndex && selectedIndex !== correctIndex) {
                opt.classList.add("wrong");
                opt.innerHTML += " ✖";
            }
        });

        if (selectedIndex === correctIndex) score++;
    });

    let accuracy = Math.round((score / questions.length) * 100);

    localStorage.setItem("accuracy", accuracy);

    let count = parseInt(localStorage.getItem("quizCount")) || 0;
    localStorage.setItem("quizCount", count + 1);

    document.getElementById("result").innerText =
        `✅ Score: ${score}/${questions.length} (${accuracy}%)`;

    // =======================
    // AI FEEDBACK
    // =======================
    const feedbackBox = document.getElementById("aiFeedback");
    feedbackBox.innerText = "Analyzing your performance...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: `A student scored ${accuracy}% in a quiz. Give short feedback and improvement tips.`
            })
        });

        const data = await res.json();

        let text = data.answer
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/#/g, "");

        feedbackBox.innerText = "📊 AI Feedback:\n" + text;

    } catch (err) {
        feedbackBox.innerText = "Error getting feedback";
        console.error(err);
    }
}

// =======================
// AI QUIZ (FIXED)
// =======================
async function generateAIQuiz() {
    const topicInput = document.getElementById("quizTopic");
    const container = document.getElementById("quizBox");

    if (!topicInput.value.trim()) return;

    let topic = topicInput.value;

    container.innerText = "Generating AI quiz...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: `Generate exactly 5 MCQ questions on ${topic}.
Format strictly like:
Q1: question
A) option
B) option
C) option
D) option
Answer: A`
            })
        });

        const data = await res.json();

        let text = data.answer
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/#/g, "");

        // -------- CLEAN PARSING --------
        let blocks = text.split(/Q\d+:/).slice(1);

        questions = blocks.map(qBlock => {
            let lines = qBlock.split("\n").filter(l => l.trim() !== "");

            let question = lines[0].trim();

            let options = lines
                .filter(l => /^[A-D]\)/.test(l))
                .map(l => l.substring(3).trim());

            let answerLine = lines.find(l => l.includes("Answer"));
            let answerLetter = answerLine?.split(":")[1]?.trim();

            let answerIndex = ["A", "B", "C", "D"].indexOf(answerLetter);

            return {
                q: question,
                options: options,
                answer: answerIndex
            };
        });

        // SAFETY FILTER
        questions = questions.filter(q => q.options.length === 4);

        loadQuiz();
        startTimer();

    } catch (err) {
        container.innerText = "Error generating quiz";
        console.error(err);
    }

    topicInput.value = "";
}