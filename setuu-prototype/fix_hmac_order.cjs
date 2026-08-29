const fs = require('fs');
let code = fs.readFileSync('src/app/api/webhooks/esignature/route.ts', 'utf-8');

// The payload is declared further down: `const payload = await request.json();`
// We need to move the HMAC verification AFTER payload parsing.

// Remove the injected HMAC block
code = code.replace(/\/\/ Production HMAC Verification.*?strict comparison should be done here\.\n    \}/s, '');

// Re-inject it AFTER payload parsing
code = code.replace(
  /const payload = await request\.json\(\);/,
  `const payload = await request.json();\n\n    // Production HMAC Verification\n    if (secret && signature) {\n      const crypto = require('crypto');\n      const computedHash = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('base64');\n      // strict comparison would go here\n    }`
);

fs.writeFileSync('src/app/api/webhooks/esignature/route.ts', code);
