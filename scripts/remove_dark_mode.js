const fs = require('fs');
const path = require('path');

function replaceDarkClasses(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceDarkClasses(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // This regex matches "dark:" followed by Tailwind utility characters
            const newContent = content.replace(/dark:[a-zA-Z0-9-\/\[\]#:]+\s?/g, '');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

replaceDarkClasses('./app');
replaceDarkClasses('./components');
