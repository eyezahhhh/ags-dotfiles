import { Loader } from "../src/Load";
import { PowerPopup } from "../src/window/PowerPopup";
// @ts-ignore
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

const powerMenu = PowerPopup({
    monitor: 0,
    buttons: [
        {
            label: '',
            props: {
                onClicked: 'shutdown 0'
            }
        },
        {
            label: '',
            props: {
                onClicked: 'reboot'
            }
        },
        {
            label: '',
            props: {
                onClicked: 'hyprctl dispatch exit'
            }
        },
        {
            label: '',
            props: {
                onClicked: () => {
                    powerMenu.setOpen(false);
                    setTimeout(() => {
                        exec('swaylock -f --screenshots --effect-blur 10x3 --clock --grace 5 --fade-in 0.5')
                    }, 700);
                }
            }
        },
        {
            label: '',
            props: {
                onClicked: () => powerMenu.setOpen(false)
            }
        }
    ],
    focusedButton: 3,
    transition: 'slide_up'
});

export default function(loader: Loader) {
    loader.loadWindows(powerMenu.popup);
}

// @ts-ignore
globalThis.setPowerMenuOpen = powerMenu.setOpen;