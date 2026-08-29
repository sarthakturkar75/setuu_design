with open("src/lib/config/navigation.tsx", "r") as f: content = f.read()

# Fix Engineer Project sidebar
if 'href: `/engineer/projects/${projectId}/update`' not in content:
    content = content.replace(
        '{ label: "Timeline", href: `/engineer/projects/${projectId}/timeline`',
        '{ label: "Status Update", href: `/engineer/projects/${projectId}/update`, icon: <Activity className="w-5 h-5" /> },\n                            { label: "Timeline", href: `/engineer/projects/${projectId}/timeline`'
    )

# Fix Vendor Project sidebar
vendor_project_sidebar = """
                    ...(projectId ? [{
                        title: "Project Delivery",
                        items: [
                            { label: "Project Details", href: `/vendor/projects/${projectId}`, icon: <LayoutDashboardIcon className="w-5 h-5" /> },
                            { label: "Materials", href: `/vendor/projects/${projectId}/materials`, icon: <PackageIcon className="w-5 h-5" /> },
                        ]
                    }] : [])
                ],"""
if 'href: `/vendor/projects/${projectId}`' not in content:
    content = content.replace(
        '                ],\n                bottomItems: [\n                    { label: "Vendor Scorecard"',
        vendor_project_sidebar + '\n                bottomItems: [\n                    { label: "Vendor Scorecard"'
    )

# Fix Client Project sidebar
client_project_sidebar = """
                    ...(projectId ? [{
                        title: "Project Monitoring",
                        items: [
                            { label: "Project Dashboard", href: `/client/projects/${projectId}`, icon: <LayoutDashboardIcon className="w-5 h-5" /> },
                            { label: "Timeline", href: `/client/projects/${projectId}/timeline`, icon: <CalendarIcon className="w-5 h-5" /> },
                            { label: "Reports", href: `/client/projects/${projectId}/reports`, icon: <FileTextIcon className="w-5 h-5" /> },
                        ]
                    }] : [])
                ],"""
if 'href: `/client/projects/${projectId}`' not in content:
    content = content.replace(
        '                ],\n                bottomItems: [\n                    { label: "Support"',
        client_project_sidebar + '\n                bottomItems: [\n                    { label: "Support"'
    )

with open("src/lib/config/navigation.tsx", "w") as f: f.write(content)
