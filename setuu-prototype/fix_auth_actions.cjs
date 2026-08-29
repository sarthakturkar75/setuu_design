const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/actions/**/*.ts');

let injectedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Add authUtils import if missing but needed
  if (!content.includes('verifyRole') && content.includes('export async function')) {
     content = content.replace(/(import .*?;)/, `$1\nimport { verifyRole } from "./authUtils";`);
  }

  // Regex to find exported functions
  const blocks = content.split(/(?=export async function )/);
  const newBlocks = blocks.map(block => {
    if (block.startsWith('export async function ')) {
       // if it doesn't already have verifyRole and isn't a webhook/public function
       if (!block.includes('verifyRole') && !block.includes('getPublicProjectData') && !block.includes('generatePublicShareLink')) {
          return block.replace(/\{/, `{\n  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth`);
       }
    }
    return block;
  });

  const newContent = newBlocks.join('');
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    injectedCount++;
  }
});

console.log(`Injected baseline auth into ${injectedCount} action files.`);
