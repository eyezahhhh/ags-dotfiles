import { Box, Button, Label } from "resource:///com/github/Aylur/ags/widget.js";
import { VirtualMachine as VM, VirtualMachineState } from "../service/Virsh";
import { cc, dcc, wait } from "../Utils";
import { Image } from "./Image";

export interface Props {
    nameBeautify?: (id: string) => string
    className?: string
    icon?: (id: string) => string
    loadingIcon?: string
    errorIcon?: string
    iconSize?: number
    iconClassName?: string
    nameClassName?: string
    statusClassName?: string
    buttonClassName?: string
    state?: (state: VirtualMachineState) => string | null
    buttonLabel?: (state: VirtualMachineState) => string
    loadingLabel?: string
    enabled?: boolean
}

function defaultNameBeautify(id: string) {
    return id.split('-').join(' ')
}

function defaultStateTranslate(state: VirtualMachineState): string | null {
    switch (state) {
        case VirtualMachineState.CRASHED: return 'Crashed';
        case VirtualMachineState.DYING: return 'Dying';
        case VirtualMachineState.IDLE: return 'Idle';
        case VirtualMachineState.OFF: return null;
        case VirtualMachineState.PAUSED: return 'Paused';
        case VirtualMachineState.RUNNING: return 'Running';
        case VirtualMachineState.SHUTTING_DOWN: return 'Shutting down';
        case VirtualMachineState.SLEEPING: 'Sleeping';
        default: return 'State unknown';
    }
}

function stateAction(vm: VM): (() => Promise<void>) |  null {
    switch (vm.state) {
        case VirtualMachineState.OFF: return vm.start;
        case VirtualMachineState.SHUTTING_DOWN:
        case VirtualMachineState.DYING: return null;
        default: return vm.stop;
    }
}

function defaultButtonLabel(state: VirtualMachineState): string {
    switch (state) {
        case VirtualMachineState.OFF:
        case VirtualMachineState.CRASHED: return '';
        case VirtualMachineState.SHUTTING_DOWN:
        case VirtualMachineState.DYING: return '';
        default: return '';
    }
}

export const VirtualMachine = (vm: VM, props: Props = {}) => {
    const state = props.state ? props.state(vm.state) : defaultStateTranslate(vm.state);
    const action = props.enabled !== false ? stateAction(vm) : null;

    let loading = false;
    const buttonLabel = action ? Label({
        label: props.buttonLabel ? props.buttonLabel(vm.state) : defaultButtonLabel(vm.state)
    }) : undefined;

    return Box({
        className: 'E-VirtualMachine' + cc(props.enabled === false, 'E-VirtualMachine-disabled') + dcc(props.className),
        children: [
            props.icon ? Image({
                loadingSrc: props.loadingIcon,
                errorSrc: props.errorIcon,
                size: props.iconSize || 48,
                className: 'E-VirtualMachine-icon' + dcc(props.iconClassName),
                src: props.icon(vm.id)
            }) : null,
            Box({
                hexpand: true,
                vertical: true,
                children: [
                    Label({
                        halign: 'start',
                        vexpand: true,
                        label: props.nameBeautify ? props.nameBeautify(vm.id) : defaultNameBeautify(vm.id),
                        className: 'E-VirtualMachine-name' + dcc(props.nameClassName)
                    }),
                    state ? Label({
                        halign: 'start',
                        label: state,
                        className: 'E-VirtualMachine-status' + dcc(props.statusClassName)
                    }) : null
                ]
            }),
            action ? Button({
                child: buttonLabel,
                className: 'E-VirtualMachine-button' + dcc(props.buttonClassName),
                valign: 'center',
                onClicked: async () => {
                    if (loading || vm.state == VirtualMachineState.SHUTTING_DOWN || vm.state == VirtualMachineState.DYING) return;
                    loading = true;
                    buttonLabel!.label = props.loadingLabel ?? '';
                    await action();
                    await wait(500);
                    buttonLabel!.label = props.buttonLabel ? props.buttonLabel(vm.state) : defaultButtonLabel(vm.state);
                    loading = false;
                }
            }) : null
        ]
    })
}