import app from "resource:///com/github/Aylur/ags/app.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Box, Label, Slider, Window } from "resource:///com/github/Aylur/ags/widget.js";
import { Loader } from "../../src/Load";
import { Avr } from "../../src/service/Avr";
import { AvReceiver } from "../../src/widget/AvReceiver";
import { NotificationPopups } from "../../src/widget/NotificationPopups";
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
    child: Box({
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
});

const themes = PanelSection({
    child: ThemeSelector()
});

let vmHook: VMHook;
const vms = PanelSection({
    child: VirtualMachines({
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
});

const appVolume = PanelSection({
    child: VolumeSliders({
        audioType: 'apps',
        childProps: {
            showLabel: true
        },
        filter: stream => (stream.name != 'Scream' || stream.description != 'Virtual Machine') && (stream.name != 'looking-glass-client'),
        name: name => name
    })
});

const outVolume = PanelSection({
    child: VolumeSliders({
        audioType: 'speakers',
        childProps: {
            showLabel: true
        },
        filter: stream => stream.name != 'Scream' || stream.description != 'Virtual Machine',
        customSliders: [
            {
                initialValue: 50,
                name: "Amplifier",
                onChange: value => {
                    const adjustedValue = Math.round(Math.sqrt(value / 200) * 200);
                    Avr.setVolume(adjustedValue);
                    return value;
                },
                connections: [
                    [Avr, slider => {
                        const adjusted = Math.round(Math.min(Math.max((Avr.getStatus().volume / 200) ** 2 * 200, 0), 200));
                        slider.value = adjusted;
                    }]
                ],
                labelConnections: [
                    [Avr, label => {
                        const adjusted = Math.round(Math.min(Math.max((Avr.getStatus().volume / 200) ** 2 * 200, 0), 200));
                        label.label = `${adjusted}%`;
                    }]
                ]
            }
        ]
    })
});

const inVolume = PanelSection({
    child: VolumeSliders({
        audioType: 'microphones',
        childProps: {
            showLabel: true
        }
    })
});

Avr.setAddress("http://home-automata/avr");
const amp = PanelSection({
    child: AvReceiver({
        inputs: {
            'hdmi-1': 'Paige',
            'hdmi-2': 'HDMI 2',
            'hdmi-3': 'HDMI 3',
            'hdmi-4': 'HDMI 4',
            'hdmi-5': 'DJ',
            'hdmi-6': 'HDMI 6',
            'hdmi-7': 'Aux HDMI',
            'pc': 'PC',
            'phono': 'Phono',
            'fm': 'FM',
            'am': 'AM',
            'bluetooth': 'Bluetooth',
            'network': 'Network',
            'usb': 'USB'
        }
    })
});

const mainRow = new Row(
    amp,
    new Column(
        new Row(
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
        )
    )
);

const controlPanel = ControlPanel({
    layout: mainRow,
    monitor: 0,
    // connections: [
    //     [app, (window, windowName: string, visible: boolean) => {
    //         if (windowName == window.name) {
    //             if (visible) {
    //                 app.openWindow('E-Notifications');
    //             } else {
    //                 app.closeWindow('E-Notifications');
    //             }
    //         }
    //     }]
    // ]
});


// const notifications = (() => {
//     let lastClick = 0;

//     return NotificationPopups({
//         anchor: ['bottom', 'right'],
//         name: 'E-Notifications',
//         showAll: true,
//         monitor: 0,
//         layer: 'overlay',
//         innerProps: {
//             onPrimaryClick: () => {
//                 if (lastClick + 100 < Date.now()) {
//                     app.closeWindow('E-ControlPanel');
//                 }
//             }
//         },
//         containerProps: {
//             halign: 'end',
//             onPrimaryClick: () => {
//                 lastClick = Date.now();
//             }
//         }
//     });
// })();



export default function(loader: Loader) {
    loader.loadWindows(false, controlPanel);
}