const fs = require('fs');
const appCssPath = 'c:\\Users\\hp\\OneDrive\\Desktop\\Kasa_Saffron Home\\kasa-saffron-react\\src\\App.css';
const newMobCssPath = 'c:\\Users\\hp\\OneDrive\\Desktop\\Kasa_Saffron Home\\kasa-saffron-react\\src\\new_mob.css';

let appCss = fs.readFileSync(appCssPath, 'utf8');
let newMobCss = fs.readFileSync(newMobCssPath, 'utf8');

// Find the boundaries of the corrupted/old CSS
const startIdx = appCss.indexOf('/* ═══════════════════════════════════════════════════════════════════\r\n   NEOMORPHIC STORYTELLING');
let actualStartIdx = startIdx;
if (startIdx === -1) {
    // try to find the mojibake boundary
    const fallBackIdx = appCss.indexOf('font-weight: 500;\r\n    opacity: 0.7;\r\n    margin-top: 10px;\r\n    max-width: 85%;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}');
    if (fallBackIdx !== -1) {
        actualStartIdx = fallBackIdx + 'font-weight: 500;\r\n    opacity: 0.7;\r\n    margin-top: 10px;\r\n    max-width: 85%;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}'.length + 1;
    }
}

const endIdx = appCss.indexOf('/* ═══════════════════════════════════════════════════════════════════\r\n   MOBILE NAVBAR OVERRIDES');
let actualEndIdx = endIdx;
if (endIdx === -1) {
     const fallbackEndIdx = appCss.indexOf('@media (max-width: 768px) {\r\n\r\n    /* Override the fixed bottom navbar');
     if (fallbackEndIdx !== -1) {
         // go back up to find the start of the comment block
         actualEndIdx = appCss.lastIndexOf('/* ', fallbackEndIdx);
     }
}

if (actualStartIdx !== -1 && actualEndIdx !== -1 && actualStartIdx < actualEndIdx) {
    const before = appCss.substring(0, actualStartIdx);
    const after = appCss.substring(actualEndIdx);
    const newContent = before + '\n\n' + newMobCss + '\n\n' + after;
    fs.writeFileSync(appCssPath, newContent, 'utf8');
    console.log('Successfully replaced CSS block using Node!');
} else {
    console.error('Could not find boundaries!', {actualStartIdx, actualEndIdx});
}
