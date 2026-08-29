const fs = require('fs');

let content = fs.readFileSync('src/app/api/webhooks/turnstile/route.ts', 'utf-8');

const authStub = `
    const secret = process.env.TURNSTILE_API_SECRET;
    const authHeader = request.headers.get('Authorization');
    if (secret && authHeader !== \`Bearer \${secret}\`) {
      return NextResponse.json({ access: "DENIED", reason: "Invalid API Secret" }, { status: 401 });
    }
`;

content = content.replace(/try\s*\{\s*const body = await request.json\(\);/, `try {${authStub}\n    const body = await request.json();`);

// Fix missing project authorization
const projectAuthStub = `
    // Check if user is assigned to this project
    const { data: assignment, error: assignErr } = await supabase
      .from('project_team')
      .select('id')
      .eq('user_id', user.id)
      .eq('project_id', project_id)
      .single();
      
    if (assignErr || !assignment) {
      return NextResponse.json({ access: "DENIED", reason: "Not assigned to this project." }, { status: 403 });
    }
`;

content = content.replace(/if \(direction === 'IN'\) \{/, `if (direction === 'IN') {\n${projectAuthStub}`);

fs.writeFileSync('src/app/api/webhooks/turnstile/route.ts', content);
