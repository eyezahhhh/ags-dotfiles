import { cc, dcc } from "../Utils";
import { Props, Scale } from "./Scale";

export class AudioStream {
    name: string
    description: string | null
    iconName: string
    id: number
    isMuted: boolean
    volume: number
}

export const VolumeSlider = (stream: AudioStream, props: Partial<Props> = {}) => Scale({
    showLabel: true,
    scrollIncrement: 5,
    roundOnScroll: 5,
    label: value => `${Math.round(value)}%`,
    ...props,
    className: 'E-VolumeSlider' + dcc(props.className),
    innerClassName: 'E-VolumeSlider-inner' + dcc(props.innerClassName),
    labelClassName: 'E-VolumeSlider-label' + dcc(props.labelClassName),
    scaleClassName: 'E-VolumeSlider-scale' + dcc(props.scaleClassName),
    initialValue: stream.volume * 100,
    onChange: value => {
        stream.volume = value / 100;
        return value;
    }
})