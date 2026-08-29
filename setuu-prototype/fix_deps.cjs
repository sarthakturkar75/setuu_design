const fs = require('fs');

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
  let code = fs.readFileSync(file, 'utf-8');

  // Add dependency array: `}, []);` -> `}, [user, organizationId]);`
  code = code.replace(/\}, \[\]\);/g, '}, [user, organizationId]);');
  
  // Add early return if no auth loaded yet:
  code = code.replace(/async function load\(\) \{/, 'async function load() {\n      if (!user && !organizationId) return;\n');
  
  fs.writeFileSync(file, code);
  console.log('Fixed dependencies for', file);
});
