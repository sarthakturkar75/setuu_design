const fs = require('fs');
let code = fs.readFileSync('src/app/api/billing/aia/route.ts', 'utf-8');

// Add auth check
code = code.replace(
  /const supabase = await createClient\(\);/,
  `const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });`
);

// Fetch change orders
code = code.replace(
  /\/\/ Calculate AIA G702 metrics/,
  `const { data: changeOrders } = await supabase
    .from("change_requests")
    .select("cost_impact")
    .eq("project_id", projectId)
    .eq("status", "Approved");
  
  const netChangeByCO = changeOrders?.reduce((acc, co) => acc + (co.cost_impact || 0), 0) || 0;

  // Calculate AIA G702 metrics`
);

// Update placeholders
code = code.replace(
  /doc\.text\(\\\`\\\$0\.00\\\`, rightCol, y\); \/\/ Placeholder for actual changes/,
  `doc.text(\`\$\${netChangeByCO.toLocaleString()}\`, rightCol, y);`
);

code = code.replace(
  /doc\.text\(\\\`\\\$\\\$\\{originalContractSum\.toLocaleString\(\)\}\\\`, rightCol, y\);/g, // Only replace the "Line 1 + 2" one which we'll find below
  `doc.text(\`\$\${(originalContractSum + netChangeByCO).toLocaleString()}\`, rightCol, y);`
);
// Specifically replacing line 3 sum:
code = code.replace(
  /doc\.text\("3\. CONTRACT SUM TO DATE \(Line 1 \+ 2\)", leftCol, y\);\n  doc\.text\(`\$([^`]+)`, rightCol, y\);/,
  `doc.text("3. CONTRACT SUM TO DATE (Line 1 + 2)", leftCol, y);\n  doc.text(\`\\$\${(originalContractSum + netChangeByCO).toLocaleString()}\`, rightCol, y);`
);

fs.writeFileSync('src/app/api/billing/aia/route.ts', code);
