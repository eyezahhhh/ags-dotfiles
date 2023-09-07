import { Box, BoxClass, Label } from "eags";
import { Virsh } from "../service/Virsh";
import { VirtualMachine, Props as VMProps } from "./VirtualMachine";
import { cc } from "../Utils";
import { Props as ScaleProps } from "./Scale";
// @ts-ignore
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import { AudioStream, VolumeSlider } from "./VolumeSlider";

export interface Props {
    props?: Partial<BoxClass>
    childProps?: VMProps
    filter?: (id: string) => boolean
    className?: string
    noticeClassName?: string
    volumeProps?: ScaleProps
    volumeStreamCriteria?: (stream: AudioStream) => boolean
}

export const VirtualMachines = (props: Props = {}) => {
    const list = Box({
        vertical: true
    });

    let stream: AudioStream | null = null;

    function buildSlider(vertical: boolean) {
        if (!stream) {
            return null;
        }
        return VolumeSlider(stream, {
            ...props.volumeProps,
            vertical,
            showLabel: !vertical
        })
    }

    const volume = props.volumeStreamCriteria ? Box({
        connections: [
            [Audio, box => {
                const streams = Array.from(Audio.apps.values()) as AudioStream[];
                stream = streams.find(props.volumeStreamCriteria!) || null;
                box.children?.forEach(c => c?.destroy());
                box.children = [
                    buildSlider(true) 
                ];
            }]
        ]
    }) : null;

    return Box({
        ...props.props,
        className: 'E-VirtualMachines' + cc(props.className, props.className),
        children: [
            volume,
            list
        ],
        connections: [
            [Virsh, box => {
                let vms = Array.from(Virsh.vms.values());
                if (props.filter) {
                    const filter = props.filter!;
                    vms = vms.filter(vm => filter(vm.id));
                }
                // @ts-ignore
                vms.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase())

                // @ts-ignore
                list.children?.forEach(c => c.destroy());

                if (vms.length) {
                    list.children = vms.map(vm => VirtualMachine(vm, props.childProps));
                    box.children = [ volume, list ];
                } else {
                    list.children = [
                        Label({
                            label: 'No virtual machines found.',
                            className: 'E-VirtualMachines-notice' + cc(props.noticeClassName, props.noticeClassName)
                        })
                    ];
                    box.children = [ list, volume ];
                }
                if (volume) {
                    volume.children?.forEach(c => c?.destroy());
                    volume.children = [
                        buildSlider(!!vms.length) 
                    ];
                }
                box.vertical = !vms.length;
            }]
        ]
    })
}