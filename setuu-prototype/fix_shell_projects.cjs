const fs = require('fs');
let code = fs.readFileSync('src/components/navigation/DashboardShell.tsx', 'utf-8');

code = code.replace(
  /getProjects\(\)\s*\.then\(\(data\) => setProjects\(data \|\| \[\]\)\)\s*\.catch\(console\.error\);/,
  `if (role === 'client') {
      import('@/app/actions/clientActions').then(m => m.getClientPortfolio(organizationId || '')).then(data => setProjects(data || [])).catch(console.error);
    } else {
      getProjects().then((data) => setProjects(data || [])).catch(console.error);
    }`
);

fs.writeFileSync('src/components/navigation/DashboardShell.tsx', code);
