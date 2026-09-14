from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
groq_api_key = os.getenv("GROQ_API_KEY")

groq_clients = [Groq(api_key=key) for key in groq_keys]


class Query(BaseModel):
    question: str
    source: str = "chat"


@app.get("/")
def home():
    return {"message": "Server is running 🚀"}


@app.post("/ask")
def ask_ai(query: Query):

    question = query.question
    source = query.source

    # 🔥 SMART EDUCATIONAL REDIRECTION
    if source == "dashboard":
        prompt = f"""
        You are an intelligent educational assistant.

        Rules:
        - Always respond in an educational way.
        - If the question is study-related → answer normally.
        - If NOT → convert it into a learning response.

        Examples:
        - Movies → suggest educational, motivational, biography movies
        - Games → suggest logic or learning games
        - Celebrities → explain achievements and lessons

        Never reject the user.
        Always guide toward learning.

        Question: {question}
        """
    else:
        prompt = question  # normal chatbot

    # 🔁 TRY MULTIPLE KEYS
    for i, client in enumerate(groq_clients):
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}]
            )

            return {
                "answer": response.choices[0].message.content,
                "provider": f"Groq Key {i+1}"
            }

        except Exception as e:
            print(f"Groq Key {i+1} failed:", e)

    return {
        "error": "All Groq API keys failed ❌"
    }