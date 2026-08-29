with open("src/lib/config/navigation.tsx", "r") as f: content = f.read()
content = content.replace('href: "/vendor/scorecard"', 'href: "/vendor/productivity"')
with open("src/lib/config/navigation.tsx", "w") as f: f.write(content)
