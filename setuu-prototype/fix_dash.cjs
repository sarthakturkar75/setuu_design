const fs = require('fs');
let code = fs.readFileSync('src/components/navigation/DashboardShell.tsx', 'utf-8');

// Fix role check
code = code.replace(
  /if \(role === "admin" \|\| role === "pm"\) \{/,
  `if (role && role !== "superadmin") {`
);

// Fix regex
code = code.replace(
  /const uuidRegex = \/[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}\/;\n\t+const match = pathname\.match\(uuidRegex\);\n\t+const currentProjectId = match \? match\[0\] : null;/,
  `const match = pathname.match(/\\/projects\\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
	const currentProjectId = match ? match[1] : null;`
);

// Fix catch
code = code.replace(
  /getProjectFlags\(currentProjectId\)\.then\(flags => setProjectFlags\(flags\)\);/,
  `getProjectFlags(currentProjectId).then(flags => setProjectFlags(flags)).catch(console.error);`
);

// Fix loader
code = code.replace(
  /if \(isLoading\) return null;/,
  `if (isLoading) return <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant"><div className="animate-pulse">Loading Workspace...</div></div>;`
);

fs.writeFileSync('src/components/navigation/DashboardShell.tsx', code);
