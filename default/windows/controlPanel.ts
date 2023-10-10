import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Box, Label } from "resource:///com/github/Aylur/ags/widget.js";
import { Loader } from "../../src/Load";
import { Themes } from "../../src/service/Themes";
import { SimpleButton } from "../../src/widget/SimpleButton";
import { ThemeSelector } from "../../src/widget/ThemeSelector";
import { Hook as VMHook, VirtualMachines } from "../../src/widget/VirtualMachines";
import { VolumeSliders } from "../../src/widget/VolumeSliders";
import { Column, ControlPanel, PanelSection, Row } from "../../src/window/ControlPanel";

// const buttons = PanelSection({
//     children: [
//         SimpleButton({
//             label: '',
//             props: {
//                 onClicked: () => {
//                     console.log('clicked!');
//                 }
//             }
//         })
//     ]
// });

const clock = PanelSection({
    vexpand: true,
    className: 'E-ControlPanel-clock',
    children: [
        Box({
            valign: 'center',
            vertical: true,
            children: [
                Label({
                    className: 'E-ControlPanel-clock-time',
                    connections: [
                        [1000, label => execAsync(['date', '+%H:%M:%S']).then((time: string) => label.label = time).catch(console.error)]
                    ]
                }),
                Label({
                    className: 'E-ControlPanel-clock-date',
                    connections: [
                        [1000, label => execAsync(['date', '+%A_%_d_%B']).then((time: string) => label.label = time.split('_').join(' ')).catch(console.error)]
                    ]
                })
            ]
        })
    ]
});

const themes = PanelSection({
    children: [
        ThemeSelector()
    ]
});

let vmHook: VMHook;
const vms = PanelSection({
    children: [
        VirtualMachines({
            className: 'E-ControlPanel-virtualmachines',
            filter: id => !id.endsWith('-template'),
            childProps: {
                icon: id => `/home/eyezah/.config/ags/assets/vms/${id}.png`,
                loadingIcon: '/home/eyezah/.config/ags/assets/vms/Loading.png',
                errorIcon: '/home/eyezah/.config/ags/assets/vms/Error.jpg'
            },
            hook: (hook) => vmHook = hook,
            volumeStreamCriteria: stream => (stream.name == 'Scream' && stream.description == 'Virtual Machine') || stream.name == 'looking-glass-client',
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
        })
    ]
});

const appVolume = PanelSection({
    children: [
        VolumeSliders({
            audioType: 'apps',
            childProps: {
                showLabel: true
            },
            filter: stream => (stream.name != 'Scream' || stream.description != 'Virtual Machine') && (stream.name != 'looking-glass-client'),
            name: name => name
        })
    ]
});

const outVolume = PanelSection({
    children: [
        VolumeSliders({
            audioType: 'speakers',
            childProps: {
                showLabel: true
            },
            filter: stream => stream.name != 'Scream' || stream.description != 'Virtual Machine'
        })
    ]
});

const inVolume = PanelSection({
    children: [
        VolumeSliders({
            audioType: 'microphones',
            childProps: {
                showLabel: true
            }
        })
    ]
});

const mainRow = new Row(
    new Column(
        // buttons,
        clock,
        themes
    ),
    vms,
    new Column(
        appVolume,
        outVolume,
        inVolume
    )
);

const controlPanel = ControlPanel({
    layout: mainRow,
    monitor: 0
});



export default function(loader: Loader) {
    loader.loadWindows(false, controlPanel);
}