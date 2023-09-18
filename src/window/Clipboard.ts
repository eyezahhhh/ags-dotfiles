// @ts-ignore
import App from 'resource:///com/github/Aylur/ags/app.js';
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { Box, BoxClass, Button, Label, RevealerTransition } from "eags"
import { Popup } from './Popup';

export interface Secret  {
    name: string
    value: string | (() => string)
}

export interface Props {
    monitor: number
    secrets: Secret[]
    transition?: RevealerTransition
    focusedEntry?: number
}

export const Clipboard = (props: Props) => {
    const popup = Popup({
        monitor: props.monitor,
        name: 'E-Clipboard',
        transition: props.transition,
        props: {
            
            className: 'E-Clipboard',
        },
        innerProps: {
            vertical: true,
            connections: [
                // @ts-ignore
                [App, (box: BoxClass, name: string) => {
                    if (props.focusedEntry !== undefined && name == popup.name) {
                        const childToFocus = box.children?.[props.focusedEntry] || null;
                        // @ts-ignore
                        childToFocus?.grab_focus();
                    }
                }]
            ],
        },
        children: props.secrets.map(secret => Button({
            className: 'E-Clipboard-secret',
            child: Label({
                label: secret.name
            }),
            onClicked: () => {
                const output = typeof secret.value == 'string' ? secret.value : secret.value();
                execAsync(`wl-copy ${output}`);
                App.closeWindow(popup.name);
            }
        }))
    });

    return popup;
}