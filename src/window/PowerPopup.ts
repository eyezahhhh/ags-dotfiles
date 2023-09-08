import { Popup } from "./Popup";
import { LargeButton, Props as ButtonProps } from "../widget/LargeButton";
// @ts-ignore
import App from 'resource:///com/github/Aylur/ags/app.js';
import { BoxClass, WindowClass } from "eags";

export interface Props {
    monitor: number
    buttons: ButtonProps[]
    focusedButton?: number
}

export const PowerPopup = (props: Props) => {
    const popup = Popup({
        monitor: props.monitor,
        children: props.buttons.map(LargeButton),
        name: 'E-PowerPopup',
        props: {
            connections: [
                // @ts-ignore
                [App, (window: WindowClass, name: string, visible: boolean) => {
                    if (props.focusedButton && name == popup.name) {
                        const childToFocus = (window.child as BoxClass).children?.[props.focusedButton] || null;
                        // @ts-ignore
                        childToFocus?.grab_focus();
                    }
                }]
            ],
            className: 'E-PowerPopup'
        }
    });

    return {
        popup,
        setOpen: (open: boolean) => {
            if (open) {
                App.openWindow(popup.name);
            } else {
                App.closeWindow(popup.name);
            }
        }
    }
}