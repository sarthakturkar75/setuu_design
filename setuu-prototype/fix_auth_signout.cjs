const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');

if (!code.includes('useRouter')) {
    code = code.replace(/import \{ createContext, useContext, useEffect, useState \} from 'react'/, 
      "import { createContext, useContext, useEffect, useState } from 'react'\nimport { useRouter } from 'next/navigation'");
}

code = code.replace(/export function AuthProvider\(\{ children \}: \{ children: React\.ReactNode \}\) \{/, 
  "export function AuthProvider({ children }: { children: React.ReactNode }) {\n  const router = useRouter();");

code = code.replace(/const signOut = async \(\) => \{\n    await supabase\.auth\.signOut\(\)\n    setUser\(null\)\n    setRole\(null\)\n    setOrganizationId\(null\)\n    setDisplayName\(null\)\n    setAvatarUrl\(null\)/, 
  "const signOut = async () => {\n    await supabase.auth.signOut()\n    setUser(null)\n    setRole(null)\n    setOrganizationId(null)\n    setDisplayName(null)\n    setAvatarUrl(null)\n    router.push('/auth');");

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
