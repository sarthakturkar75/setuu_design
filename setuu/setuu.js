document.addEventListener("DOMContentLoaded", () => {
    // Inject custom CSS for dynamic states
    const style = document.createElement("style");
    style.innerHTML = `
        .sidebar-mobile-open {
            display: flex !important;
            position: fixed !important;
            inset: 0 !important;
            z-index: 9999 !important;
            width: 80% !important;
        }
        .sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        }
    `;
    document.head.appendChild(style);

    // Sidebar overlay element
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay hidden";
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
        const sidebars = document.querySelectorAll("nav");
        sidebars.forEach((nav) => {
            if (nav.classList.contains("sidebar-mobile-open")) {
                nav.classList.remove("sidebar-mobile-open");
            }
        });
        overlay.classList.add("hidden");
    });

    document.body.addEventListener("click", (e) => {
        const target = e.target;
        const btn = target.closest("button");

        if (!btn) return;

        const btnText = btn.textContent.trim().toLowerCase();
        const btnHtml = btn.innerHTML.toLowerCase();

        // 1. Sidebar Toggle
        if (btnHtml.includes("menu")) {
            // Find the main side nav
            const sidebars = document.querySelectorAll("nav");
            let toggled = false;
            sidebars.forEach((nav) => {
                // If it's a typical sidebar (fixed left, hidden on mobile)
                if (
                    nav.className.includes("w-sidebar-width") ||
                    nav.className.includes("fixed")
                ) {
                    nav.classList.toggle("sidebar-mobile-open");
                    toggled = true;
                }
            });
            if (toggled) {
                overlay.classList.remove("hidden");
            }
            return;
        }

        // 2. Mock Dropdowns & Actions
        if (
            btnHtml.includes("notifications") ||
            btnHtml.includes("account_circle") ||
            btnHtml.includes("more_vert") ||
            btnHtml.includes("settings")
        ) {
            showToast("Mock Action: " + btnText + " clicked.");
            return;
        }

        // 3. Tab Switching
        const parent = btn.parentElement;
        if (
            parent &&
            parent.tagName === "DIV" &&
            parent.classList.contains("flex") &&
            parent.children.length > 1
        ) {
            // Check if siblings are also buttons
            const allButtons = Array.from(parent.children).filter(
                (el) => el.tagName === "BUTTON",
            );
            if (allButtons.length > 1 && allButtons.includes(btn)) {
                allButtons.forEach((b) => {
                    b.classList.remove(
                        "bg-primary",
                        "text-on-primary",
                        "bg-secondary-container",
                        "text-on-secondary-container",
                        "border-primary",
                    );
                    if (b.className.includes("border")) {
                        b.classList.add("text-on-surface-variant");
                    }
                });

                // Add active styles
                btn.classList.add("bg-primary", "text-on-primary");
                btn.classList.remove("text-on-surface-variant");
                showToast("Tab switched to: " + btnText);
                return;
            }
        }
    });
});

