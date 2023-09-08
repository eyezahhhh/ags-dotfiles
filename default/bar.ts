import { Loader } from "../src/Load";
import * as Eags from "eags";
import { HyprlandWorkspaces } from "../src/widget/HyprlandWorkspaces";
import { DateTime } from "../src/widget/DateTime";

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

export default function(loader: Loader) {
    loader.loadSass("default/style.scss", "default/user.scss");
    loader.loadWindows(bar(1));
}