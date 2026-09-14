// =======================
// RUN AFTER DOM LOAD
// =======================
document.addEventListener("DOMContentLoaded", function () {

    // =======================
    // SIDEBAR TOGGLE
    // =======================
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (menuBtn && sidebar && overlay) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // =======================
    // ENTER KEY SUPPORT
    // =======================
    const dashInput = document.getElementById("dashInput");

    if (dashInput) {
        dashInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendDashMessage();
            }
        });
    }

    // LOAD USER + THEME
    loadUser();
    loadTheme();
});


// =======================
// THEME TOGGLE (FIXED)
// =======================
function toggleTheme() {
    document.body.classList.toggle("light");

    let isLight = document.body.classList.contains("light");

    localStorage.setItem("theme", isLight ? "light" : "dark");

    updateThemeButton();
}


// =======================
// UPDATE BUTTON TEXT
// =======================
function updateThemeButton() {
    const btn = document.getElementById("themeBtn");
    if (!btn) return;

    if (document.body.classList.contains("light")) {
        btn.innerText = "🌞 Light Mode";
    } else {
        btn.innerText = "🌙 Dark Mode";
    }
}


// =======================
// LOAD SAVED THEME
// =======================
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
    }

    updateThemeButton();
}


// =======================
// OPTIONAL STUDY CHECK
// =======================
function isStudyRelated(text) {
    const keywords = [
        "math", "science", "physics", "chemistry",
        "programming", "java", "python", "dbms",
        "algorithm", "data", "ai", "machine learning",
        "study", "education", "engineering",
        "history", "geography", "economics", "biology",
        "politics", "civics", "english", "literature"
    ];

    return keywords.some(word =>
        text.toLowerCase().includes(word)
    );
}


// =======================
// FORMAT RESPONSE
// =======================
function formatText(text) {
    return text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/```/g, "")
        .replace(/`/g, "")
        .replace(/#/g, "")
        .replace(/\/\/+/g, "")
        .trim();
}


// =======================
// SPEECH
// =======================
function speakText(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

function stopSpeak() {
    window.speechSynthesis.cancel();
}


// =======================
// DASHBOARD AI CHAT
// =======================
async function sendDashMessage() {
    const input = document.getElementById("dashInput");
    const output = document.getElementById("dashResponse");

    if (!input || !output) return;

    let question = input.value.trim();
    if (!question) return;

    output.innerText = "Thinking...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: question,
                source: "dashboard"
            })
        });

        const data = await res.json();

        let cleanText = formatText(data.answer || "No response");

        output.innerText = cleanText;
        speakText(cleanText);

    } catch (err) {
        output.innerText = "Error connecting to AI";
        console.error(err);
    }

    input.value = "";
}


// =======================
// NOTES GENERATOR
// =======================
async function generateNotes() {
    const topic = document.getElementById("notesInput").value;
    const output = document.getElementById("notesOutput");

    if (!topic) return;

    output.innerText = "Generating notes...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: `Generate short study notes on ${topic}`,
                source: "dashboard"
            })
        });

        const data = await res.json();

        output.innerText = formatText(data.answer || "No notes generated");

    } catch {
        output.innerText = "Error generating notes";
    }
}


// =======================
// RECOMMENDATIONS
// =======================
async function getRecommendations() {
    const topic = document.getElementById("recInput").value;
    const output = document.getElementById("recOutput");

    if (!topic) return;

    output.innerText = "Fetching recommendations...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: `Suggest learning resources for ${topic}`,
                source: "dashboard"
            })
        });

        const data = await res.json();

        output.innerText = formatText(data.answer || "No suggestions found");

    } catch {
        output.innerText = "Error fetching recommendations";
    }
}


// =======================
// LOAD USER
// =======================
function loadUser() {
    const user = localStorage.getItem("userEmail");
    const el = document.getElementById("userName");

    if (el) {
        if (user) {
            let name = user.split("@")[0];
            el.innerText = name.charAt(0).toUpperCase() + name.slice(1);
        } else {
            el.innerText = "Guest";
        }
    }
}

async function generateDailyPlan() {
    const output = document.getElementById("dailyPlan");

    let accuracy = localStorage.getItem("accuracy") || 0;
    let quizCount = localStorage.getItem("quizCount") || 0;

    output.innerText = "Generating your plan...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: `Create a simple daily study plan for a student.
                Accuracy: ${accuracy}%
                Quizzes taken: ${quizCount}`,
                source: "dashboard"
            })
        });

        const data = await res.json();

        output.innerText = formatText(data.answer);

    } catch {
        output.innerText = "Error generating plan";
    }
}