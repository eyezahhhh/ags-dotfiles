import * as Eags from "eags";
import { HyprlandWorkspaces } from "./widget/HyprlandWorkspaces.js";
import { Loader } from "./Load.js";
import { DateTime } from "./widget/DateTime.js";

const window = (monitor: number) => Eags.Window({
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


export default function start(loader: Loader) {
    loader.loadSass("style/style.scss", "user.scss");
    loader.loadWindows(window(0), window(1));
}