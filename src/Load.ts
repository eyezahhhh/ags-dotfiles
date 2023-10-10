import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import { getEnvs } from "./Utils";
import { Themes } from './service/Themes';
import { WindowType } from 'resource:///com/github/Aylur/ags/widget.js';

const __dirname = exec("pwd");

export class Loader {
    private windows: WindowType[] = [];
    private stylesheets: string[] = [];
    private readonly windowDelays: {[name: string]: number} = {};
    private notificationPopupTimeout = 5000;
    private readonly showOnLoad: WindowType[] = [];

    constructor() {
        exec(`rm -rf ${__dirname}/.css`);
        exec(`mkdir ${__dirname}/.css`);
    }

    loadWindows(show: boolean, ...windows: WindowType[]) {
        for (let window of windows) {
            window.hide();
            
            if (show && !this.showOnLoad.includes(window)) {
                this.showOnLoad.push(window);
            }

            if (!this.windows.includes(window)) {
                this.windows.push(window);
            }
        }
    }

    setWindowCloseDelay(window: WindowType | string, ms: number) {
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

    showWindows() {
        for (let window of this.showOnLoad) {
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
    windows: windows,
    closeWindowDelay: loader.getWindowCloseDelays(),
    notificationPopupTimeout: loader.getNotificationPopupTimeout()
}

loader.showWindows();

for (let callback of completeCallbacks) {
    callback();
}

console.log('Done!');