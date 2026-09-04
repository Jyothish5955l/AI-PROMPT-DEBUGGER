from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json


# ======================================================
# ENVIRONMENT
# ======================================================

load_dotenv()


# ======================================================
# FASTAPI
# ======================================================

app = FastAPI(
    title="Prompt Debugger API",
    version="1.0.0"
)


# ======================================================
# CORS
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# GROQ
# ======================================================

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("WARNING: GROQ_API_KEY is not set.")

client = Groq(
    api_key=api_key
)

MODEL = "openai/gpt-oss-120b"


# ======================================================
# REQUEST MODEL
# ======================================================

class PromptRequest(BaseModel):

    prompt: str


# ======================================================
# ROOT
# ======================================================

@app.get("/")
def root():

    return {
        "message": "Prompt Debugger API is running",
        "status": "ok"
    }


# ======================================================
# ANALYZE PROMPT
# ======================================================

@app.post("/analyze")
def analyze_prompt(
    request: PromptRequest
):

    prompt = request.prompt.strip()

    if not prompt:

        return {
            "error": "Please enter a prompt."
        }


    system_prompt = """
You are an expert prompt engineer.

Analyze the user's prompt and return ONLY valid JSON.

The JSON must contain exactly these fields:

{
    "score": 0,
    "issues": [],
    "improved_prompt": "",
    "explanation": ""
}

Rules:

- score must be an integer from 1 to 10.
- issues must be an array of specific problems.
- improved_prompt must be a substantially better version of the original prompt.
- explanation must briefly explain why the improved prompt is better.
- Do not use Markdown.
- Do not include ```json.
- Return ONLY JSON.
"""


    try:

        response = client.chat.completions.create(

            model=MODEL,

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2
        )


        content = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )


        result = json.loads(content)


        return {

            "score":
                result.get(
                    "score",
                    1
                ),

            "issues":
                result.get(
                    "issues",
                    []
                ),

            "improved_prompt":
                result.get(
                    "improved_prompt",
                    ""
                ),

            "explanation":
                result.get(
                    "explanation",
                    ""
                )

        }


    except json.JSONDecodeError:

        return {

            "error":
                "AI returned an invalid JSON response.",

            "raw_response":
                content

        }


    except Exception as e:

        return {

            "error":
                str(e)

        }


# ======================================================
# EXECUTE PROMPT
# ======================================================

@app.post("/execute")
def execute_prompt(
    request: PromptRequest
):

    prompt = request.prompt.strip()


    if not prompt:

        return {

            "error":
                "Please provide a prompt."

        }


    try:

        response = client.chat.completions.create(

            model=MODEL,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.7

        )


        answer = (
            response
            .choices[0]
            .message
            .content
        )


        return {

            "answer":
                answer

        }


    except Exception as e:

        return {

            "error":
                str(e)

        }