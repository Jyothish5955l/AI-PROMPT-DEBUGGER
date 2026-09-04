// ======================================================
// PROMPT DEBUGGER - CONTENT SCRIPT
// ChatGPT + Gemini + Claude
// ======================================================

console.log("Prompt Debugger content script loaded.");


// ======================================================
// RECEIVE PROMPT FROM BACKGROUND
// ======================================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        console.log(
            "Prompt Debugger message:",
            message
        );

        if (
            !message ||
            message.action !== "INSERT_AND_SEND"
        ) {
            return;
        }

        const tool = message.tool;
        const prompt = message.prompt;

        if (!prompt) {
            console.error("Prompt is empty.");
            return;
        }

        insertAndSend(tool, prompt);

        sendResponse({
            success: true
        });

        return true;
    }
);


// ======================================================
// MAIN FUNCTION
// ======================================================

async function insertAndSend(tool, prompt) {

    console.log(
        "Starting automation:",
        tool
    );

    console.log(
        "Prompt:",
        prompt
    );


    let input = null;


    // --------------------------------------------------
    // FIND TEXTBOX
    // --------------------------------------------------

    input = await waitForInput(tool);


    if (!input) {

        console.error(
            `${tool}: Could not find prompt textbox.`
        );

        showNotification(
            "❌ Could not find AI prompt textbox."
        );

        return;
    }


    console.log(
        `${tool}: Textbox found.`,
        input
    );


    // --------------------------------------------------
    // INSERT PROMPT
    // --------------------------------------------------

    const inserted =
        setInputValue(
            input,
            prompt
        );


    if (!inserted) {

        console.error(
            `${tool}: Failed to insert prompt.`
        );

        showNotification(
            "❌ Could not insert prompt."
        );

        return;
    }


    console.log(
        `${tool}: Prompt inserted.`
    );


    // Give React/Vue/etc. time to update

    await sleep(800);


    // --------------------------------------------------
    // FIND SEND BUTTON
    // --------------------------------------------------

    const sendButton =
        await waitForSendButton(tool);


    if (!sendButton) {

        console.error(
            `${tool}: Send button not found.`
        );

        showNotification(
            "⚠️ Prompt inserted. Please click Send manually."
        );

        return;
    }


    console.log(
        `${tool}: Send button found.`,
        sendButton
    );


    // --------------------------------------------------
    // CLICK SEND
    // --------------------------------------------------

    sendButton.click();


    console.log(
        `${tool}: Prompt sent successfully.`
    );


    showNotification(
        `✅ Prompt sent to ${capitalize(tool)}`
    );
}


// ======================================================
// WAIT FOR INPUT
// ======================================================

async function waitForInput(tool) {

    const maxAttempts = 40;


    for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
    ) {

        const input =
            findInput(tool);


        if (input) {
            return input;
        }


        await sleep(500);
    }


    return null;
}


// ======================================================
// FIND INPUT
// ======================================================

function findInput(tool) {


    // ==================================================
    // CHATGPT
    // ==================================================

    if (tool === "chatgpt") {

        const selectors = [

            "#prompt-textarea",

            "div[contenteditable='true']",

            "textarea"

        ];


        for (const selector of selectors) {

            const element =
                document.querySelector(
                    selector
                );


            if (
                element &&
                isVisible(element)
            ) {

                return element;

            }
        }
    }


    // ==================================================
    // GEMINI
    // ==================================================

    if (tool === "gemini") {

        const selectors = [

            "rich-textarea",

            "div[contenteditable='true']",

            "textarea"

        ];


        for (const selector of selectors) {

            const element =
                document.querySelector(
                    selector
                );


            if (
                element &&
                isVisible(element)
            ) {

                return element;

            }
        }
    }


    // ==================================================
    // CLAUDE
    // ==================================================

    if (tool === "claude") {

        const selectors = [

            "div[contenteditable='true']",

            "textarea"

        ];


        for (const selector of selectors) {

            const element =
                document.querySelector(
                    selector
                );


            if (
                element &&
                isVisible(element)
            ) {

                return element;

            }
        }
    }


    // ==================================================
    // GENERIC FALLBACK
    // ==================================================

    const elements =
        document.querySelectorAll(
            "textarea, div[contenteditable='true']"
        );


    for (const element of elements) {

        if (
            isVisible(element) &&
            !element.disabled &&
            !element.readOnly
        ) {

            return element;

        }

    }


    return null;
}


// ======================================================
// INSERT VALUE
// ======================================================

