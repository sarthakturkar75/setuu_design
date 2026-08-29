const fs = require('fs');

function replaceAuth(file, funcName, roles) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  const regex = new RegExp(`(export async function ${funcName}.*?\\{\\s*await verifyRole\\(\\[.*?\\]\\);.*?)`, 's');
  
  // Replace the baseline auth we just injected with strict auth
  content = content.replace(
    new RegExp(`(export async function ${funcName}.*?\\{\\s*)await verifyRole\\(\\[.*?\\]\\); [^\n]*\n`), 
    `$1await verifyRole([${roles}]);\n`
  );
  fs.writeFileSync(file, content);
}

replaceAuth('src/app/actions/permissionActions.ts', 'toggleUserPermission', '"admin", "superadmin"');
replaceAuth('src/app/actions/teamActions.ts', 'updatePersonnelProfile', '"admin", "superadmin"');
replaceAuth('src/app/actions/roleSettingsActions.ts', 'updateRoleSetting', '"admin", "pm", "superadmin"');
replaceAuth('src/app/actions/emergencyActions.ts', 'initiateEmergencyMuster', '"admin", "pm", "superadmin", "engineer"');

console.log('Fixed critical action authorizations.');
