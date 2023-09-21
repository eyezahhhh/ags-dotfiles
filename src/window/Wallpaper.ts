import { Box, Overlay, Revealer, Window } from "resource:///com/github/Aylur/ags/widget.js";

export interface Props {
    monitor: number
    wallpaper?: string
    revealDelay?: number
}

const revealer = (id: number) => Revealer({
    revealChild: !id,
    transition: 'crossfade',
    className: 'E-Wallpaper-inner',
    child: Box({
        className: 'E-Wallpaper-image',
        hexpand: true,
        vexpand: true
    })
});

export const Wallpaper = (props: Props) => {
    const revealers = [
        revealer(0),
        revealer(1)
    ];

    const overlay = Overlay({
        child: Box({
            hexpand: true,
            vexpand: true
        }),
        overlays: revealers
    });

    let id = 0;
    function nextRevealer() {
        id = ++id % 2;
        setTimeout(() => {
            revealers[1].revealChild = !!id;
        }, props.revealDelay || 100);
        return revealers[id];
    }

    const window = Window({
        layer: 'background',
        anchor: ['top', 'bottom', 'left', 'right'],
        monitor: props.monitor,
        name: `E-Wallpaper-${props.monitor}`,
        className: 'E-Wallpaper',
        style: props.wallpaper ? `background-image: url("${props.wallpaper}")` : undefined,
        child: overlay
    });

    return {
        window,
        setWallpaper: (wallpaper: string | null) => {
            const revealer = nextRevealer();
            revealer.child!.style = wallpaper ? `background-image: url("${wallpaper}")` : ''
        }
    }
}