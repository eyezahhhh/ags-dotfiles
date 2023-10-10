const { exec, spawn } = require("child_process");

let timeout;

function reload() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        console.log("Reloading ags!");
        exec(`ags --run-js "reloadCss()"`);
    }, 500);
}


exec(`ags --run-js "getThemes()"`, async (error, raw) => {
    const themes = JSON.parse(raw);

    for (let theme of themes) {
        for (let [index, scss] of theme.scss.entries()) {
            const command = 'npx';
            const options = ['sass', '-w', '--no-source-map', scss, theme.css[index]];
            console.log(`${command} ${options.join(" ")}`);

            const sass = spawn(command, options);

            sass.stdout.on("data", data => {
                data = data.toString();
                console.log(data);

                const message = data.substring(19);
                if (data.substring(19).startsWith("Compiled ")) {
                    reload();
                }
            });

            sass.stderr.on("data", console.error);
            reload();
        }
    }
});