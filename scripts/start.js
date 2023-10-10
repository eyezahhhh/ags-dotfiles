const { exec, spawn } = require("child_process");
const { onExit } = require('@rauschma/stringio');

exec("pwd", (error, dir) => {
    if (error) {
        console.error("Error whilst trying to run 'pwd':", error);
        return;
    }
    exec("pkill ags", async () => {
        const command = `ags`;
        const options = ['-c', `${dir.trim()}/dist/src/Load.js`];
        console.log(`Starting AGS... (${command} ${options.join(' ')})`);
    
        const ags = spawn(command, options, {
            stdio: [process.stdin, process.stdout, process.stderr]
        });
    
        await onExit(ags);
        console.log('AGS shut down!');
    });
});
