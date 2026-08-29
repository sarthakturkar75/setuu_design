const fs = require('fs');
const glob = require('glob');

const files = [
  'src/app/client/page.tsx',
  'src/app/vendor/page.tsx',
  'src/app/engineer/page.tsx',
  'src/app/engineer/reviews/page.tsx',
  'src/app/admin/productivity/page.tsx',
  'src/app/admin/resources/productivity/page.tsx',
  'src/app/pm/productivity/page.tsx',
  'src/app/pm/resources/productivity/page.tsx',
  'src/app/engineer/productivity/page.tsx',
  'src/app/vendor/productivity/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');

  // Inject import
  if (!content.includes('useAuth')) {
    content = content.replace(/(import React.*?;\n)/, `$1import { useAuth } from "@/contexts/AuthContext";\n`);
  }

  // Find component function
  content = content.replace(/export default function (\w+)\(\)\s*\{/, `export default function $1() {\n  const { user, organizationId } = useAuth();`);

  // Replace mocks
  content = content.replace(/const orgId = "mock-org-id";/g, '');
  content = content.replace(/getClientPortfolio\(orgId\)/g, 'getClientPortfolio(organizationId || "")');
  content = content.replace(/getClientFinancialSummary\(orgId\)/g, 'getClientFinancialSummary(organizationId || "")');

  content = content.replace(/"mock-id"/g, 'user?.id || ""');
  content = content.replace(/"mock-user-id"/g, 'user?.id || ""');
  content = content.replace(/"mock-pm-id"/g, 'user?.id || ""');
  content = content.replace(/"mock-org-id"/g, 'organizationId || ""');

  fs.writeFileSync(file, content);
});

// Also remove the deleted routes from .next cache to avoid TS errors
const nextCacheDir = '.next';
if (fs.existsSync(nextCacheDir)) {
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
}

