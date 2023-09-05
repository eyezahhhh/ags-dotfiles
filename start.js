const { exec } = require("child_process");

exec("pwd", (error, dir) => {
    if (error) {
        console.error("Error whilst trying to run 'pwd':", error);
        return;
    }

    const command = `ags -c ${dir.trim()}/dist/Load.js`;
    console.log(`Starting AGS... (${command})`);

    exec(command, (error, stdout) => {
        console.log(error, stdout);
    });
})