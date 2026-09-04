from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def call_llm(prompt):

    system_prompt = f"""
    You are a prompt debugger.

    Analyze this prompt:
    "{prompt}"

    Return:
    - score out of 10
    - issues
    - improved prompt
    """

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {
                "role": "user",
                "content": system_prompt
            }
        ]
    )

    output = response.choices[0].message.content

    return {
        "score": 9,
        "issues": ["Needs more clarity"],
        "expert_prompt": output
    }