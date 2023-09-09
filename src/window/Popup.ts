import { Box, Label, Revealer, RevealerClass, RevealerTransition, Widget, Window, WindowClass } from "eags";
import { dcc } from "../Utils";
// @ts-ignore
import App from 'resource:///com/github/Aylur/ags/app.js';

let popupCount = 0;

export interface Props {
    monitor: number
    children: Widget[]
    name?: string
    props?: Partial<WindowClass>
    transition?: RevealerTransition
}

export const Popup = (props: Props) => {
    const name = props.name || `E-Popup-${popupCount++}`;

    const window = Window({
        ...props.props,
        anchor: [],
        monitor: props.monitor,
        name: name,
        className: 'E-Popup' + dcc(props.props?.className),
        popup: true,
        focusable: true,
        child: Box({
            className: 'E-Popup-outer',
            children: [
                Revealer({
                    transition: props.transition || 'none',
                    child: Box({
                        className: 'E-Popup-inner',
                        children: props.children
                    }),
                    connections: [
                        // @ts-ignore
                        [App, (revealer: RevealerClass, windowName: string, visible: boolean) => {
                            if (windowName == name) {
                                // @ts-ignore
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