import { Loader } from "../src/Load";
import { PowerPopup } from "../src/window/PowerPopup";

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
            label: ''
        },
        {
            label: ''
        },
        {
            label: '',
            props: {
                onClicked: () => powerMenu.setOpen(false)
            }
        }
    ],
    focusedButton: 4
});

export default function(loader: Loader) {
    loader.loadWindows(powerMenu.popup);
}

// @ts-ignore
globalThis.setPowerMenuOpen = powerMenu.setOpen;