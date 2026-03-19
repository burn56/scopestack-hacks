//////////////////////
// Developed By
//////////////////////
// Matt Urbano
// https://github.com/burn56

(function () {
    ////////////////////////////
    // URL Validation Block //
    ////////////////////////////

    const urlPattern = /^https:\/\/app\.scopestack\.io\/admin\/questionnaires\/(\d+)\/calculations\/(\d+)\/edit(?:\/)?$/;
    const match = window.location.href.match(urlPattern);

    if (!match) {
        return;
    }

    const questionnaireId = match[1];
    const addNewUrl = `https://app.scopestack.io/admin/questionnaires/${questionnaireId}/calculations/new`;

    //////////////////////////
    // Button Creation Block //
    //////////////////////////

    function createAddNewButton() {
        if (document.getElementById("scopestack-add-new-floating")) {
            return;
        }

        const submitButton = Array.from(document.querySelectorAll("button, input[type='submit']"))
            .find((element) => {
                const text = (element.innerText || element.value || "").trim().toLowerCase();
                return text === "submit";
            });

        if (!submitButton) {
            return;
        }

        const addNewButton = document.createElement("button");
        addNewButton.id = "scopestack-add-new-floating";
        addNewButton.type = "button";
        addNewButton.textContent = "Add New";

        addNewButton.style.display = "block";
        addNewButton.style.marginTop = "10px";
        addNewButton.style.backgroundColor = "#2b7a78";
        addNewButton.style.color = "#ffffff";
        addNewButton.style.border = "none";
        addNewButton.style.padding = "8px 16px";
        addNewButton.style.borderRadius = "4px";
        addNewButton.style.cursor = "pointer";
        addNewButton.style.fontSize = "14px";
        addNewButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

        addNewButton.addEventListener("click", function () {
            window.location.href = addNewUrl;
        });

        submitButton.insertAdjacentElement("afterend", addNewButton);
    }

    /////////////////////////////////
    // Retry / Dynamic Load Block //
    /////////////////////////////////

    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(() => {
        createAddNewButton();

        if (document.getElementById("scopestack-add-new-floating") || attempts >= maxAttempts) {
            clearInterval(interval);
        }

        attempts++;
    }, 500);
})();
//////////////////////////////
// Recommendation Button Block //
//////////////////////////////

(function () {

    const recPattern = /^https:\/\/app\.scopestack\.io\/admin\/questionnaires\/(\d+)\/recommendations\/(\d+)\/edit(?:\/)?$/;
    const recMatch = window.location.href.match(recPattern);

    if (!recMatch) {
        return;
    }

    const questionnaireId = recMatch[1];
    const addNewUrl = `https://app.scopestack.io/admin/questionnaires/${questionnaireId}/recommendations/new`;

    function createRecommendationButton() {

        if (document.getElementById("scopestack-add-new-rec")) {
            return;
        }

        const submitButton = Array.from(document.querySelectorAll("button, input[type='submit']"))
            .find((element) => {
                const text = (element.innerText || element.value || "").trim().toLowerCase();
                return text === "submit";
            });

        if (!submitButton) {
            return;
        }

        ////////////////////////////
        // Create Button
        ////////////////////////////

        const addButton = document.createElement("button");
        addButton.id = "scopestack-add-new-rec";
        addButton.type = "button";
        addButton.textContent = "Add New Recommendation";

        ////////////////////////////
        // Styling (inline right)
        ////////////////////////////

        addButton.style.marginLeft = "10px";
        addButton.style.backgroundColor = "#2b7a78";
        addButton.style.color = "#ffffff";
        addButton.style.border = "none";
        addButton.style.padding = "6px 14px";
        addButton.style.borderRadius = "4px";
        addButton.style.cursor = "pointer";
        addButton.style.fontSize = "13px";

        ////////////////////////////
        // Click Action
        ////////////////////////////

        addButton.addEventListener("click", function () {
            window.location.href = addNewUrl;
        });

        ////////////////////////////
        // Insert to the RIGHT
        ////////////////////////////

        submitButton.insertAdjacentElement("afterend", addButton);
    }

    /////////////////////////////////
    // Retry / Dynamic Load Block
    /////////////////////////////////

    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(() => {
        createRecommendationButton();

        if (document.getElementById("scopestack-add-new-rec") || attempts >= maxAttempts) {
            clearInterval(interval);
        }

        attempts++;
    }, 500);

})();