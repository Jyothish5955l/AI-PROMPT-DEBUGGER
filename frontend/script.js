const API_URL = "http://127.0.0.1:8000";

const EXTENSION_ID = "gjfhcibgblkncnbeckmpgconfjfhaopc";


// ======================================================
// SIDEBAR
// ======================================================

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}


// ======================================================
// ANALYZE PROMPT
// ======================================================

async function analyze() {

    const promptElement = document.getElementById("prompt");
    const output = document.getElementById("output");

    if (!promptElement || !output) {
        console.error("Prompt or output element not found.");
        return;
    }

    const prompt = promptElement.value.trim();

    if (!prompt) {

        output.innerHTML = `
            <div class="card error-card">
                ⚠️ Please enter a prompt first.
            </div>
        `;

        return;
    }


    output.innerHTML = `
        <div class="card loading-card">
            <div class="loading">
                🧠 Analyzing your prompt...
            </div>
        </div>
    `;


    try {

        const response = await fetch(`${API_URL}/analyze`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: prompt
            })

        });


        const data = await response.json();

        console.log("Analyze response:", data);


        if (!response.ok || data.error) {

            output.innerHTML = `
                <div class="card error-card">
                    ❌ ${escapeHtml(data.error || "Analysis failed")}
                </div>
            `;

            return;
        }


        showAnalysis(data);


        // Save history

        saveHistory({

            original_prompt: prompt,

            score: data.score,

            issues: data.issues,

            improved_prompt: data.improved_prompt,

            explanation: data.explanation

        });


    } catch (error) {

        console.error(error);

        output.innerHTML = `
            <div class="card error-card">

                ❌ Error connecting to backend.

                <br><br>

                Make sure FastAPI is running on port 8000.

            </div>
        `;
    }
}


// ======================================================
// SHOW ANALYSIS
// ======================================================

function showAnalysis(data) {

    const output = document.getElementById("output");

    const issues = Array.isArray(data.issues)
        ? data.issues
        : [];


    let issueHTML = "";


    if (issues.length > 0) {

        issueHTML = issues.map(issue => `

            <div class="issue">

                <span class="issue-icon">
                    ⚠️
                </span>

                <span>
                    ${escapeHtml(issue)}
                </span>

            </div>

        `).join("");

    } else {

        issueHTML = `

            <div class="issue success-issue">

                <span>✅</span>

                <span>
                    No major issues detected.
                </span>

            </div>

        `;
    }


    output.innerHTML = `

        <div class="results-container">


            <!-- SCORE -->

            <div class="card score-card">

                <div class="card-title">
                    🎯 Prompt Score
                </div>

                <div class="score">
                    ${escapeHtml(data.score)}/10
                </div>

                <div class="score-label">
                    Prompt quality
                </div>

            </div>


            <!-- ISSUES -->

            <div class="card issues-card">

                <div class="card-title">
                    ⚠️ Issues Found
                </div>

                <div class="issues">

                    ${issueHTML}

                </div>

            </div>


            <!-- IMPROVED PROMPT -->

            <div class="card improved-card">

                <div class="card-title">
                    🚀 Improved Prompt
                </div>


                <div
                    id="improvedPrompt"
                    class="improved-prompt"
                >
                    ${escapeHtml(data.improved_prompt)}
                </div>


                <!-- ACTION BUTTONS -->

                <div class="action-buttons">


                    <!-- RUN INSIDE YOUR APP -->

                    <button
                        class="run-btn"
                        onclick="runImprovedPrompt()"
                    >
                        ⚡ Run Here
                    </button>


                    <!-- CHATGPT -->

                    <button
                        class="ai-tool-btn chatgpt-btn"
                        onclick="runInAI('chatgpt')"
                    >
                        🤖 Run in ChatGPT
                    </button>


                    <!-- GEMINI -->

                    <button
                        class="ai-tool-btn gemini-btn"
                        onclick="runInAI('gemini')"
                    >
                        ✨ Run in Gemini
                    </button>


                    <!-- CLAUDE -->

                    <button
                        class="ai-tool-btn claude-btn"
                        onclick="runInAI('claude')"
                    >
                        🧠 Run in Claude
                    </button>


                    <!-- COPY -->

                    <button
                        class="copy-btn"
                        onclick="copyImprovedPrompt()"
                    >
                        📋 Copy
                    </button>


                </div>

            </div>


            <!-- EXPLANATION -->

            <div class="card explanation-card">

                <div class="card-title">
                    💡 Why This Is Better
                </div>

                <div class="explanation">
                    ${escapeHtml(data.explanation)}
                </div>

            </div>


            <!-- AI RESPONSE -->

            <div
                id="ai-response"
                class="card response-card"
                style="display: none;"
            >

                <div class="card-title">
                    🤖 AI Response
                </div>

                <div
                    id="response-content"
                    class="ai-answer"
                >
                </div>

            </div>


        </div>
    `;
}


