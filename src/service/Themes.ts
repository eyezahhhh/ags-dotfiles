// @ts-ignore
import { Service } from 'resource:///com/github/Aylur/ags/service.js';
// @ts-ignore
import { execAsync, exec } from 'resource:///com/github/Aylur/ags/utils.js';
// @ts-ignore
import App from 'resource:///com/github/Aylur/ags/app.js';

const __dirname = exec("pwd");

export class Theme {
    id: string
    name: string
    stylesheets: string[]
}

export class ThemesService extends Service {
    static {
        Service.register(this, {});
    }

    readonly themes = new Map<string, Theme>();
}

export class Themes {
    static {
        Service['Themes'] = this;
    }

    private static current = 'forest';
    private static instance = new ThemesService();
    private static listeners: ((theme: Theme) => void)[] = [];

    static get themes() {
        return this.instance.themes;
    }

    static addThemes(...themes: Theme[]) {
        for (let theme of themes) {
            if (theme.id.startsWith('.')) {
                throw 'Theme IDs cannot start with \'.\'';
            }
            if (theme.id == 'global') {
                throw 'Theme ID cannot be \'global\'';
            }
            this.instance.themes.set(theme.id, theme);
        }
        if (themes.length) {
            // @ts-ignore
            this.instance.emit('changed');
        }
    }

    static async compileStylesheets(theme: Theme) {
        await execAsync('node scripts/clear-temp-css.js');

        let sheetCount = 0;
        for (let filename of theme.stylesheets) {
            await execAsync(`npx sass --no-source-map ${filename} ${__dirname}/.css/.${sheetCount++}.css`);
        }
        await execAsync(`node scripts/transpile-scss.js ${theme.id}`);
    }

    static setTheme(id: string) {
        const theme = this.instance.themes.get(id);
        if (!theme) {
            throw 'Theme doesn\'t exist';
        }
        this.current = id;
        App.resetCss();
        App.applyCss('.css/global.css');
        App.applyCss(this.getStylesheet());
        // @ts-ignore
        this.instance.emit('changed');

        for (let listener of this.listeners) {
            listener(theme);
        }
    }

    static getTheme() {
        return this.themes.get(this.current) || null;
    }

    static getStylesheet() {
        return `${__dirname}/.css/${this.current}.css`;
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