//////////////////////////////
// Developed By
//////////////////////////////
// Matt Urbano
// https://github.com/burn56

(function () {

    ////////////////////////////
    // Shared Utility Block //
    ////////////////////////////

    function getSubmitButton() {
        return Array.from(document.querySelectorAll("button, input[type='submit']")).find((element) => {
            const text = (element.innerText || element.value || "").trim().toLowerCase();
            return text === "submit";
        });
    }

    function getText(el) {
        return (el?.textContent || "").trim();
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    ////////////////////////////
    // Calculation Button Block //
    ////////////////////////////

    const calculationPattern = /^https:\/\/app\.scopestack\.io\/admin\/questionnaires\/(\d+)\/calculations\/(\d+)\/edit(?:\/)?$/;
    const calculationMatch = window.location.href.match(calculationPattern);

    function createCalculationButton() {
        if (!calculationMatch) {
            return;
        }

        if (document.getElementById("scopestack-add-new-floating")) {
            return;
        }

        const submitButton = getSubmitButton();
        if (!submitButton) {
            return;
        }

        const questionnaireId = calculationMatch[1];
        const addNewUrl = `https://app.scopestack.io/admin/questionnaires/${questionnaireId}/calculations/new`;

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

    //////////////////////////////
    // Recommendation Button Block //
    //////////////////////////////

    const recommendationPattern = /^https:\/\/app\.scopestack\.io\/admin\/questionnaires\/(\d+)\/recommendations\/(\d+)\/edit(?:\/)?$/;
    const recommendationMatch = window.location.href.match(recommendationPattern);

    function createRecommendationButton() {
        if (!recommendationMatch) {
            return;
        }

        if (document.getElementById("scopestack-add-new-rec")) {
            return;
        }

        const submitButton = getSubmitButton();
        if (!submitButton) {
            return;
        }

        const questionnaireId = recommendationMatch[1];
        const addNewUrl = `https://app.scopestack.io/admin/questionnaires/${questionnaireId}/recommendations/new`;

        const addButton = document.createElement("button");
        addButton.id = "scopestack-add-new-rec";
        addButton.type = "button";
        addButton.textContent = "Add New Recommendation";

        addButton.style.marginLeft = "10px";
        addButton.style.backgroundColor = "#2b7a78";
        addButton.style.color = "#ffffff";
        addButton.style.border = "none";
        addButton.style.padding = "6px 14px";
        addButton.style.borderRadius = "4px";
        addButton.style.cursor = "pointer";
        addButton.style.fontSize = "13px";

        addButton.addEventListener("click", function () {
            window.location.href = addNewUrl;
        });

        submitButton.insertAdjacentElement("afterend", addButton);
    }

    //////////////////////////////
    // Products Selection Block //
    //////////////////////////////

    const SELECT_BUTTON_ID = "scopestack-select-zero-price-products-button";
    const CLEAR_BUTTON_ID = "scopestack-clear-zero-price-products-button";
    const BUTTON_CONTAINER_ID = "scopestack-product-tools-container";
    const HIGHLIGHT_CLASS = "scopestack-zero-price-product-highlight";
    const PRODUCT_STYLE_ID = "scopestack-zero-price-products-style";

    function injectProductStyles() {
        if (document.getElementById(PRODUCT_STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");
        style.id = PRODUCT_STYLE_ID;
        style.textContent = `
            .${HIGHLIGHT_CLASS} {
                outline: 2px solid #b91c1c !important;
                background-color: rgba(185, 28, 28, 0.08) !important;
            }

            #${BUTTON_CONTAINER_ID} {
                position: absolute;
                top: 22px;
                left: 135px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                z-index: 50;
            }

            #${SELECT_BUTTON_ID},
            #${CLEAR_BUTTON_ID} {
                appearance: none;
                border: 1px solid #2f7d73;
                background-color: #3b8f85;
                color: #ffffff;
                padding: 6px 10px;
                font-size: 12px;
                line-height: 1.2;
                border-radius: 2px;
                cursor: pointer;
                white-space: nowrap;
                box-shadow: none;
            }

            #${SELECT_BUTTON_ID}:hover,
            #${CLEAR_BUTTON_ID}:hover {
                filter: brightness(0.96);
            }
        `;

        document.head.appendChild(style);
    }

    function normalizeQty(value) {
        const parsed = Number(String(value).trim().replace(/,/g, ""));
        return Number.isNaN(parsed) ? null : parsed;
    }

    function normalizePrice(value) {
        const cleaned = String(value).replace(/\$/g, "").replace(/,/g, "").trim();
        const parsed = Number(cleaned);
        return Number.isNaN(parsed) ? null : parsed;
    }

    function getProductRows() {
        return Array.from(document.querySelectorAll("tr")).map(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const cells = Array.from(row.querySelectorAll("td"));

            if (!checkbox || cells.length < 2) {
                return null;
            }

            const nameText = getText(cells[0]);

            if (/\bdatto\b/i.test(nameText)) {
                return null;
            }

            const qtyInput = row.querySelector('input[type="text"], input[type="number"], input:not([type])');
            if (!qtyInput) {
                return null;
            }

            const priceCell = cells.find(c => getText(c).includes("$"));
            if (!priceCell) {
                return null;
            }

            return {
                row,
                checkbox,
                qty: normalizeQty(qtyInput.value),
                price: normalizePrice(getText(priceCell)),
                nameText
            };
        }).filter(Boolean);
    }

    function cleanupHighlights() {
        const allHighlighted = Array.from(document.querySelectorAll(`.${HIGHLIGHT_CLASS}`));

        allHighlighted.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');

            if (!checkbox || !checkbox.checked) {
                row.classList.remove(HIGHLIGHT_CLASS);
            }
        });
    }

    async function cleanupHighlightsForAWhile() {
        for (let i = 0; i < 20; i++) {
            cleanupHighlights();
            await delay(300);
        }
    }

    async function selectZeroPriceProducts() {
        let count = 0;
        let loopSafety = 0;

        while (loopSafety < 200) {
            const rows = getProductRows();

            const target = rows.find(r =>
                r.qty === 1 &&
                r.price === 0 &&
                !r.checkbox.checked
            );

            if (!target) {
                break;
            }

            target.checkbox.click();
            target.row.classList.add(HIGHLIGHT_CLASS);

            count++;
            loopSafety++;

            await delay(75);
        }

        cleanupHighlights();

        alert(`Selected ${count} product row(s) with Qty = 1 and Unit Price = $0.00, excluding Datto.`);
    }

    function clearSelections() {
        const rows = getProductRows();

        rows.forEach(item => {
            if (item.checkbox.checked) {
                item.checkbox.click();
            }

            item.row.classList.remove(HIGHLIGHT_CLASS);
        });

        cleanupHighlights();
    }

    function findProductsHeader() {
        const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, div, span"));
        return headings.find(el => getText(el) === "Products");
    }

    function findProductsSectionContainer(productsHeader) {
        if (!productsHeader) {
            return null;
        }

        let current = productsHeader.parentElement;

        while (current) {
            if (current.querySelector("table")) {
                return current;
            }

            current = current.parentElement;
        }

        return productsHeader.parentElement;
    }

    function createProductButtons() {
        const productsHeader = findProductsHeader();
        if (!productsHeader) {
            return;
        }

        const sectionContainer = findProductsSectionContainer(productsHeader);
        if (!sectionContainer) {
            return;
        }

        const currentPosition = window.getComputedStyle(sectionContainer).position;
        if (currentPosition === "static") {
            sectionContainer.style.position = "relative";
        }

        let container = document.getElementById(BUTTON_CONTAINER_ID);

        if (!container) {
            container = document.createElement("div");
            container.id = BUTTON_CONTAINER_ID;
            sectionContainer.appendChild(container);
        }

        if (!document.getElementById(SELECT_BUTTON_ID)) {
            const btn = document.createElement("button");
            btn.id = SELECT_BUTTON_ID;
            btn.type = "button";
            btn.textContent = "Select $0 Items";
            btn.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                selectZeroPriceProducts();
            });
            container.appendChild(btn);
        }

        if (!document.getElementById(CLEAR_BUTTON_ID)) {
            const btn = document.createElement("button");
            btn.id = CLEAR_BUTTON_ID;
            btn.type = "button";
            btn.textContent = "Clear Selection";
            btn.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                clearSelections();
            });
            container.appendChild(btn);
        }
    }

    function startProductMutationWatcher() {
        const observer = new MutationObserver(() => {
            cleanupHighlights();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    //////////////////////////////
    // Init / Retry Block //
    //////////////////////////////

    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(() => {
        createCalculationButton();
        createRecommendationButton();

        if (document.body) {
            injectProductStyles();
            createProductButtons();
        }

        attempts++;

        if (attempts >= maxAttempts) {
            clearInterval(interval);
        }

        if (
            document.getElementById(SELECT_BUTTON_ID) &&
            document.getElementById(CLEAR_BUTTON_ID)
        ) {
            startProductMutationWatcher();
            cleanupHighlightsForAWhile();
        }
    }, 500);

})();