const { existsSync } = require('fs');

const filenames = process.argv.slice(2);

for (let file of filenames) {
    if (existsSync(file)) {
        console.log(file);
    }
}