import { Service } from 'resource:///com/github/Aylur/ags/service.js';
import { execAsync, exec, writeFile, readFileAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

const __dirname = exec("pwd");

export class Theme {
    id: string
    name: string
    scss: string[]
    css: string[]
}

export class ThemesService extends Service {
    static {
        Service.register(this, {});
    }

    readonly themes = new Map<string, Theme>();
}

export class Themes {
    static {
        // @ts-expect-error
        Service['Themes'] = this;
    }

    private static current = 'forest';
    private static instance = new ThemesService();
    private static listeners: ((theme: Theme) => void)[] = [];

    static get themes() {
        return this.instance.themes;
    }

    static addThemes(...themes: Omit<Theme, "css">[]) {
        for (let theme of themes) {
            if (theme.id.includes('.')) {
                throw 'Theme IDs cannot include \'.\'';
            }
            this.instance.themes.set(theme.id, {
                ...theme,
                css: theme.scss.map((_, i) => `${__dirname}/.css/${theme.id}.${i}.css`)
            });
        }
        if (themes.length) {
            this.instance.emit('changed');
        }
    }

    static async compileStylesheets(theme: Theme) {
        await execAsync('node scripts/clear-temp-css.js');

        let sheetCount = 0;
        for (let [index, filename] of theme.scss.entries()) {
            await execAsync(`npx sass --no-source-map ${filename} ${theme.css[index]}`);
        }
    }
    

    static setTheme(id: string) {
        const theme = this.instance.themes.get(id);
        if (!theme) {
            throw 'Theme doesn\'t exist';
        }
        this.current = id;
        this.reloadCss();
        
        this.instance.emit('changed');
        writeFile(id, '.theme.txt');

        for (let listener of this.listeners) {
            listener(theme);
        }
    }

    static reloadCss() {
        App.resetCss();
        console.log('Applying css...');
        const theme = this.themes.get(this.current)!;
        try {
            for (let css of theme.css) {
                App.applyCss(css);
            }
        } catch (e) {
            console.error(e);
        }
    }

    static async setFromFile() {
        try {
            const id = await readFileAsync('.theme.txt');
            if (id && this.instance.themes.has(id)) {
                this.setTheme(id);
            }
        } catch {
            throw 'Failed to load theme from file.';
        }
    }

    static getTheme() {
        return this.themes.get(this.current) || null;
    }

    static onChange(callback: (theme: Theme) => void) {
        if (!this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }

        return () => {
            const index = this.listeners.indexOf(callback);
            if (index >= 0) {
                this.listeners.splice(index, 1);
            }
        }
    }
}

// @ts-expect-error
globalThis.reloadCss = () => Themes.reloadCss();

// @ts-expect-error
globalThis.getThemes = () => {
    const themes = Array.from(Themes.themes.values());
    return JSON.stringify(themes, null, 2);
}