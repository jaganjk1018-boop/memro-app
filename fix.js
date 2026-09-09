import fs from 'fs';
import path from 'path';

const cp1252Map = {
  '\u20ac': 0x80, '\u201a': 0x82, '\u0192': 0x83, '\u201e': 0x84, '\u2026': 0x85,
  '\u2020': 0x86, '\u2021': 0x87, '\u02c6': 0x88, '\u2030': 0x89, '\u0160': 0x8A,
  '\u2039': 0x8B, '\u0152': 0x8C, '\u017d': 0x8E, '\u2018': 0x91, '\u2019': 0x92,
  '\u201c': 0x93, '\u201d': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
  '\u02dc': 0x98, '\u2122': 0x99, '\u0161': 0x9A, '\u203a': 0x9B, '\u0153': 0x9C,
  '\u017e': 0x9E, '\u0178': 0x9F
};

function decodeString(content) {
  const bytes = [];
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (cp1252Map[c] !== undefined) {
      bytes.push(cp1252Map[c]);
    } else {
      const code = c.charCodeAt(0);
      if (code < 256) {
        bytes.push(code);
      } else {
        const encoded = Buffer.from(c, 'utf-8');
        for (let j = 0; j < encoded.length; j++) {
          bytes.push(encoded[j]);
        }
      }
    }
  }
  return Buffer.from(bytes).toString('utf-8');
}

// 1. Read recovered_translations_best_0.js
const recPath = 'recovered_translations_best_0.js';
if (!fs.existsSync(recPath)) {
  console.error("Recovered file not found!");
  process.exit(1);
}

let rawContent = fs.readFileSync(recPath, 'utf8');
let decoded = decodeString(rawContent);

// 2. Clean the formatting. 
// The browser subagent DOM capture might have some trailing characters or formatting issues.
// Let's ensure the JS block is valid.
// Let's replace 'Saarthi' and 'saarthi' with 'Memro' and 'memro'
decoded = decoded.replace(/Saarthi/g, 'Memro');
decoded = decoded.replace(/saarthi/g, 'memro');
decoded = decoded.replace(/सारथी/g, 'मेम्रो');
decoded = decoded.replace(/সারথি/g, 'মেম্রো');
decoded = decoded.replace(/সাৰথি/g, 'মেম্ৰ’');

// Let's check if the file ends properly.
// The recovered translations contains export const TRANSLATIONS = ... and const VOCALS = ...
// Let's verify and parse it if needed, or we can just verify it has both.
if (!decoded.includes('export const TRANSLATIONS =') || !decoded.includes('const VOCALS =')) {
  console.error("Decoded content does not contain TRANSLATIONS or VOCALS!");
  process.exit(1);
}

// 3. Read App.jsx
const appPath = 'src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

const startMarker = 'export const TRANSLATIONS =';
const endMarker = 'export default function App()';

const startIndex = appContent.indexOf(startMarker);
const endIndex = appContent.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end markers in App.jsx!");
  process.exit(1);
}

// Ensure decoded content ends with newline and is properly formatted
// Let's extract only the TRANSLATIONS and VOCALS definitions from decoded
const vIdx = decoded.indexOf('const VOCALS =');
const nextExport = decoded.indexOf('export default', vIdx);
const vocalsEndIndex = nextExport !== -1 ? decoded.lastIndexOf('};', nextExport) : decoded.lastIndexOf('};');

if (vocalsEndIndex === -1) {
  console.error("Could not find end of VOCALS in decoded content!");
  process.exit(1);
}

const cleanedDeclarations = decoded.substring(0, vocalsEndIndex + 2) + '\n\n';

const newAppContent = appContent.substring(0, startIndex) + cleanedDeclarations + appContent.substring(endIndex);

fs.writeFileSync(appPath, newAppContent, 'utf8');
console.log("Successfully updated App.jsx!");

