# 🚀 AI Prompt Debugger

AI Prompt Debugger is a web-based application that uses AI to analyze and improve user prompts.

The application takes a prompt such as:

`Explain AI`

and analyzes its quality by providing:

- 🎯 Prompt Score
- ⚠️ Issues Found
- 🚀 Improved Prompt
- 💡 Explanation of Improvements
- 🤖 AI-generated response using the improved prompt
- 🕘 Local prompt history using browser LocalStorage

## 🛠️ Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Python, FastAPI, Uvicorn
- AI: Groq API
- Model: `openai/gpt-oss-120b`
- Storage: Browser LocalStorage

---

# ⚙️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/Jyothish5955l/AI-PROMPT-DEBUGGER.git
cd AI-PROMPT-DEBUGGER
2. Create Virtual Environment

From the project folder:

Windows
python -m venv backend\venv
backend\venv\Scripts\activate
macOS/Linux
python3 -m venv backend/venv
source backend/venv/bin/activate
3. Install Backend Dependencies

Go to the backend:

cd backend

Install the required packages:

pip install fastapi uvicorn groq python-dotenv pydantic
4. Add Groq API Key

Inside the backend folder, create a file named:

.env

Add your Groq API key:

GROQ_API_KEY=your_groq_api_key_here

Example:

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxx

Do not upload the .env file to GitHub.

5. Start the Backend

Make sure you are inside the backend folder:

uvicorn app.main:app --reload --port 8000

If successful, you should see:

Uvicorn running on http://127.0.0.1:8000

You can test the backend by opening:

http://127.0.0.1:8000

You should see:

{
  "message": "Prompt Debugger API is running",
  "status": "ok"
}
6. Start the Frontend

Open a new terminal.

Go to the frontend folder:

cd AI-PROMPT-DEBUGGER/frontend

Run:

python -m http.server 5500

Then open the application in your browser:

http://127.0.0.1:5500
▶️ Run Both Terminals
Terminal 1 — Backend
cd AI-PROMPT-DEBUGGER\backend
backend\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
Terminal 2 — Frontend
cd AI-PROMPT-DEBUGGER\frontend
python -m http.server 5500

Then open:

http://127.0.0.1:5500
🔄 How It Works
User enters prompt
        ↓
Click "Analyze Prompt"
        ↓
FastAPI Backend
        ↓
Groq AI
        ↓
Prompt Analysis
        ↓
Score + Issues + Improved Prompt
        ↓
Run Improved Prompt
        ↓
AI Generated Response

The project keeps prompt history locally in the browser, so no database is required.

🔐 Important

The following should not be uploaded to GitHub:

.env
venv/

Create your own .env and virtual environment when running the project.

👨‍💻 Author

Jyothish Goud

GitHub: https://github.com/Jyothish5955l/AI-PROMPT-DEBUGGER
