import Start from "./Index";

// @ts-ignore
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import { WindowClass } from "eags";

const __dirname = exec("pwd");

export class Loader {
    private windows: WindowClass[] = [];
    private stylesheets = 0;

    constructor() {
        exec(`rm -rf ${__dirname}/.css`);
        exec(`mkdir ${__dirname}/.css`);
    }

    loadSass(...filenames: string[]) {
        for (let filename of filenames) {
            const cmd = `npx sass --no-source-map ${filename} ${__dirname}/.css/${this.stylesheets++}.css`;
            console.log(cmd);
            exec(cmd);
        }
    }

    loadWindows(...windows: WindowClass[]) {
        for (let window of windows) {
            if (!this.windows.includes(window)) {
                this.windows.push(window);
            }
        }
    }

    getWindows() {
        return this.windows;
    }

    transpileStylesheets() {
        exec('node transpile-scss.js');
    }
}

const loader = new Loader();
Start(loader);

loader.transpileStylesheets();

export default {
    style: __dirname + '/.css/out.css',
    windows: loader.getWindows()
}