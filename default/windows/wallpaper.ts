import { Loader } from "../../src/Load";
import { Wallpaper } from "../../src/window/Wallpaper";

const w0 = Wallpaper({
    monitor: 0
});
(globalThis as any).setW0 = w0.setWallpaper;

const w1 = Wallpaper({
    monitor: 1
});
(globalThis as any).setW1 = w1.setWallpaper;


export default function(loader: Loader) {
    loader.loadWindows(true, w0.window, w1.window);
}