const fs = require("fs");

const outName = process.argv[2] || 'out';

const dirname = __dirname + "/../.css";
const dir = fs.readdirSync(dirname);
let contents = '';
for (let filename of dir) {
    if (filename.startsWith('.')) {
        contents += fs.readFileSync(dirname + '/' + filename, 'utf-8') + '\n\n\n';
    }
}

fs.writeFileSync(dirname + `/${outName}.css`, contents.trim());

return dirname + `/${outName}.css`;