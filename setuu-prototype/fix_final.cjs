const fs = require('fs');

let mat = fs.readFileSync('src/app/api/materials/receive/route.ts', 'utf-8');
mat = mat.replace(/function escapeHtml\(unsafe\) \{/, 'function escapeHtml(unsafe: string) {');
fs.writeFileSync('src/app/api/materials/receive/route.ts', mat);

let auth = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');
// Check if useRouter is imported
if (!auth.includes('import { useRouter }')) {
   auth = auth.replace(/import \{ createContext, useContext, useEffect, useState \} from 'react'/, 
      "import { createContext, useContext, useEffect, useState } from 'react'\nimport { useRouter } from 'next/navigation'");
}
fs.writeFileSync('src/contexts/AuthContext.tsx', auth);