function showToast(message) {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.className =
            "fixed bottom-4 right-4 z-[9999] flex flex-col gap-2";
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement("div");
    // Using sharp 0px corners to match design system
    toast.className =
        "bg-inverse-surface text-inverse-on-surface px-4 py-3 shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-y-full opacity-0 border border-outline-variant";
    toast.innerHTML = `<span class="material-symbols-outlined text-[20px] text-primary-fixed-dim">info</span><span class="font-body-md text-sm font-medium tracking-wide">${message}</span>`;

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove("translate-y-full", "opacity-0");
    });

    // Animate out
    setTimeout(() => {
        toast.classList.add("translate-y-full", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Phase 2: Modals & Dialogs
document.addEventListener("DOMContentLoaded", () => {
    // Inject generic modal container
    const modalHtml = `
    <div id="generic-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center">
        <div class="fixed inset-0 bg-black/60 transition-opacity" id="modal-backdrop"></div>
        <div class="bg-surface-container-lowest border border-outline-variant shadow-xl z-10 w-full max-w-md p-6 flex flex-col gap-4 transform transition-all">
            <h2 id="modal-title" class="text-headline-sm font-headline-sm text-on-surface">Action Required</h2>
            <p id="modal-body" class="text-body-md font-body-md text-on-surface-variant">Please confirm your action.</p>
            <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-outline-variant">
                <button id="modal-cancel" class="px-4 py-2 border border-outline text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md">Cancel</button>
                <button id="modal-confirm" class="px-4 py-2 bg-primary text-on-primary hover:opacity-90 transition-opacity font-label-md">Confirm</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const genericModal = document.getElementById("generic-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    const modalCancel = document.getElementById("modal-cancel");
    const modalConfirm = document.getElementById("modal-confirm");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    function closeModal() {
        genericModal.classList.add("hidden");
        genericModal.classList.remove("flex");
    }

    modalBackdrop.addEventListener("click", closeModal);
    modalCancel.addEventListener("click", closeModal);
    modalConfirm.addEventListener("click", () => {
        closeModal();
        showToast("Action completed successfully.");
    });

    // Capture button clicks for modals
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const btnText = btn.textContent.trim().toLowerCase();

        // Triggers for opening modal
        if (
            btnText.includes("add new") ||
            btnText.includes("create") ||
            btnText.includes("log new") ||
            btnText.includes("escalate") ||
            btnText.includes("delete") ||
            btnText.includes("archive")
        ) {
            // Setup generic modal content based on button
            modalTitle.textContent = btn.textContent.trim() || "Confirm Action";
            modalBody.textContent = `Are you sure you want to proceed with "${btn.textContent.trim()}"?`;

            // Adjust confirm button color for destructive actions
            if (btnText.includes("delete") || btnText.includes("archive")) {
                modalConfirm.className =
                    "px-4 py-2 bg-error text-on-error hover:opacity-90 transition-opacity font-label-md";
                modalConfirm.textContent = "Proceed";
            } else {
                modalConfirm.className =
                    "px-4 py-2 bg-primary text-on-primary hover:opacity-90 transition-opacity font-label-md";
                modalConfirm.textContent = "Submit";
            }

            genericModal.classList.remove("hidden");
            genericModal.classList.add("flex");
        }

        // Triggers for closing hardcoded modals (if any exist in the HTML)
        if (
            btnText === "cancel" ||
            btnText === "close" ||
            btnText === "discard changes"
        ) {
            const hardcodedModal = btn.closest(".fixed.inset-0.z-50");
            if (hardcodedModal) {
                hardcodedModal.classList.add("hidden");
            }
        }
    });
});

// Phase 3: Simulated Form Submissions & Auth Flow
document.addEventListener("DOMContentLoaded", () => {
    // Capture all form submissions
    document.body.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload

        const form = e.target;
        const submitBtn =
            form.querySelector('button[type="submit"]') ||
            form.querySelector("button");

        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            // Show loading state
            submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Processing...`;
            submitBtn.disabled = true;

            // Simulate network delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Auth flow redirects
                if (window.location.pathname.includes("login.html")) {
                    showToast("Login Successful. Redirecting...");
                    setTimeout(
                        () => (window.location.href = "otp_verification.html"),
                        1000,
                    );
                } else if (window.location.pathname.includes("otp_verification.html")) {
                    // Biometric Trigger
                    const modalTitle = document.getElementById("modal-title");
                    const modalBody = document.getElementById("modal-body");
                    const genericModal = document.getElementById("generic-modal");
                    const modalConfirm = document.getElementById("modal-confirm");

                    modalTitle.textContent = "Biometric Scan Required";
                    modalBody.textContent =
                        "Please place your finger on the scanner or look at the camera to verify your identity (Simulated).";
                    modalConfirm.textContent = "Verify Biometric";
                    modalConfirm.className =
                        "px-4 py-2 bg-primary text-on-primary hover:opacity-90 transition-opacity font-label-md";

                    // Modify the click event just for this auth flow
                    const newConfirm = modalConfirm.cloneNode(true);
                    modalConfirm.parentNode.replaceChild(newConfirm, modalConfirm);

                    newConfirm.addEventListener("click", () => {
                        genericModal.classList.add("hidden");
                        genericModal.classList.remove("flex");
                        showToast("Biometric Verified. Entering Dashboard...");
                        setTimeout(() => (window.location.href = "index.html"), 1000);
                    });

                    genericModal.classList.remove("hidden");
                    genericModal.classList.add("flex");
                } else if (
                    window.location.pathname.includes("password_recovery.html")
                ) {
                    showToast("Recovery link sent to your email.");
                    // Provide a mock email click link in the UI
                    let mockEmail = document.createElement("div");
                    mockEmail.className =
                        "mt-4 p-4 bg-tertiary-container text-on-tertiary-container border border-outline-variant";
                    mockEmail.innerHTML = `<p class="text-sm font-bold mb-2">Simulated Email Received!</p><a href="password_reset.html" class="underline hover:opacity-80">Click here to reset password</a>`;
                    form.parentNode.appendChild(mockEmail);
                } else if (window.location.pathname.includes("password_reset.html")) {
                    showToast("Password updated successfully.");
                    setTimeout(() => (window.location.href = "login.html"), 1500);
                } else {
                    // Standard forms
                    showToast("Data submitted successfully.");
                    form.reset();
                }
            }, 1200);
        }
    });

    // File Upload Simulation
    document.body.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const btnHtml = btn.innerHTML.toLowerCase();
        if (
            btnHtml.includes("upload") ||
            btnHtml.includes("add_a_photo") ||
            btnHtml.includes("download")
        ) {
            if (btnHtml.includes("download")) {
                showToast("Starting secure file download...");
            } else {
                // Simulate file picker opening by showing a toast
                showToast("Opening file selector... (Simulated)");
            }
        }
    });
});