// ======================================================
// RUN IMPROVED PROMPT INSIDE YOUR APP
// ======================================================

async function runImprovedPrompt() {

    const promptElement =
        document.getElementById("improvedPrompt");

    const responseCard =
        document.getElementById("ai-response");

    const responseContent =
        document.getElementById("response-content");


    if (!promptElement) {

        alert("Improved prompt not found.");

        return;
    }


    const improvedPrompt =
        promptElement.innerText.trim();


    if (!improvedPrompt) {

        alert("Improved prompt is empty.");

        return;
    }


    responseCard.style.display = "block";


    responseContent.innerHTML = `

        <div class="loading">
            ⚡ Running improved prompt...
        </div>

    `;


    responseCard.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    try {

        const response = await fetch(

            `${API_URL}/execute`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    prompt: improvedPrompt

                })

            }

        );


        const data = await response.json();


        console.log(
            "Execute response:",
            data
        );


        if (!response.ok || data.error) {

            responseContent.innerHTML = `

                <div class="error-card">

                    ❌ ${escapeHtml(
                        data.error ||
                        "Failed to execute prompt"
                    )}

                </div>

            `;

            return;
        }


        responseContent.innerHTML = `

            <div class="answer-header">
                ✨ Generated Answer
            </div>

            <div class="answer-text">
                ${formatAnswer(data.answer)}
            </div>

        `;


        updateLatestHistory(data.answer);


    } catch (error) {

        console.error(error);


        responseContent.innerHTML = `

            <div class="error-card">

                ❌ Error connecting to backend.

                <br><br>

                Check that FastAPI is running.

            </div>

        `;
    }
}


// ======================================================
// RUN PROMPT IN EXTERNAL AI TOOL
// ======================================================

function runInAI(tool) {

    const improvedPromptElement =
        document.getElementById("improvedPrompt");


    if (!improvedPromptElement) {

        alert("Improved prompt not found.");

        return;
    }


    const improvedPrompt =
        improvedPromptElement.innerText.trim();


    if (!improvedPrompt) {

        alert("Improved prompt is empty.");

        return;
    }


    console.log(
        "Sending prompt to extension:",
        tool
    );


    // Check whether Chrome extension API is available

    if (
        typeof chrome === "undefined" ||
        !chrome.runtime ||
        !chrome.runtime.sendMessage
    ) {

        alert(
            "Prompt Debugger extension is not available.\n\n" +
            "Please make sure the Chrome extension is installed and enabled."
        );

        return;
    }


    // Send prompt to extension

    chrome.runtime.sendMessage(

        EXTENSION_ID,

        {

            action: "RUN_PROMPT",

            tool: tool,

            prompt: improvedPrompt

        },

        function (response) {

            if (chrome.runtime.lastError) {

                console.error(
                    chrome.runtime.lastError
                );

                alert(
                    "Could not connect to Prompt Debugger extension.\n\n" +
                    "Make sure the extension is installed and enabled."
                );

                return;
            }


            console.log(
                "Extension response:",
                response
            );

        }

    );
}


// ======================================================
// COPY IMPROVED PROMPT
// ======================================================

async function copyImprovedPrompt() {

    const element =
        document.getElementById("improvedPrompt");


    if (!element) {
        return;
    }


    const prompt =
        element.innerText.trim();


    try {

        await navigator.clipboard.writeText(prompt);


        const button =
            document.querySelector(".copy-btn");


        if (button) {

            const originalText =
                button.innerHTML;


            button.innerHTML =
                "✅ Copied!";


            setTimeout(() => {

                button.innerHTML =
                    originalText;

            }, 1500);

        }


    } catch (error) {

        alert(
            "Unable to copy prompt."
        );

    }
}


// ======================================================
// NEW CHAT
// ======================================================

function newChat() {

    const prompt =
        document.getElementById("prompt");


    const output =
        document.getElementById("output");


    if (prompt) {

        prompt.value = "";

    }


    if (output) {

        output.innerHTML = "";

    }


    const characterCount =
        document.getElementById("characterCount");


    if (characterCount) {

        characterCount.textContent =
            "0 characters";

    }
}


// ======================================================
// HISTORY
// ======================================================

function getHistory() {

    try {

        return JSON.parse(

            localStorage.getItem(
                "promptDebuggerHistory"
            )

        ) || [];


    } catch {

        return [];

    }
}


// ======================================================
// SAVE HISTORY
// ======================================================

