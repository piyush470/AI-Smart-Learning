# AI Smart Learning Assistant

An AI-powered learning companion developed as a **hackathon project** to make studying more interactive, personalized, and accessible. The application combines a web-based learning dashboard with a Groq-powered AI assistant for doubt-solving, note generation, topic recommendations, and quiz-based practice.

> **Project status:** Hackathon prototype  
> **AI integration:** Groq API using the Llama 3.1 8B Instant model

---

## Overview

AI Smart Learning Assistant is designed to support students throughout their learning journey. Users can interact with an AI chatbot, generate study notes, explore topic recommendations, take quizzes, and view basic learning-performance indicators from a central dashboard.

The project uses a lightweight web frontend and a Python API backend. The frontend sends prompts to a FastAPI endpoint, which communicates with Groq and returns the AI-generated response.

## Features

- **AI Chatbot:** Ask study-related questions and receive AI-generated responses.
- **Voice Interaction:** Use browser speech recognition to submit a question and text-to-speech to hear responses (browser support required).
- **AI Notes Generator:** Enter a topic to generate short study notes.
- **Smart Recommendations:** Request learning recommendations based on a topic.
- **AI Quiz:** Generate a topic-based quiz and receive performance feedback.
- **Learning Dashboard:** View quiz-related accuracy and progress indicators.
- **Theme Toggle:** Switch between dark and light themes.
- **Responsive Navigation:** Navigate between dashboard, chatbot, quiz, and settings pages.
- **Browser-Based Progress:** Quiz count, accuracy, and theme preferences use browser `localStorage`.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python, FastAPI, Uvicorn |
| AI Integration | Groq API, Llama 3.1 8B Instant |
| Request Validation | Pydantic |
| Browser Features | Web Speech API, Local Storage |

## Project Structure

```text
ai-edu-assistant/
├── dashboard.html       # Main learning dashboard
├── dashboard.css        # Dashboard styling
├── dashboard.js         # Dashboard logic and API calls
├── index.html           # AI chatbot interface
├── chat.css             # Chat interface styling
├── quiz.html            # Quiz interface
├── quiz.css             # Quiz styling
├── quiz.js              # Quiz logic and AI feedback
├── login.html           # Login page UI
├── login.css
├── register.html        # Registration page UI
├── register.css
├── settings.html        # Settings page
├── settings.css
├── settings.js
├── auth.js
├── main.py              # FastAPI backend and Groq integration
└── run_server.bat       # Windows server launcher (update its path if needed)
```

## How It Works

1. A student enters a question or topic in the frontend.
2. JavaScript sends a `POST` request to the FastAPI `/ask` endpoint.
3. FastAPI forwards the prompt to the Groq chat-completions API.
4. Groq returns a model-generated response.
5. The backend returns the answer as JSON, and the frontend displays it.

### API Endpoint

`POST /ask`

**Request body**
```json
{
  "question": "Explain machine learning in simple terms."
}
```

**Successful response**
```json
{
  "answer": "..."
}
```

The backend also exposes `GET /` as a simple server-status endpoint.

## Getting Started

### Prerequisites

- Python 3.10 or newer (a compatible Python environment)
- A Groq API key
- A modern browser
- Git (optional)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-edu-assistant.git
cd ai-edu-assistant
```

Replace `YOUR_USERNAME` and the repository name with your actual GitHub repository details.

### 2. Create and activate a virtual environment

**Windows**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install backend dependencies

```bash
pip install fastapi uvicorn groq pydantic
```

### 4. Configure your Groq API key

The backend requires a valid Groq API key. **Do not publish API keys in your repository or README.**

The current prototype has API-key configuration inside `main.py`. Before publishing, replace any hard-coded key with an environment variable. For example, install `python-dotenv`, create a local `.env` file, and load the key from it:

```bash
pip install python-dotenv
```

`.env` (keep this file private):
```env
GROQ_API_KEY=your_groq_api_key_here
```

Then configure the backend to read `GROQ_API_KEY` from the environment (for example, with `os.getenv("GROQ_API_KEY")`) instead of embedding the secret in source code. Add `.env` to `.gitignore`.

### 5. Start the FastAPI backend

From the folder containing `main.py`, run:

```bash
uvicorn main:app --reload
```

The API should be available at:

- `http://127.0.0.1:8000/` — server status
- `http://127.0.0.1:8000/docs` — interactive API documentation

### 6. Open the frontend

Open `dashboard.html` in your browser, or run the project folder through a local development server such as the VS Code Live Server extension.

The frontend currently sends AI requests to `http://127.0.0.1:8000/ask`, so the backend must be running locally for AI features to work.

## Security Notes

- Never commit Groq API keys, `.env` files, or other secrets.
- If an API key has ever been committed or shared publicly, revoke/rotate it in Groq and replace it with a new secret.
- Restrict CORS origins before deploying beyond local development.
- The current frontend points to a localhost backend. A deployed version will need a securely hosted backend URL and appropriate CORS configuration.
- This is a hackathon prototype; review authentication, validation, persistence, and deployment security before using it with real users.

## Screenshots

Add screenshots or a short demo GIF here to showcase the dashboard, chatbot, notes generator, and quiz interface.

```md
![Dashboard](screenshots/dashboard.png)
![AI Chatbot](screenshots/chatbot.png)
![Smart Quiz](screenshots/quiz.png)
```

## Future Improvements

- Secure environment-based configuration for API credentials
- Deploy the frontend and backend for public access
- Add persistent user accounts and database-backed learning history
- Improve quiz generation, validation, and scoring
- Add personalized learning paths and progress analytics
- Enhance accessibility and multilingual support

## Hackathon Project

Built as a hackathon prototype to explore how generative AI can support students with interactive, AI-assisted learning tools.

## Contributors

Add the project contributors and their GitHub profiles here.

---

<p align="center">
  <b>Learn smarter. Practice consistently. Keep growing.</b>
</p>
