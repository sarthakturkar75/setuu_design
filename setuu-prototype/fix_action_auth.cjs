const fs = require('fs');

function patchAuth(file, funcName, roles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    const regex = new RegExp(`(export async function ${funcName}\\([^)]*\\)\\s*\\{)`);
    content = content.replace(regex, `$1\n  await verifyRole([${roles}]);`);
    fs.writeFileSync(file, content);
    console.log(`Patched ${funcName} in ${file}`);
  }
}

patchAuth('src/app/actions/emergencyActions.ts', 'initiateEmergencyMuster', '"admin", "pm", "superadmin"');
patchAuth('src/app/actions/emergencyActions.ts', 'markUserSafe', '"admin", "pm", "superadmin", "engineer"');
patchAuth('src/app/actions/permissionActions.ts', 'toggleUserPermission', '"admin", "superadmin"');
patchAuth('src/app/actions/roleSettingsActions.ts', 'updateRoleSetting', '"admin", "superadmin"');
patchAuth('src/app/actions/teamActions.ts', 'updatePersonnelProfile', '"admin", "superadmin"');

