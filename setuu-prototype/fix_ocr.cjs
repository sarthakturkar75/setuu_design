const fs = require('fs');
let code = fs.readFileSync('src/app/api/drawings/ocr-scan/route.ts', 'utf-8');

// Add auth check
code = code.replace(
  /const { drawingId, projectId } = await request\.json\(\);/,
  `// Enforce Auth
    const { createClient: createLocalClient } = require('@/lib/supabase/server');
    const supabase = await createLocalClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { drawingId, projectId } = await request.json();`
);

// Replace model and logic
code = code.replace(
  /if \(!process\.env\.GROQ_API_KEY\) \{[\s\S]*?const completion = await openai\.chat\.completions\.create\(\{/m,
  `const isGroq = !!process.env.GROQ_API_KEY;
    const openai = new OpenAI(isGroq ? {
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY
    } : undefined);
    
    const completion = await openai.chat.completions.create({`
);

// Use a valid model for vision
code = code.replace(
  /model: "qwen\/qwen3\.8-27b",/,
  `model: isGroq ? "llama-3.2-11b-vision-preview" : "gpt-4o-mini",`
);

fs.writeFileSync('src/app/api/drawings/ocr-scan/route.ts', code);
