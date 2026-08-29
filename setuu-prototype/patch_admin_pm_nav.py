with open("src/lib/config/navigation.tsx", "r") as f: content = f.read()

# Add Productivity to PM
content = content.replace(
    '                bottomItems: [\n                    {\n                        label: "View Calendar",\n                        href: `/${role}/calendar`,',
    '                bottomItems: [\n                    {\n                        label: "Productivity",\n                        href: `/${role}/productivity`,\n                        icon: <Activity className="w-5 h-5" />,\n                    },\n                    {\n                        label: "View Calendar",\n                        href: `/${role}/calendar`,'
)

with open("src/lib/config/navigation.tsx", "w") as f: f.write(content)
