const fs = require('fs');
const path = require('path');

const roles = {
  admin: ['projects', 'users', 'drawings', 'inventory', 'vendors', 'settings', 'support', 'status'],
  pm: ['projects', 'milestones', 'drawings', 'inventory', 'issues', 'handovers', 'support'],
  engineer: ['projects', 'tasks', 'issues', 'drawings', 'timesheet'],
  client: ['projects', 'approvals', 'meetings', 'financials'],
  vendor: ['deliveries', 'defects', 'invoices'],
  superadmin: ['audit', 'security', 'support', 'platform']
};

const baseDir = path.join(process.cwd(), 'src', 'app', '(dashboard)');

const template = (role, page) => `"use client";
import * as React from "react";

export default function ${role.charAt(0).toUpperCase() + role.slice(1)}${page.charAt(0).toUpperCase() + page.slice(1)}Page() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant/30 shadow-sm text-center">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
          <span className="material-symbols-outlined text-3xl">construction</span>
        </div>
        <h1 className="font-merriweather text-3xl font-bold text-primary mb-4">${page.charAt(0).toUpperCase() + page.slice(1)}</h1>
        <p className="text-on-surface-variant font-inter max-w-md mx-auto">
          This is a placeholder for the ${role} ${page} module. Development is scheduled for an upcoming phase.
        </p>
      </div>
    </div>
  );
}
`;

for (const [role, pages] of Object.entries(roles)) {
  for (const page of pages) {
    const dirPath = path.join(baseDir, role, page);
    fs.mkdirSync(dirPath, { recursive: true });
    const filePath = path.join(dirPath, 'page.tsx');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, template(role, page));
      console.log(`Created ${filePath}`);
    } else {
      console.log(`Exists: ${filePath}`);
    }
  }
}
console.log("Scaffolding complete.");
