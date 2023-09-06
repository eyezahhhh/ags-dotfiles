import { Box, Label } from "eags";
// @ts-ignore
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import { AudioStream, VolumeSlider } from "./VolumeSlider";
import { cc } from "../Utils";

export interface Props {
    audioType?: 'speakers' | 'microphones' | 'apps'
    className?: string
    labelClassName?: string
}

export const VolumeSliders = (props: Props = {}) => Box({
    vertical: true,
    className: 'E-VolumeSliders' + cc(props.className, props.className),
    connections: [
        [Audio, box => {
            const streams = Array.from(Audio[props.audioType || 'speakers'].values()) as AudioStream[];
            // @ts-ignore
            box.children?.forEach(c => c.destroy());

            box.children = streams.map(s => Box({
                vertical: true,
                children: [
                    Label({
                        halign: 'start',
                        className: 'E-VolumeSliders-label' + cc(props.labelClassName, props.labelClassName),
                        label: s.name
                    }),
                    VolumeSlider(s)
                ]
            }));
        }]
    ]
})