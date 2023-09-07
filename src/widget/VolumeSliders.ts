import { Box, Label } from "eags";
// @ts-ignore
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import { AudioStream, VolumeSlider } from "./VolumeSlider";
import { Props as SliderProps } from './Scale';
import { cc } from "../Utils";

export interface Props {
    audioType?: 'speakers' | 'microphones' | 'apps'
    className?: string
    labelClassName?: string
    childProps?: Partial<SliderProps>,
    filter?: (stream: AudioStream) => boolean
}

export const VolumeSliders = (props: Props = {}) => Box({
    vertical: true,
    className: 'E-VolumeSliders' + cc(props.className, props.className),
    connections: [
        [Audio, box => {
            let streams = Array.from(Audio[props.audioType || 'speakers'].values()) as AudioStream[];
            if (props.filter) {
                streams = streams.filter(props.filter);
            }
            // @ts-ignore
            box.children?.forEach(c => c.destroy());

            if (streams.length) {
                box.children = streams.map(s => Box({
                    vertical: true,
                    children: [
                        Label({
                            halign: 'start',
                            className: 'E-VolumeSliders-label' + cc(props.labelClassName, props.labelClassName),
                            label: s.name
                        }),
                        VolumeSlider(s, props.childProps)
                    ]
                }));
            } else {
                box.children = [
                    Label({
                        label: `No ${props.audioType || 'speakers'} found.`,
                        className: 'E-VolumeSliders-notice'
                    })
                ]
            }
        }]
    ]
})