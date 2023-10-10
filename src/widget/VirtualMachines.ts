import { Virsh } from "../service/Virsh";
import { VirtualMachine, Props as VMProps } from "./VirtualMachine";
import { dcc } from "../Utils";
import { Props as ScaleProps } from "./Scale";
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import { AudioStream, VolumeSlider } from "./VolumeSlider";
import { SimpleButton, Props as ButtonProps } from "./SimpleButton";
import { VirtualMachine as VM } from "../service/Virsh";
import { Box, BoxArgs, Label } from "resource:///com/github/Aylur/ags/widget.js";

export class Hook {
    setEnabled: (enabled: boolean) => void
    isEnabled: () => boolean
}

export interface Props {
    props?: Partial<BoxArgs>
    childProps?: VMProps
    filter?: (id: string) => boolean
    className?: string
    noticeClassName?: string
    volumeProps?: ScaleProps
    volumeStreamCriteria?: (stream: AudioStream) => boolean
    buttons?: ButtonProps[]
    hook?: (hook: Hook) => void
}

export const VirtualMachines = (props: Props = {}) => {
    const list = Box({
        vertical: true
    });

    let stream: AudioStream | null = null;
    let vmsEnabled = true;
    let vmList: VM[] = [];

    function buildList() {
        let vms = Array.from(Virsh.vms.values());
        if (props.filter) {
            const filter = props.filter!;
            vms = vms.filter(vm => filter(vm.id));
        }
        // @ts-expect-error
        vms.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase());
        vmList = vms;

        list.children?.forEach(c => c?.destroy());

        if (vms.length) {
            list.children = vms.map(vm => VirtualMachine(vm, {
                ...props.childProps,
                enabled: vmsEnabled
            }));
        } else {
            list.children = [
                Label({
                    label: 'No virtual machines found.',
                    className: 'E-VirtualMachines-notice' + dcc(props.noticeClassName)
                })
            ];
        }
        return vms;
    }

    if (props.hook) {
        props.hook({
            setEnabled: (enabled) => {
                vmsEnabled = enabled;
                buildList()
            },
            isEnabled: () => vmsEnabled
        })
    }

    function buildSlider() {
        if (!stream) {
            return null;
        }
        const vertical = !!vmList.length;
        return VolumeSlider(stream, {
            ...props.volumeProps,
            vertical,
            showLabel: !vertical
        })
    }

    const volume = props.volumeStreamCriteria ? Box({
        className: 'E-VirtualMachines-volume',
        connections: [
            [Audio, box => {
                const streams = Array.from(Audio.apps.values()) as AudioStream[];
                stream = streams.find(props.volumeStreamCriteria!) || null;
                box.children?.forEach(c => c?.destroy());
                box.children = [
                    buildSlider() 
                ];
            }]
        ]
    }) : null;

    const rightSide = Box({
        vertical: true,
        children: [
            Box({
                children: props.buttons?.map(SimpleButton)
            }),
            list
        ]
    });

    return Box({
        ...props.props,
        className: 'E-VirtualMachines' + dcc(props.className),
        children: [
            volume,
            rightSide
        ],
        connections: [
            [Virsh, box => {
                const vms = buildList();
                if (vms.length) {
                    box.children = [ volume, rightSide ];
                } else {
                    box.children = [ rightSide, volume ];
                }
                if (volume) {
                    volume.children?.forEach(c => c?.destroy());
                    volume.children = [
                        buildSlider() 
                    ];
                }
                box.vertical = !vms.length;
            }]
        ]
    })
}