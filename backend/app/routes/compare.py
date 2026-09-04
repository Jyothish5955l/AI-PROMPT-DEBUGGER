from fastapi import APIRouter
from app.models.request_models import CompareRequest
from app.services.llm_service import call_llm

router = APIRouter()

@router.post("/compare")
async def compare(data: CompareRequest):
    original_output = call_llm(data.original)
    improved_output = call_llm(data.improved)

    return {
        "original_output": original_output,
        "improved_output": improved_output
    }