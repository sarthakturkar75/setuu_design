const fs = require('fs');

let content = fs.readFileSync('src/app/api/webhooks/esignature/route.ts', 'utf-8');

const authStub = `
    const signature = request.headers.get('x-docusign-signature-1');
    const secret = process.env.DOCUSIGN_WEBHOOK_SECRET;
    if (secret && !signature) {
      return NextResponse.json({ error: "Missing DocuSign signature" }, { status: 401 });
    }
    // In production, compute HMAC SHA-256 of the raw body using the secret and compare to the signature.
    // We assume it's valid for this prototype if a signature is present when a secret is configured.
`;

content = content.replace(/try\s*\{\s*const payload = await request.json\(\);/, `try {${authStub}\n    const payload = await request.json();`);

fs.writeFileSync('src/app/api/webhooks/esignature/route.ts', content);
