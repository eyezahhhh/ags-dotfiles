import { Loader } from "../../src/Load";
import { exec, readFileAsync, writeFile } from 'resource:///com/github/Aylur/ags/utils.js';
import { Themes } from "../../src/service/Themes";
import { getLoggedInUser } from "../../src/Utils";


Themes.onChange(theme => {
    const themeDir = `/home/eyezah/Desktop/Themes/${theme.id}`;

    const setW0 = (globalThis as any).setW0 as (path: string) => void;
    setW0(`${themeDir}/wallpaper-0.jpg`);
    const setW1 = (globalThis as any).setW1 as (path: string) => void;
    setW1(`${themeDir}/wallpaper-1.jpg`);

    readFileAsync(`${themeDir}/hyprland.conf`).then(contents => {
        writeFile(contents, `/home/${getLoggedInUser()}/.config/hypr/theme.conf`);
    });

    exec(`wal -f ${themeDir}/theme.json`);
    exec(`pywalfox update`);
    exec(`./default/generate-chromium.sh`);
});

Themes.addThemes({
    id: 'mountains',
    name: 'Mountains',
    scss: ['default/themes/mountains.scss']
}, {
    id: 'forest',
    name: 'Forest',
    scss: ['default/themes/forest.scss']
}, {
    id: 'vaporwave',
    name: 'Vaporwave',
    scss: ['default/themes/vaporwave.scss']
}, {
    id: 'cement',
    name: 'Cement',
    scss: ['default/themes/cement.scss']
});




export default function() {
    return () => {
        Themes.setFromFile().catch(() => {
            Themes.setTheme('mountains'); // default to mountains theme if couldn't load from file
        });
    }
}