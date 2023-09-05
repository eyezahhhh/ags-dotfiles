import * as Eags from "eags";
import { HyprlandWorkspaces } from "./widget/HyprlandWorkspaces.js";
import { Loader } from "./Load.js";

const window = (monitor: number) => Eags.Window({
    anchor: ["top", "left", "right"],
    exclusive: true,
    monitor,
    name: `window-${monitor}`,
    child: Eags.CenterBox({
        startWidget: HyprlandWorkspaces({
            activeClassName: 'active',
            populatedClassName: 'populated'
        }),
        endWidget: Eags.Label({
            label: "cool beans",
            justification: "right"
        })
    })
});


export default function start(loader: Loader) {
    loader.loadSass("style.scss");
    loader.loadWindows(window(0), window(1));
}