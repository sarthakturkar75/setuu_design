const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Add useAuth import if not present and we need it
  if ((content.includes('"mock-id"') || content.includes('"mock-user-id"') || content.includes('"mock-org-id"') || content.includes('"mock-pm-id"')) && !content.includes('useAuth')) {
    content = content.replace(/(import React.*?;\n)/, `$1import { useAuth } from "@/contexts/AuthContext";\n`);
    changed = true;
  }

  // Handle client/page.tsx
  if (file.includes('src/app/client/page.tsx')) {
    content = content.replace(/export default function ClientDashboard\(\) \{/, `export default function ClientDashboard() {\n  const { organizationId } = useAuth();`);
    content = content.replace(/const orgId = "mock-org-id";/g, `const orgId = organizationId || "";\n      if (!orgId) return;`);
    changed = true;
  }

  // Handle vendor/page.tsx
  if (file.includes('src/app/vendor/page.tsx')) {
    content = content.replace(/export default function VendorDashboard\(\) \{/, `export default function VendorDashboard() {\n  const { user } = useAuth();`);
    content = content.replace(/const res = await getVendorProductivity\("mock-id"\);/g, `if (!user) return;\n      const res = await getVendorProductivity(user.id);`);
    changed = true;
  }

  // Handle engineer/page.tsx
  if (file.includes('src/app/engineer/page.tsx')) {
    content = content.replace(/export default function EngineerDashboard\(\) \{/, `export default function EngineerDashboard() {\n  const { user } = useAuth();`);
    content = content.replace(/const \[reviews, tasks\] = await Promise.all\(\[/, `if (!user) return;\n      const [reviews, tasks] = await Promise.all([`);
    changed = true;
  }
  
  // Handle engineer/reviews/page.tsx
  if (file.includes('src/app/engineer/reviews/page.tsx')) {
    content = content.replace(/export default function EngineerReviews\(\) \{/, `export default function EngineerReviews() {\n  const { user } = useAuth();`);
    content = content.replace(/getReviews\("mock-user-id"\)/g, `getReviews(user?.id || "")`);
    changed = true;
  }

  // Handle productivity pages
  if (file.includes('productivity/page.tsx')) {
    content = content.replace(/export default function .*?\(\) \{/, (match) => `${match}\n  const { user, organizationId } = useAuth();`);
    content = content.replace(/getEngineerProductivity\("mock-user-id"\)/g, `getEngineerProductivity(user?.id || "")`);
    content = content.replace(/getPMProductivity\("mock-pm-id"\)/g, `getPMProductivity(user?.id || "")`);
    content = content.replace(/getAdminProductivity\("mock-org-id"\)/g, `getAdminProductivity(organizationId || "")`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed mocks in ${file}`);
  }
});
