import { Box, BoxArgs, Revealer, RevealerTransition, Window, WindowArgs } from "resource:///com/github/Aylur/ags/widget.js";
import { dcc } from "../Utils";
import App from 'resource:///com/github/Aylur/ags/app.js';

let popupCount = 0;

export interface Props {
    monitor: number
    children: Widget[]
    name?: string
    props?: Partial<WindowArgs>
    transition?: RevealerTransition
    innerProps?: Partial<BoxArgs>
}

export const Popup = (props: Props) => {
    const name = props.name || `E-Popup-${popupCount++}`;

    const window = Window({
        popup: true,
        focusable: true,
        anchor: [],
        ...props.props,
        monitor: props.monitor,
        name: name,
        layer: 'overlay',
        className: 'E-Popup' + dcc(props.props?.className),
        child: Box({
            className: 'E-Popup-outer',
            children: [
                Revealer({
                    transition: props.transition || 'none',
                    child: Box({
                        ...props.innerProps,
                        className: 'E-Popup-inner',
                        children: props.children
                    }),
                    connections: [
                        [App, (revealer, windowName: string, visible: boolean) => {
                            if (windowName == name) {
                                revealer.revealChild = visible;
                            }
                        }]
                    ]
                })
            ]
        })
    });

    return window;
}