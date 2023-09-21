import { Loader } from "../../src/Load";
import { HyprlandWorkspaces } from "../../src/widget/HyprlandWorkspaces";
import { DateTime } from "../../src/widget/DateTime";
import App from 'resource:///com/github/Aylur/ags/app.js';
import { MediaPopup } from "../../src/window/MediaPopup";
import { CenterBox, EventBox, Window } from "resource:///com/github/Aylur/ags/widget.js";


const mainBar = Window({
    anchor: ["top", "left", "right"],
    monitor: 0,
    className: "window",
    name: `E-Bar-primary`,
    child: CenterBox({
        className: "bar",
        startWidget: HyprlandWorkspaces({
            activeClassName: 'active',
            populatedClassName: 'populated',
            props: {
                halign: 'start'
            }
        }),
        endWidget: EventBox({
            child: DateTime(),
            halign: 'end',
            className: 'E-EventBox',
            onPrimaryClick: () => {
                App.toggleWindow('E-StartMenu-0')
            }
        }) 
    })
});

const secondBar = Window({
    anchor: ["top", "left", "right"],
    monitor: 1,
    className: "window",
    name: `E-Bar-secondary`,
    child: CenterBox({
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

const mediaPopup = MediaPopup({
    monitor: 0,
    apps: [
        {
            icon: '/home/eyezah/.config/ags/assets/media-apps/pipe-bomb.png',
            command: 'chromium https://pipebomb.net'
        },
        {
            icon: '/usr/share/icons/hicolor/32x32/apps/vlc.png',
            command: 'vlc'
        }
    ]
});





export default function(loader: Loader) {
    loader.loadWindows(true, mainBar, secondBar, mediaPopup);
}