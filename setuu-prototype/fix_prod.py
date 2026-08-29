import re

# Fix Admin
path = "src/app/admin/productivity/page.tsx"
with open(path, "r") as f: content = f.read()
content = re.sub(r'if \(false\) \{.*?res = await getAdminProductivity\(organizationId \|\| ""\);\s*\}', 'res = await getAdminProductivity(organizationId || "");', content, flags=re.DOTALL)
with open(path, "w") as f: f.write(content)

# Fix PM
path = "src/app/pm/productivity/page.tsx"
with open(path, "r") as f: content = f.read()
content = re.sub(r'if \(false\) \{.*?res = await getPMProductivity\(user\?\.id \|\| ""\);\s*\} else \{.*?\}', 'res = await getPMProductivity(user?.id || "");', content, flags=re.DOTALL)
with open(path, "w") as f: f.write(content)

# Fix Vendor
path = "src/app/vendor/productivity/page.tsx"
with open(path, "r") as f: content = f.read()
content = re.sub(r'if \(false\) \{.*?\} else if \(false\) \{.*?\} else \{\s*res = await getAdminProductivity\(organizationId \|\| ""\);\s*\}', 'res = await getVendorProductivity(organizationId || ""); // Wait orgId is not vendorId but org_vendors maps it!', content, flags=re.DOTALL)
# For Vendor we need to import getVendorProductivity
content = content.replace('getAdminProductivity,', 'getVendorProductivity,')
with open(path, "w") as f: f.write(content)

