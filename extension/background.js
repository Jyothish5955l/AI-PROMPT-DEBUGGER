// ======================================================
// PROMPT DEBUGGER - BACKGROUND SERVICE WORKER
// ======================================================

const AI_TOOLS = {

    chatgpt: {
        url: "https://chatgpt.com/"
    },

    gemini: {
        url: "https://gemini.google.com/"
    },

    claude: {
        url: "https://claude.ai/"
    }

};


// ======================================================
// RECEIVE MESSAGE FROM PROMPT DEBUGGER
// ======================================================

chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) => {

        console.log(
            "Message received:",
            message
        );


        if (
            !message ||
            message.action !== "RUN_PROMPT"
        ) {

            sendResponse({
                success: false,
                error: "Invalid request."
            });

            return;
        }


        const tool =
            message.tool;


        const prompt =
            message.prompt;


        if (!tool || !AI_TOOLS[tool]) {

            sendResponse({
                success: false,
                error: "Unsupported AI tool."
            });

            return;
        }


        if (!prompt || !prompt.trim()) {

            sendResponse({
                success: false,
                error: "Prompt is empty."
            });

            return;
        }


        openAITool(
            tool,
            prompt.trim()
        );


        sendResponse({
            success: true,
            message:
                `Opening ${tool}...`
        });


        return true;

    }
);


// ======================================================
// OPEN AI WEBSITE
// ======================================================

async function openAITool(
    tool,
    prompt
) {

    const aiTool =
        AI_TOOLS[tool];


    if (!aiTool) {
        return;
    }


    try {

        const tab =
            await chrome.tabs.create({

                url: aiTool.url,

                active: true

            });


        console.log(
            `${tool} opened.`,
            tab.id
        );


        // Wait for page to load

        waitForPageAndSend(
            tab.id,
            tool,
            prompt
        );


    } catch (error) {

        console.error(
            "Failed to open AI tool:",
            error
        );

    }
}


// ======================================================
// WAIT FOR PAGE
// ======================================================

function waitForPageAndSend(
    tabId,
    tool,
    prompt
) {

    let attempts = 0;

    const maxAttempts = 30;


    const interval =
        setInterval(async () => {

            attempts++;


            try {

                const tab =
                    await chrome.tabs.get(
                        tabId
                    );


                console.log(
                    `${tool} loading...`,
                    attempts,
                    tab.status
                );


                if (
                    tab.status === "complete"
                ) {

                    clearInterval(
                        interval
                    );


                    // Give SPA frameworks
                    // extra time to render

                    setTimeout(() => {

                        sendPromptToTab(
                            tabId,
                            tool,
                            prompt
                        );

                    }, 1500);

                    return;
                }


                if (
                    attempts >= maxAttempts
                ) {

                    clearInterval(
                        interval
                    );


                    console.error(
                        `${tool} page did not finish loading.`
                    );

                }


            } catch (error) {

                clearInterval(
                    interval
                );

                console.error(
                    error
                );

            }

        }, 1000);

}


// ======================================================
// SEND PROMPT TO CONTENT SCRIPT
// ======================================================

async function sendPromptToTab(
    tabId,
    tool,
    prompt
) {

    try {

        await chrome.tabs.sendMessage(

            tabId,

            {

                action: "INSERT_AND_SEND",

                tool: tool,

                prompt: prompt

            }

        );


        console.log(
            `Prompt sent to ${tool} content script.`
        );


    } catch (error) {

        console.error(
            `Could not communicate with ${tool}:`,
            error
        );

    }

}


// ======================================================
// TAB UPDATE FALLBACK
// ======================================================

chrome.tabs.onUpdated.addListener(

    async (
        tabId,
        changeInfo,
        tab
    ) => {

        if (
            changeInfo.status !==
            "complete"
        ) {
            return;
        }


        console.log(
            "Tab finished loading:",
            tab.url
        );

    }

);