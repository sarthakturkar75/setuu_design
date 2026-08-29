const fs = require('fs');
let code = fs.readFileSync('src/app/api/materials/receive/route.ts', 'utf-8');

// Add HTML escaping
code = code.replace(
  /export async function GET/,
  `function escapeHtml(unsafe) {\n  return unsafe\n    .replace(/&/g, "&amp;")\n    .replace(/</g, "&lt;")\n    .replace(/>/g, "&gt;")\n    .replace(/"/g, "&quot;")\n    .replace(/'/g, "&#039;");\n}\n\nexport async function GET`
);

// Escape item_name usages
code = code.replace(/\$\{material\.item_name\}/g, '${escapeHtml(material.item_name)}');

// Add authentication to POST
code = code.replace(
  /export async function POST\(request: Request\) \{\n  try \{/,
  `import { createClient as createServerClient } from '@/lib/supabase/server';\n\nexport async function POST(request: Request) {\n  try {\n    const serverSupabase = await createServerClient();\n    const { data: { user } } = await serverSupabase.auth.getUser();\n    if (!user) return NextResponse.json({ error: "Unauthorized. Must be logged in to receive materials." }, { status: 401 });`
);

fs.writeFileSync('src/app/api/materials/receive/route.ts', code);
