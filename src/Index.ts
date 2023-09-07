import * as Eags from "eags";
import { HyprlandWorkspaces } from "./widget/HyprlandWorkspaces.js";
import { Loader } from "./Load.js";
import { DateTime } from "./widget/DateTime.js";
import { VirtualMachines } from "./widget/VirtualMachines.js";
import { VolumeSliders } from "./widget/VolumeSliders.js";

const bar = (monitor: number) => Eags.Window({
    anchor: ["top", "left", "right"],
    exclusive: true,
    monitor,
    className: "window",
    name: `window-${monitor}`,
    child: Eags.CenterBox({
        className: "bar",
        startWidget: HyprlandWorkspaces({
            activeClassName: 'active',
            populatedClassName: 'populated',
            props: {
                halign: 'start'
            }
        }),
        endWidget: DateTime({
            props: {
                halign: 'end'
            }
        })
    })
});

const startMenu = (monitor: number) => Eags.Window({
    anchor: ['top', 'right'],
    monitor,
    className: 'window',
    margin: [10, 10, 0, 0],
    child: Eags.Box({
        className: 'startMenu',
        vertical: true,
        children: [
            VirtualMachines({
                filter: id => !id.endsWith('-template'),
                props: {
                    vertical: true
                },
                childProps: {
                    icon: id => `/home/eyezah/.config/ags/assets/vms/${id}.png`
                }
            }),
            VolumeSliders({
                audioType: 'apps',
                childProps: {
                    showLabel: true
                },
                filter: stream => stream.name != 'Scream' || stream.description != 'Virtual Machine'
            })
        ]
    })
})


export default function start(loader: Loader) {
    loader.loadSass("style/style.scss", "user.scss");
    loader.loadWindows(bar(1), startMenu(0));
}