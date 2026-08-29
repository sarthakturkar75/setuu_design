const fs = require('fs');
let code = fs.readFileSync('src/app/api/billing/aia/route.ts', 'utf-8');

code = code.replace(
  /doc\.text\(\`\$0\.00\`, rightCol, y\); \/\/ Placeholder for actual changes/,
  'doc.text(`$${netChangeByCO.toLocaleString()}`, rightCol, y);'
);
code = code.replace(
  /doc\.text\(\`\\\$\{\(originalContractSum \+ netChangeByCO\)\.toLocaleString\(\)\}\`, rightCol, y\);/,
  'doc.text(`$${(originalContractSum + netChangeByCO).toLocaleString()}`, rightCol, y);'
);

fs.writeFileSync('src/app/api/billing/aia/route.ts', code);
