const fs = require('fs');
const glob = require('glob');

function patchProductivityPages() {
  const files = glob.sync('src/app/**/productivity/page.tsx');
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('useAuth')) {
      content = content.replace('import React, { useEffect, useState } from "react";', 'import React, { useEffect, useState } from "react";\nimport { useAuth } from "@/contexts/AuthContext";');
    }
    
    // Replace the mock block
    content = content.replace(/const \[data, setData\] = useState<any>\(null\);/, 'const [data, setData] = useState<any>(null);\n  const { user, role, organizationId } = useAuth();');
    
    content = content.replace(/let res;[\s\S]*?setData\(res\);/, `let res;
      if (!user) return;
      if (role === "engineer") {
        res = await getEngineerProductivity(user.id);
      } else if (role === "pm") {
        res = await getPMProductivity(user.id);
      } else if (role === "vendor") {
        res = await getVendorProductivity(user.id);
      } else {
        res = await getAdminProductivity(organizationId || "");
      }
      setData(res);`);
      
    // Fix useEffect dependency
    content = content.replace(/load\(\);\n  \}, \[\]\);/, 'load();\n  }, [user, role, organizationId]);');

    fs.writeFileSync(file, content);
    console.log("Patched", file);
  });
}

function patchDashboardPages() {
  const roles = ['engineer', 'vendor', 'client'];
  roles.forEach(role => {
    const file = `src/app/${role}/page.tsx`;
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('useAuth')) {
      content = content.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\nimport { useAuth } from "@/contexts/AuthContext";');
    }
    
    content = content.replace(/const \[data, setData\] = useState<any>\([^)]*\);/, (match) => {
      return match + '\n  const { user, organizationId } = useAuth();';
    });
    
    if (role === 'engineer') {
      content = content.replace(/getPendingReviews\(\),\n\s*getAssignedTasks\(\)/, 'getPendingReviews(),\n        getAssignedTasks()');
      content = content.replace(/load\(\);\n  \}, \[\]\);/, 'if (user) load();\n  }, [user]);');
    } else if (role === 'vendor') {
      content = content.replace(/getVendorProductivity\("mock-id"\)/, 'getVendorProductivity(user.id)');
      content = content.replace(/load\(\);\n  \}, \[\]\);/, 'if (user) load();\n  }, [user]);');
    } else if (role === 'client') {
      content = content.replace(/const orgId = "mock-org-id";/, 'const orgId = organizationId || "";\n      if (!orgId) return;');
      content = content.replace(/load\(\);\n  \}, \[\]\);/, 'if (organizationId) load();\n  }, [organizationId]);');
    }

    fs.writeFileSync(file, content);
    console.log("Patched", file);
  });
}

function patchReviewsPage() {
  const file = 'src/app/engineer/reviews/page.tsx';
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('useAuth')) {
      content = content.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\nimport { useAuth } from "@/contexts/AuthContext";');
      content = content.replace('const [reviews, setReviews] = useState<{incoming: any[], outgoing: any[]}>({incoming: [], outgoing: []});', 'const [reviews, setReviews] = useState<{incoming: any[], outgoing: any[]}>({incoming: [], outgoing: []});\n  const { user } = useAuth();');
      content = content.replace(/getReviews\("mock-user-id"\)/, 'getReviews(user.id)');
      content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, (match) => {
        return match.replace('getReviews', 'if (user) getReviews').replace('}, []);', '}, [user]);');
      });
      fs.writeFileSync(file, content);
      console.log("Patched", file);
    }
  }
}

patchProductivityPages();
patchDashboardPages();
patchReviewsPage();

