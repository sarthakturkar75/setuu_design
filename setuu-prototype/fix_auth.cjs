const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');

code = code.replace(
  /const signOut = async \(\) => \{\n\s*await supabase\.auth\.signOut\(\)\n\s*setUser\(null\)\n\s*setRole\(null\)\n\s*setOrganizationId\(null\)\n\s*setDisplayName\(null\)\n\s*setAvatarUrl\(null\)\n\s*\}/,
  `const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setOrganizationId(null)
    setDisplayName(null)
    setAvatarUrl(null)
    window.location.href = '/login'
  }`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
