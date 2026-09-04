from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str

class CompareRequest(BaseModel):
    original: str
    improved: str