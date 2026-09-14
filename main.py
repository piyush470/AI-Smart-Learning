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

# 🔴 ADD MULTIPLE GROQ KEYS HERE
groq_keys = [
    "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",
    "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",
    "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"
]
# Create clients for each key
groq_clients = [Groq(api_key=key) for key in groq_keys]


class Query(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "Server is running 🚀"}


# 🔥 MAIN API WITH FALLBACK
@app.post("/ask")
def ask_ai(query: Query):

    # Try each Groq key
    for i, client in enumerate(groq_clients):
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": query.question}]
            )

            return {
                "answer": response.choices[0].message.content,
                "provider": f"Groq Key {i+1}"
            }

        except Exception as e:
            print(f"Groq Key {i+1} failed:", e)

    # ❌ If all keys fail
    return {
        "error": "All Groq API keys failed ❌"
    }