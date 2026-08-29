const fs = require('fs');

function addImport(file) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('verifyRole')) {
    // If we used verifyRole but didn't import it
    content = content.replace('"use server";\n', '"use server";\nimport { verifyRole } from "./authUtils";\n');
    fs.writeFileSync(file, content);
  } else if (!content.includes('import { verifyRole }') && content.includes('verifyRole(')) {
    // Has verifyRole call, missing import
    content = content.replace('"use server";\n', '"use server";\nimport { verifyRole } from "./authUtils";\n');
    fs.writeFileSync(file, content);
  }
}

['src/app/actions/emergencyActions.ts', 'src/app/actions/permissionActions.ts', 'src/app/actions/roleSettingsActions.ts', 'src/app/actions/teamActions.ts'].forEach(addImport);
