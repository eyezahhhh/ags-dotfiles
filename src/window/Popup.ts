import { Box, Revealer, RevealerClass, Widget, Window, WindowClass } from "eags";
import { cc, dcc } from "../Utils";

let popupCount = 0;

export interface Props {
    monitor: number
    children: Widget[]
    name?: string
    props?: Partial<WindowClass>
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
            className: 'E-Popup-inner',
            children: props.children
        })
    });

    return window;
}