function setInputValue(
    element,
    value
) {

    try {

        element.focus();


        // ==================================================
        // CONTENTEDITABLE
        // ==================================================

        if (
            element.isContentEditable ||
            element.getAttribute(
                "contenteditable"
            ) === "true"
        ) {

            element.innerHTML = "";


            const textNode =
                document.createTextNode(
                    value
                );


            element.appendChild(
                textNode
            );


            element.dispatchEvent(
                new InputEvent(
                    "input",
                    {
                        bubbles: true,
                        inputType:
                            "insertText",
                        data: value
                    }
                )
            );


            element.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );


            return true;
        }


        // ==================================================
        // TEXTAREA / INPUT
        // ==================================================

        const prototype =
            Object.getPrototypeOf(
                element
            );


        const descriptor =
            Object.getOwnPropertyDescriptor(
                prototype,
                "value"
            );


        if (
            descriptor &&
            descriptor.set
        ) {

            descriptor.set.call(
                element,
                value
            );

        } else {

            element.value = value;

        }


        element.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );


        element.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );


        return true;


    } catch (error) {

        console.error(
            "Input insertion error:",
            error
        );

        return false;
    }
}


// ======================================================
// WAIT FOR SEND BUTTON
// ======================================================

async function waitForSendButton(tool) {

    const maxAttempts = 30;


    for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
    ) {

        const button =
            findSendButton(tool);


        if (
            button &&
            !button.disabled
        ) {

            return button;
        }


        await sleep(500);
    }


    return null;
}


// ======================================================
// FIND SEND BUTTON
// ======================================================

function findSendButton(tool) {


    // ==================================================
    // CHATGPT
    // ==================================================

    if (tool === "chatgpt") {

        const selectors = [

            "button[data-testid='send-button']",

            "button[aria-label*='Send']",

            "button[aria-label='Send prompt']"

        ];


        for (const selector of selectors) {

            const button =
                document.querySelector(
                    selector
                );


            if (
                button &&
                isVisible(button)
            ) {

                return button;
            }
        }
    }


    // ==================================================
    // GEMINI
    // ==================================================

    if (tool === "gemini") {

        const selectors = [

            "button[aria-label*='Send']",

            "button[aria-label*='send']",

            "button.send-button",

            "button"

        ];


        for (const selector of selectors) {

            const buttons =
                document.querySelectorAll(
                    selector
                );


            for (const button of buttons) {

                if (
                    isVisible(button) &&
                    !button.disabled
                ) {

                    const text =
                        (
                            button.innerText ||
                            button.getAttribute(
                                "aria-label"
                            ) ||
                            ""
                        ).toLowerCase();


                    if (
                        text.includes("send") ||
                        text.includes("submit")
                    ) {

                        return button;
                    }
                }
            }
        }
    }


    // ==================================================
    // CLAUDE
    // ==================================================

    if (tool === "claude") {

        const selectors = [

            "button[aria-label*='Send']",

            "button[aria-label*='send']",

            "button[type='submit']"

        ];


        for (const selector of selectors) {

            const button =
                document.querySelector(
                    selector
                );


            if (
                button &&
                isVisible(button)
            ) {

                return button;
            }
        }
    }


    // ==================================================
    // GENERIC FALLBACK
    // ==================================================

    const buttons =
        document.querySelectorAll(
            "button"
        );


    for (const button of buttons) {

        if (
            !isVisible(button) ||
            button.disabled
        ) {
            continue;
        }


        const text = (

            button.innerText ||

            button.getAttribute(
                "aria-label"
            ) ||

            button.getAttribute(
                "title"
            ) ||

            ""

        ).toLowerCase();


        if (
            text === "send" ||
            text.includes("send message") ||
            text.includes("send prompt")
        ) {

            return button;
        }
    }


    return null;
}


// ======================================================
// VISIBILITY CHECK
// ======================================================

function isVisible(element) {

    if (!element) {
        return false;
    }


    const style =
        window.getComputedStyle(
            element
        );


    const rect =
        element.getBoundingClientRect();


    return (

        style.display !== "none" &&

        style.visibility !== "hidden" &&

        rect.width > 0 &&

        rect.height > 0

    );
}


// ======================================================
// NOTIFICATION
// ======================================================

function showNotification(message) {

    const existing =
        document.getElementById(
            "prompt-debugger-notification"
        );


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement(
            "div"
        );


    notification.id =
        "prompt-debugger-notification";


    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.top =
        "20px";

    notification.style.right =
        "20px";

    notification.style.zIndex =
        "999999";

    notification.style.padding =
        "12px 18px";

    notification.style.background =
        "#1e293b";

    notification.style.color =
        "#ffffff";

    notification.style.border =
        "1px solid #475569";

    notification.style.borderRadius =
        "8px";

    notification.style.fontFamily =
        "Arial, sans-serif";

    notification.style.fontSize =
        "14px";

    notification.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.3)";


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.remove();

    }, 3000);
}


// ======================================================
// HELPERS
// ======================================================

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


function capitalize(text) {

    return text
        .charAt(0)
        .toUpperCase() +
        text.slice(1);
}