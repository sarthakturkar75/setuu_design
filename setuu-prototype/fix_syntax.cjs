const fs = require('fs');

const filesToFix = [
  'src/app/actions/auditActions.ts',
  'src/app/actions/projectActions.ts',
  'src/app/actions/resourceActions.ts',
  'src/app/actions/supportActions.ts',
  'src/app/actions/updateActions.ts',
  'src/app/actions/userActions.ts'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  // My injection was:
  // export async function getAuditLogs(filters?: {
  //   await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth event_type?: string, ... }) {
  
  // The easiest fix is to git checkout them if they are in git, but wait, there is no git repository here? Let's check git status.
  // Actually, I can just do a regex replace to fix it.
  
  const badString = /\{\s*await verifyRole\(\["admin", "pm", "superadmin", "engineer", "client", "vendor"\]\); \/\/ Auto-injected baseline auth /g;
  
  content = content.replace(badString, '{ ');
  
  // Now add the auth correctly.
  // We can just find the end of the function declaration.
  // export async function someName(...) {
  
  content = content.replace(/(export async function [^\(]+\([^)]*\)\s*\{)/g, '$1\n  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]);\n');
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
