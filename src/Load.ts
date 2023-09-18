// @ts-ignore
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import { WindowClass } from "eags";
import { getEnvs } from "./Utils";
import { Themes } from './service/Themes';

const __dirname = exec("pwd");

export class Loader {
    private windows: WindowClass[] = [];
    private stylesheets = 0;
    private readonly windowDelays: {[name: string]: number} = {};
    private notificationPopupTimeout = 5000;
    private readonly showOnLoad: WindowClass[] = [];

    constructor() {
        exec(`rm -rf ${__dirname}/.css`);
        exec(`mkdir ${__dirname}/.css`);
    }

    loadGlobalSass(...filenames: string[]) {
        for (let filename of filenames) {
            const cmd = `npx sass --no-source-map ${filename} ${__dirname}/.css/.${this.stylesheets++}.css`;
            exec(cmd);
        }
    }

    loadWindows(show: boolean, ...windows: WindowClass[]) {
        for (let window of windows) {
            // @ts-ignore
            window.hide();
            
            if (show && !this.showOnLoad.includes(window)) {
                this.showOnLoad.push(window);
            }

            if (!this.windows.includes(window)) {
                this.windows.push(window);
            }
        }
    }

    setWindowCloseDelay(window: WindowClass | string, ms: number) {
        if (typeof window != 'string') {
            window = window.name!;
        }

        this.windowDelays[window] = ms;
    }

    getWindows() {
        return this.windows;
    }

    getWindowCloseDelays() {
        return this.windowDelays;
    }

    setNotificationPopupTimeout(ms: number) {
        this.notificationPopupTimeout = ms;
    }

    getNotificationPopupTimeout() {
        return this.notificationPopupTimeout;
    }

    async compileGlobalStylesheets() {
        await exec('node scripts/transpile-scss.js global');
    }

    showWindows() {
        for (let window of this.showOnLoad) {
            // @ts-ignore
            window.show();
        }
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
(globalThis as any).loader = loader;

const completeCallbacks: (() => void)[] = [];

for (let entrypoint of entrypoints) {
    try {
        const entry = (await import(entrypoint)).default as (loader: Loader) => Promise<void>;
        const callback = await entry(loader);
        if (typeof callback == 'function') {
            completeCallbacks.push(callback);
        }
        console.log(`Loaded ${entrypoint}`);
    } catch (e) {
        console.log(`Failed to load ${entrypoint}`);
        console.error(e);
    }
}


console.log('Compiling stylesheets...');
await loader.compileGlobalStylesheets();
const themes = Array.from(Themes.themes.values());
for (let theme of themes) {
    await Themes.compileStylesheets(theme);
}
console.log('Compiled stylesheets.');


const windows = loader.getWindows();
console.log(`Loading ${windows.length} windows:`);
for (let window of windows) {
    console.log(`- ${window.name}`);
}

export default {
    style: './.css/global.css',
    windows: windows,
    closeWindowDelay: loader.getWindowCloseDelays(),
    notificationPopupTimeout: loader.getNotificationPopupTimeout()
}

loader.showWindows();

for (let callback of completeCallbacks) {
    callback();
}

console.log('Done!');