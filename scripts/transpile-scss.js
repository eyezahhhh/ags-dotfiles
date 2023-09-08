const fs = require("fs");

const dirname = __dirname + "/../.css";
const dir = fs.readdirSync(dirname);
let contents = '';
for (let filename of dir) {
    if (filename != 'out.css') {
        contents += fs.readFileSync(dirname + '/' + filename, 'utf-8') + '\n\n\n';
    }
}

fs.writeFileSync(dirname + '/out.css', contents.trim());

return dirname + '/out.css';