import { Loader } from "../../src/Load";
import { VolumeSliders } from "../../src/widget/VolumeSliders";
import { Hook as VMHook, VirtualMachines } from "../../src/widget/VirtualMachines.js";
import { execAsync, exec } from 'resource:///com/github/Aylur/ags/utils.js';
import { MediaSection } from "../../src/widget/MediaSection";
import { ThemeSelector } from "../../src/widget/ThemeSelector";
import { Themes } from "../../src/service/Themes";
import { Box, Window } from "resource:///com/github/Aylur/ags/widget.js";


let vmHook: VMHook;
const vms = VirtualMachines({
    filter: id => !id.endsWith('-template'),
    childProps: {
        icon: id => `/home/eyezah/.config/ags/assets/vms/${id}.png`,
        loadingIcon: '/home/eyezah/.config/ags/assets/vms/Loading.png',
        errorIcon: '/home/eyezah/.config/ags/assets/vms/Error.jpg'
    },
    hook: (hook) => vmHook = hook,
    volumeStreamCriteria: stream => stream.name == 'Scream' && stream.description == 'Virtual Machine',
    buttons: [
        {
            label: '',
            props: {
                onClicked: 'looking-glass-client'
            }
        },
        {
            label: '',
            props: {
                onClicked: 'virt-manager'
            }
        },
        {
            label: '+',
            props: {
                onClicked: async () => {
                    if (!vmHook.isEnabled()) return;
                    vmHook.setEnabled(false);
                    try {
                        await execAsync('virt-clone --connect qemu:///system -o Windows-11-template --auto-clone -n New-VM');
                    } catch (e) {
                        console.error(e);
                    }
                    vmHook.setEnabled(true);
                }
            }
        }
    ]
});

const startMenu = (monitor: number) => Window({
    anchor: ['top', 'right'],
    monitor,
    className: 'window',
    margin: [65, 10, 0, 0],
    name: `E-StartMenu-${monitor}`,
    popup: true,
    focusable: true,
    child: Box({
        className: 'startMenu',
        vertical: true,
        children: [
            vms,
            VolumeSliders({
                audioType: 'apps',
                childProps: {
                    showLabel: true
                },
                filter: stream => stream.name != 'Scream' || stream.description != 'Virtual Machine'
            }),
            MediaSection(),
            ThemeSelector()
        ]
    })
})

Themes.onChange(theme => {
    const themeDir = `/home/eyezah/Desktop/Themes/${theme.id}`;

    const setW0 = (globalThis as any).setW0 as (path: string) => void;
    setW0(`${themeDir}/wallpaper-0.jpg`);
    const setW1 = (globalThis as any).setW1 as (path: string) => void;
    setW1(`${themeDir}/wallpaper-1.jpg`);

    exec(`wal -f ${themeDir}/theme-1.json`);
    exec(`pywalfox update`);
    exec(`./default/generate-chromium.sh`);
});

Themes.addThemes({
    id: 'mountains',
    name: 'Mountains',
    stylesheets: [
        'default/themes/mountains.scss'
    ]
}, {
    id: 'forest',
    name: 'Forest',
    stylesheets: [
        'default/themes/forest.scss'
    ]
}, {
    id: 'vaporwave',
    name: 'Vaporwave',
    stylesheets: [
        'default/themes/vaporwave.scss'
    ]
});




export default function(loader: Loader) {
    loader.loadWindows(false, startMenu(0));

    return () => {
        Themes.setFromFile().catch(() => {
            Themes.setTheme('mountains'); // default to mountains theme if couldn't load from file
        });
    }
}