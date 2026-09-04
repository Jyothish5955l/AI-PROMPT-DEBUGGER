Yes. Your content is correct, but the structure can be cleaner and more professional. Also, you **don't need to repeat the setup commands twice**. Here's a polished, copy-paste-ready version:

````markdown
# 🚀 AI Prompt Debugger

AI Prompt Debugger is an AI-powered web application that analyzes, evaluates, and improves user prompts using the Groq API.

The application helps users identify problems in their prompts, provides a quality score, generates an improved version, explains why it is better, and allows the improved prompt to be executed to generate an AI response.

## ✨ Features

- 🎯 Prompt quality scoring
- ⚠️ Automatic issue detection
- 🚀 AI-generated improved prompts
- 💡 Explanation of prompt improvements
- ⚡ Execute improved prompts
- 📋 Copy improved prompts
- 🕘 Prompt history
- 🔍 Search prompt history
- 🗑️ Delete individual history items
- 🧹 Clear complete history
- 💾 LocalStorage-based history
- ⚡ FastAPI backend
- 🤖 Groq LLM integration

---

# 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- python-dotenv

### AI
- Groq API
- `openai/gpt-oss-120b`

---

# 📂 Project Structure

```text
AI-PROMPT-DEBUGGER/
│
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
````

> `.env` and `venv` are not included in the GitHub repository. They must be created locally when setting up the project.

---

# ⚙️ How to Run the Project

## 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Jyothish5955l/AI-PROMPT-DEBUGGER.git
```

Then enter the project directory:

```bash
cd AI-PROMPT-DEBUGGER
```

---

## 2. Create a Virtual Environment

Create the Python virtual environment:

### Windows

```powershell
python -m venv backend\venv
```

Activate it:

```powershell
backend\venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv backend/venv
```

Activate it:

```bash
source backend/venv/bin/activate
```

After activation, you should see:

```text
(venv)
```

in your terminal.

---

## 3. Install Backend Dependencies

Move into the backend folder:

```bash
cd backend
```

Install the required packages:

```bash
pip install fastapi uvicorn groq python-dotenv pydantic
```

If your repository contains `requirements.txt`, you can instead run:

```bash
pip install -r requirements.txt
```

---

# 🔑 4. Configure the Groq API Key

Inside the `backend` folder, create a file named:

```text
.env
```

Your backend folder should look like:

```text
backend/
│
├── app/
│   └── main.py
│
├── .env
└── requirements.txt
```

Open `.env` and add:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Example:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxx
```

You can get your API key from the Groq developer console.

### ⚠️ Important

Never upload your real API key to GitHub.

Make sure `.env` is included in `.gitignore`.

---

# ▶️ 5. Start the Backend

Make sure you are inside the `backend` folder:

```bash
cd backend
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

If everything is working correctly, you should see:

```text
Uvicorn running on http://127.0.0.1:8000
```

Keep this terminal running.

---

# 🧪 6. Test the Backend

Open your browser and visit:

```text
http://127.0.0.1:8000
```

You should see:

```json
{
  "message": "Prompt Debugger API is running",
  "status": "ok"
}
```

You can also access the FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🌐 7. Start the Frontend

Open a **new terminal**.

Go to the frontend folder:

```bash
cd AI-PROMPT-DEBUGGER/frontend
```

Start the frontend server:

```bash
python -m http.server 5500
```

You should see something similar to:

```text
Serving HTTP on :: port 5500
```

Keep this terminal running.

---

# 🖥️ 8. Open the Application

Open your browser and visit:

```text
http://127.0.0.1:5500
```

The AI Prompt Debugger application should now be running.

---

# 🖥️ Running Both Servers

You need **two terminals** running at the same time.

### Terminal 1 — Backend

```powershell
cd AI-PROMPT-DEBUGGER\backend
backend\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Terminal 2 — Frontend

```powershell
cd AI-PROMPT-DEBUGGER\frontend
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

---

# 🔄 How It Works

```text
User enters a prompt
        ↓
Click "Analyze Prompt"
        ↓
Frontend sends request
        ↓
FastAPI Backend
        ↓
Groq AI
        ↓
Prompt Analysis
        ↓
Score + Issues + Improved Prompt
        ↓
User reviews improved prompt
        ↓
Click "Run Improved Prompt"
        ↓
Groq AI generates response
        ↓
AI Response displayed
```

---

# 🧠 Example

### Original Prompt

```text
Explain AI
```

### AI Analysis

```text
Score: 2/10
```

### Issues

```text
⚠️ The prompt is too vague
⚠️ No target audience is specified
⚠️ No desired format is specified
⚠️ No context or purpose is provided
```

### Improved Prompt

```text
Explain artificial intelligence to a beginner using simple language.
Include two real-world examples and briefly explain how machine
learning is related to AI.
```

The improved prompt can then be executed to generate the final AI response.

---

# 🕘 Prompt History

The application stores prompt history using browser `LocalStorage`.

Stored information includes:

* Original prompt
* Prompt score
* Detected issues
* Improved prompt
* Improvement explanation
* Generated AI response
* Timestamp

No external database is required for the current version.

---

# 🔐 Security

The Groq API key is loaded from the `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Do not place the API key directly inside your Python or JavaScript files.

The following files/folders should remain local:

```text
.env
venv/
```

---

# 🚨 Common Errors

## `Could not import module "main"`

If your project structure is:

```text
backend/
└── app/
    └── main.py
```

make sure you are inside the `backend` directory and run:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## `GROQ_API_KEY is not set`

Check that:

```text
backend/.env
```

exists and contains:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Restart the backend after creating or changing the `.env` file.

---

## Frontend Cannot Connect to Backend

Make sure the backend is running:

```bash
uvicorn app.main:app --reload --port 8000
```

Then check:

```text
http://127.0.0.1:8000
```

If the backend is working, make sure the frontend API URL is:

```javascript
const API_URL = "http://127.0.0.1:8000";
```

---

# 🚀 Future Improvements

* 🌐 ChatGPT integration
* 🌐 Gemini integration
* 🌐 Claude integration
* 🧩 Browser extension
* 🤖 Multiple AI model support
* 👤 User authentication
* ☁️ Cloud-based history
* 🗄️ Database integration
* 📊 Prompt analytics
* 📤 Export conversations
* 📄 Prompt templates
* 🔄 Prompt versioning
* 🧪 Prompt comparison

---

# 👨‍💻 Author

**Jyothish Goud**

GitHub:

[https://github.com/Jyothish5955l/AI-PROMPT-DEBUGGER](https://github.com/Jyothish5955l/AI-PROMPT-DEBUGGER)

---

<p align="center">

### 🚀 AI Prompt Debugger

**Analyze → Improve → Execute → Get Better AI Results**

</p>
```

