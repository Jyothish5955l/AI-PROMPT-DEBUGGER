from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import call_llm

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/analyze")
async def analyze_prompt(data: PromptRequest):

    result = call_llm(data.prompt)

    return result