// Phase 4: Search Filtering & Empty States
document.addEventListener("DOMContentLoaded", () => {
    // 1. Search Filtering
    // Find all search inputs (usually inside a div with 'search' icon)
    const searchInputs = document.querySelectorAll(
        'input[type="text"][placeholder*="Search"], input[type="text"][placeholder*="search"]',
    );

    searchInputs.forEach((input) => {
        input.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            // We assume the nearest table or list contains the filterable items
            // A simple heuristic: find the closest table body or the closest flex/grid container with repeating children
            let container = document.querySelector("tbody");
            let items = [];

            if (container) {
                items = container.querySelectorAll("tr");
            } else {
                // If no table, look for a grid or list of cards. Usually main content div has id='main-content' or just grab all prominent cards.
                // We'll just look for standard cards.
                items = document.querySelectorAll(
                    ".bg-surface-container-lowest.border",
                );
            }

            items.forEach((item) => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    // 2. Empty State Toggle (for demo purposes)
    // We inject a tiny floating button in the bottom left to toggle states
    const toggleHtml = `
    <div class="fixed bottom-4 left-4 z-[9999]">
        <button id="demo-toggle-btn" class="bg-surface-variant text-on-surface-variant text-label-sm font-label-sm px-3 py-1 border border-outline-variant shadow-md hover:bg-surface-container transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">visibility</span>
            Toggle Empty State
        </button>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", toggleHtml);

    const demoBtn = document.getElementById("demo-toggle-btn");
    demoBtn.addEventListener("click", () => {
        // Find elements that look like empty states (e.g. they have data-source="...empty...")
        // Since we previously injected empty states with data-source attributes or id containing empty, let's find them
        const emptyStates = document.querySelectorAll(
            '[data-source*="empty"], [id*="empty"]',
        );
        const mainContent = document.querySelectorAll(
            'main > div:not([data-source*="empty"]):not(.fixed)',
        );

        if (emptyStates.length > 0) {
            emptyStates.forEach((el) => {
                if (el.classList.contains("hidden")) {
                    el.classList.remove("hidden");
                    // Hide main content
                    mainContent.forEach((mc) => mc.classList.add("hidden"));
                    showToast("Switched to Empty State view");
                } else {
                    el.classList.add("hidden");
                    // Show main content
                    mainContent.forEach((mc) => mc.classList.remove("hidden"));
                    showToast("Switched to Populated view");
                }
            });
        } else {
            showToast("No empty state designed for this page.");
        }
    });
});
