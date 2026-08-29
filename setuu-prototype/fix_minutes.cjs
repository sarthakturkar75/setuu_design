const fs = require('fs');
let code = fs.readFileSync('src/app/api/collaboration/minutes/route.ts', 'utf-8');

// Move auth check up to the top
code = code.replace(
  /const { transcript, projectId } = await request\.json\(\);/,
  `const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { transcript, projectId } = await request.json();`
);

// We already extracted user, so fix the reference at the bottom
code = code.replace(
  /const supabase = await createClient\(\);\n\s*const { data: user } = await supabase\.auth\.getUser\(\);\n\s*const userId = user\?\.user\?\.id \|\| null;/g,
  `const userId = user.id;`
);

// Fix Groq model
code = code.replace(
  /const modelName = isGroq \? "openai\/gpt-oss-120b" : "gpt-4o-mini";/,
  `const modelName = isGroq ? "llama3-8b-8192" : "gpt-4o-mini";`
);

fs.writeFileSync('src/app/api/collaboration/minutes/route.ts', code);
