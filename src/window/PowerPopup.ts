import { Popup } from "./Popup";
import { LargeButton, Props as ButtonProps } from "../widget/LargeButton";
// @ts-ignore
import App from 'resource:///com/github/Aylur/ags/app.js';
import { BoxClass, RevealerTransition } from "eags";

export interface Props {
    monitor: number
    buttons: ButtonProps[]
    focusedButton?: number
    transition?: RevealerTransition
}

export const PowerPopup = (props: Props) => {
    const popup = Popup({
        monitor: props.monitor,
        children: props.buttons.map(LargeButton),
        name: 'E-PowerPopup',
        transition: props.transition,
        props: {
            className: 'E-PowerPopup'
        },
        innerProps: {
            connections: [
                // @ts-ignore
                [App, (box: BoxClass, name: string) => {
                    if (props.focusedButton && name == popup.name) {
                        const childToFocus = box.children?.[props.focusedButton] || null;
                        // @ts-ignore
                        childToFocus?.grab_focus();
                    }
                }]
            ]
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