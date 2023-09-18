import { Box, BoxClass, Label, Revealer, RevealerClass, RevealerTransition, Widget, Window, WindowClass } from "eags";
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
    innerProps?: Partial<BoxClass>
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