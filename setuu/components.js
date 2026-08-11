class SetuuHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="fixed top-0 left-0 w-full lg:left-sidebar-width lg:w-[calc(100%-280px)] z-50 flex justify-between items-center h-[64px] px-margin-mobile md:px-margin-desktop bg-surface dark:bg-inverse-surface border-b border-border-standard dark:border-outline-variant">
            <div class="flex items-center space-x-4 lg:hidden">
                <button class="p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 ease-in-out flex items-center justify-center">
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <img src="logo.jpeg" alt="Setuu Logo" class="h-8 w-auto object-contain">
            </div>
            <div class="hidden lg:flex items-center space-x-4 flex-1">
                <div class="flex bg-surface-container border border-border-standard px-3 py-1.5 items-center w-64 max-w-md">
                    <span class="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
                    <input class="bg-transparent border-none outline-none text-body-md w-full placeholder:text-on-surface-variant/70 focus:ring-0 p-0" placeholder="Global search..." type="text">
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <button class="p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 ease-in-out flex items-center justify-center">
                    <span class="material-symbols-outlined">sync</span>
                </button>
                <button class="p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 ease-in-out flex items-center justify-center relative">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-status-critical"></span>
                </button>
                <button class="p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 ease-in-out flex items-center justify-center">
                    <span class="material-symbols-outlined">account_circle</span>
                </button>
            </div>
        </header>
        `;
    }
}
customElements.define("setuu-header", SetuuHeader);

class SetuuSidebar extends HTMLElement {
    connectedCallback() {
        const role = this.getAttribute("role") || "admin";

        const links = {
            admin: `
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="index.html"><span class="material-symbols-outlined text-[20px]">dashboard</span><span class="text-label-md font-label-md uppercase tracking-wider">Dashboard</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="project_registry.html"><span class="material-symbols-outlined text-[20px]">engineering</span><span class="text-label-md font-label-md uppercase tracking-wider">Projects</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="user_management.html"><span class="material-symbols-outlined text-[20px]">group</span><span class="text-label-md font-label-md uppercase tracking-wider">Users</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="admin_audit_logs.html"><span class="material-symbols-outlined text-[20px]">history_edu</span><span class="text-label-md font-label-md uppercase tracking-wider">Audit Logs</span></a></li>
            `,
            pm: `
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="pm_home.html"><span class="material-symbols-outlined text-[20px]">dashboard</span><span class="text-label-md font-label-md uppercase tracking-wider">Dashboard</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="project_registry.html"><span class="material-symbols-outlined text-[20px]">engineering</span><span class="text-label-md font-label-md uppercase tracking-wider">Projects</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="issue_blocker_tracker.html"><span class="material-symbols-outlined text-[20px]">report_problem</span><span class="text-label-md font-label-md uppercase tracking-wider">Issues</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="material_procurement.html"><span class="material-symbols-outlined text-[20px]">inventory_2</span><span class="text-label-md font-label-md uppercase tracking-wider">Procurement</span></a></li>
            `,
            client: `
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="client_portfolio_dashboard.html"><span class="material-symbols-outlined text-[20px]">dashboard</span><span class="text-label-md font-label-md uppercase tracking-wider">Portfolio</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="client_approvals_log.html"><span class="material-symbols-outlined text-[20px]">fact_check</span><span class="text-label-md font-label-md uppercase tracking-wider">Approvals</span></a></li>
                <li><a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="client_meeting_management.html"><span class="material-symbols-outlined text-[20px]">meeting_room</span><span class="text-label-md font-label-md uppercase tracking-wider">Meetings</span></a></li>
            `,
        };

        const activeLinks = links[role] || links["admin"];

        this.innerHTML = `
        <nav class="hidden lg:flex flex-col h-screen w-sidebar-width fixed left-0 top-0 z-[60] bg-tertiary border-r border-border-standard pt-4">
            <div class="p-6 border-b border-white/10 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-headline-md font-headline-md font-bold text-on-tertiary tracking-tight">SETUU</span>
                </div>
                <button class="lg:hidden p-2 text-on-tertiary">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="flex-1 py-4 overflow-y-auto">
                <ul class="space-y-1 px-3">
                    ${activeLinks}
                </ul>
            </div>
            <div class="p-4 border-t border-white/10">
                <a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="help_center.html">
                    <span class="material-symbols-outlined text-[20px]">help_outline</span>
                    <span class="text-label-md font-label-md uppercase tracking-wider">Support</span>
                </a>
                <a class="flex items-center gap-3 px-4 py-3 text-on-tertiary opacity-80 hover:opacity-100 hover:bg-tertiary-container transition-all" href="login.html">
                    <span class="material-symbols-outlined text-[20px]">logout</span>
                    <span class="text-label-md font-label-md uppercase tracking-wider">Logout</span>
                </a>
            </div>
        </nav>
        `;
    }
}
customElements.define("setuu-sidebar", SetuuSidebar);

class SetuuBottomNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="lg:hidden fixed bottom-0 left-0 w-full z-[60] bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center h-16 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <a class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 h-12 hover:bg-surface-container-high transition-colors" href="index.html">
                <span class="material-symbols-outlined">home</span>
                <span class="font-label-sm text-label-sm mt-1">Home</span>
            </a>
            <a class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 h-12 hover:bg-surface-container-high transition-colors" href="project_registry.html">
                <span class="material-symbols-outlined">engineering</span>
                <span class="font-label-sm text-label-sm mt-1">Projects</span>
            </a>
            <a class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 h-12 hover:bg-surface-container-high transition-colors" href="notification_center.html">
                <span class="material-symbols-outlined">notifications</span>
                <span class="font-label-sm text-label-sm mt-1">Alerts</span>
            </a>
            <a class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 h-12 hover:bg-surface-container-high transition-colors" href="#">
                <span class="material-symbols-outlined">menu</span>
                <span class="font-label-sm text-label-sm mt-1">More</span>
            </a>
        </nav>
        `;
    }
}
customElements.define("setuu-bottom-nav", SetuuBottomNav);
