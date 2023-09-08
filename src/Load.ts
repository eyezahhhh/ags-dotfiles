// @ts-ignore
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import { WindowClass } from "eags";
import { getEnvs } from "./Utils";

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

const env = getEnvs();
const entrypoints = (env.ENTRY as string).split(',').filter(e => e).map(e => e.trim()).map(e => {
    if (e.startsWith('/')) {
        return e;
    }
    if (e.startsWith('./')) {
        return '.' + e;
    }
    return '../' + e;
});

const loader = new Loader();

for (let entrypoint of entrypoints) {
    try {
        console.log(`Loading ${entrypoint}`);
        const entry = (await import(entrypoint)).default as (loader: Loader) => Promise<void>;
        await entry(loader);
        console.log(`Loaded ${entrypoint}`);
    } catch (e) {
        console.log(`Failed to load ${entrypoint}`);
        console.error(e);
    }
}

console.log(`Transpiling stylesheets...`);
loader.transpileStylesheets();
console.log(`Transpiled stylesheets`);

export default {
    style: __dirname + '/.css/out.css',
    windows: loader.getWindows()
}