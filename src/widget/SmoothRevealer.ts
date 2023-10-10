import { Box, Revealer } from "resource:///com/github/Aylur/ags/widget.js"

export interface Props {
    child: Widget
    visible?: boolean
    spacerHeight: number
    transitionDuration?: number
}

export const SmoothRevealer = (props: Props) => {
    const spacer = Revealer({
        revealChild: !props.visible,
        child: Box({
            style: `min-height: ${props.spacerHeight}px`
        }),
        transition: 'slide_down',
        transitionDuration: props.transitionDuration ?? 250
    });

    const inner = Revealer({
        revealChild: !!props.visible,
        child: props.child,
        transition: 'crossfade',
        transitionDuration: props.transitionDuration ?? 250
    });

    const box = Box({
        vertical: true,
        children: [
            spacer,
            inner
        ]
    });

    function setVisible(visible: boolean) {
        inner.revealChild = visible;
        spacer.revealChild = !visible;
    }

    return {
        child: box,
        setVisible
    }
}