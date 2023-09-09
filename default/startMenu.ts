import { Loader } from "../src/Load";
import { VolumeSliders } from "../src/widget/VolumeSliders";
import { Hook as VMHook, VirtualMachines } from "../src/widget/VirtualMachines.js";
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import * as Eags from "eags";
import { NetworkUsage } from "../src/widget/NetworkUsage";
import { formatFileSize } from "../src/Utils";
import { MediaSection } from "../src/widget/MediaSection";
import { SimpleButton } from "../src/widget/SimpleButton";

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

const startMenu = (monitor: number) => Eags.Window({
    anchor: ['top', 'right'],
    monitor,
    className: 'window',
    margin: [10, 10, 0, 0],
    name: `E-StartMenu-${monitor}`,
    child: Eags.Box({
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
            NetworkUsage({
                interface: 'eno1',
                receiveLabel: speed => ` ${formatFileSize(speed)}`,
                sendLabel: speed => ` ${formatFileSize(speed)}`,
                props: {
                    halign: 'center'
                }
            }),
            MediaSection()
        ]
    })
})


export default function(loader: Loader) {
    loader.loadWindows(startMenu(0));
}