function saveHistory(item) {

    const history =
        getHistory();


    history.unshift({

        id: Date.now(),

        original_prompt:
            item.original_prompt,

        score:
            item.score,

        issues:
            item.issues,

        improved_prompt:
            item.improved_prompt,

        explanation:
            item.explanation,

        answer:
            "",

        timestamp:
            new Date().toLocaleString()

    });


    const limitedHistory =
        history.slice(0, 50);


    localStorage.setItem(

        "promptDebuggerHistory",

        JSON.stringify(
            limitedHistory
        )

    );


    renderHistory();
}


// ======================================================
// UPDATE LATEST HISTORY
// ======================================================

function updateLatestHistory(answer) {

    const history =
        getHistory();


    if (history.length === 0) {
        return;
    }


    history[0].answer =
        answer;


    localStorage.setItem(

        "promptDebuggerHistory",

        JSON.stringify(history)

    );


    renderHistory();
}


// ======================================================
// RENDER HISTORY
// ======================================================

function renderHistory(searchTerm = "") {

    const historyContainer =
        document.getElementById("history");


    if (!historyContainer) {
        return;
    }


    let history =
        getHistory();


    if (searchTerm.trim()) {

        const search =
            searchTerm.toLowerCase();


        history =
            history.filter(item => {

                return (

                    item.original_prompt
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.improved_prompt
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    if (history.length === 0) {

        historyContainer.innerHTML = `

            <div class="empty-history">

                💬 No conversations found.

            </div>

        `;

        return;
    }


    historyContainer.innerHTML =

        history.map(item => `

            <div
                class="history-item"
                data-id="${item.id}"
            >


                <div
                    class="history-content"
                    onclick="loadHistory(${item.id})"
                >


                    <div class="history-title">

                        ${escapeHtml(

                            item.original_prompt
                                .substring(0, 35)

                        )}

                        ${
                            item.original_prompt.length > 35
                                ? "..."
                                : ""
                        }

                    </div>


                    <div class="history-meta">

                        Score:
                        ${escapeHtml(item.score)}/10

                    </div>


                </div>


                <button

                    class="delete-history-btn"

                    onclick="
                        deleteHistory(
                            ${item.id},
                            event
                        )
                    "

                    title="Delete chat"

                >

                    ✕

                </button>


            </div>

        `).join("");
}


// ======================================================
// SEARCH HISTORY
// ======================================================

function searchHistory() {

    const input =
        document.getElementById(
            "searchHistory"
        );


    if (!input) {
        return;
    }


    renderHistory(
        input.value
    );
}


// ======================================================
// LOAD HISTORY
// ======================================================

function loadHistory(id) {

    const history =
        getHistory();


    const item =
        history.find(
            chat => chat.id === id
        );


    if (!item) {
        return;
    }


    const prompt =
        document.getElementById(
            "prompt"
        );


    if (prompt) {

        prompt.value =
            item.original_prompt;

    }


    showAnalysis({

        score:
            item.score,

        issues:
            item.issues,

        improved_prompt:
            item.improved_prompt,

        explanation:
            item.explanation

    });


    if (item.answer) {

        const responseCard =
            document.getElementById(
                "ai-response"
            );


        const responseContent =
            document.getElementById(
                "response-content"
            );


        if (
            responseCard &&
            responseContent
        ) {

            responseCard.style.display =
                "block";


            responseContent.innerHTML = `

                <div class="answer-header">

                    ✨ Previous AI Response

                </div>


                <div class="answer-text">

                    ${formatAnswer(
                        item.answer
                    )}

                </div>

            `;

        }

    }
}


// ======================================================
// DELETE ONE HISTORY
// ======================================================

function deleteHistory(id, event) {

    if (event) {

        event.stopPropagation();

    }


    const confirmed =
        confirm(
            "Delete this conversation?"
        );


    if (!confirmed) {
        return;
    }


    let history =
        getHistory();


    history =
        history.filter(
            item => item.id !== id
        );


    localStorage.setItem(

        "promptDebuggerHistory",

        JSON.stringify(history)

    );


    renderHistory();
}


// ======================================================
// DELETE ALL HISTORY
// ======================================================

function clearAllHistory() {

    const history =
        getHistory();


    if (history.length === 0) {

        alert(
            "History is already empty."
        );

        return;
    }


    const confirmed =
        confirm(
            "Delete ALL chat history?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "promptDebuggerHistory"
    );


    renderHistory();
}


// ======================================================
// FORMAT ANSWER
// ======================================================

function formatAnswer(answer) {

    if (!answer) {
        return "";
    }


    return escapeHtml(answer)
        .replace(/\n/g, "<br>");
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================================
// STARTUP
// ======================================================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        renderHistory();

    }

);