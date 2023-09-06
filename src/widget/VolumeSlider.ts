import { Box, EventBox, Label, Slider } from "eags";
import { cc } from "../Utils";

export class AudioStream {
    name: string
    description: string | null
    iconName: string
    id: number
    isMuted: boolean
    volume: number
}

export interface Props {
    className?: string
    scaleClassName?: string
    labelClassName?: string
}

export const VolumeSlider = (stream: AudioStream, props: Props = {}) => {
    const label = Label({
        label: `${Math.round(stream.volume * 100)}%`,
        className: 'E-VolumeSlider-label' + cc(props.labelClassName, props.labelClassName)
    });

    const slider = Slider({
        hexpand: true,
        max: 100,
        min: 0,
        value: stream.volume * 100,
        drawValue: false,
        className: 'E-VolumeSlider-scale' + cc(props.scaleClassName, props.scaleClassName),
        // @ts-ignore
        onChange: ({value}) => {
            stream.volume = value / 100;
            label.label = Math.round(value) + '%';
        }
    })

    return EventBox({
        child: Box({
            className: 'E-VolumeSlider' + cc(props.className, props.className),
            children: [
                slider,
                label
            ]
        }),
        onScrollDown: () => {            
            const rawVol = Math.max(stream.volume * 100 - 5, 0);
            let volume = Math.round(rawVol / 5) * 5;
            stream.volume = volume / 100;
            label.label = Math.round(volume) + '%';
            slider.value = volume;
        },
        onScrollUp: () => {
            const rawVol = Math.min(stream.volume * 100 + 5, 100);
            let volume = Math.round(rawVol / 5) * 5;
            stream.volume = volume / 100;
            label.label = Math.round(volume) + '%';
            slider.value = volume;
        }
    })
}