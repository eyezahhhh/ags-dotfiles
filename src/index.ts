import * as Eags from "eags";
import { HyprlandWorkspaces } from "./widget/HyprlandWorkspaces.js";

const window = (monitor: number) => Eags.Window({
    anchor: ["top", "left", "right"],
    exclusive: true,
    monitor,
    name: `window-${monitor}`,
    child: Eags.CenterBox({
        startWidget: HyprlandWorkspaces(),
        endWidget: Eags.Label({
            label: "cool",
            justification: "right"
        })
    })
});

export default {
    windows: [window(0)]
}