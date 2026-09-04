def build_prompt(user_prompt):
    return f"""
You are an expert prompt engineer.

Analyze the prompt and respond STRICTLY in JSON.

Schema:
{{
  "issues": ["..."],
  "basic_fix": "...",
  "structured_prompt": "...",
  "expert_prompt": "...",
  "explanation": "...",
  "score": 0,
  "prompt_type": "..."
}}

Prompt:
"{user_prompt}"
"""