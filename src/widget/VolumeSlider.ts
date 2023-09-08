import { cc } from "../Utils";
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
    className: 'E-VolumeSlider' + cc(props.className, props.className),
    innerClassName: 'E-VolumeSlider-inner' + cc(props.innerClassName, props.innerClassName),
    labelClassName: 'E-VolumeSlider-label' + cc(props.labelClassName, props.labelClassName),
    scaleClassName: 'E-VolumeSlider-scale' + cc(props.scaleClassName, props.scaleClassName),
    initialValue: stream.volume * 100,
    onChange: value => {
        stream.volume = value / 100;
        return value;
    }
})