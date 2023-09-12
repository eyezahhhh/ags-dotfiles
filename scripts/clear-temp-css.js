const fs = require("fs");

const dirname = __dirname + "/../.css";
const dir = fs.readdirSync(dirname);
let contents = '';
for (let filename of dir) {
    if (filename.startsWith('.')) {
        fs.rmSync(dirname + '/' + filename);
    }
}