import { Scale, Props as ScaleProps } from "./Scale";

export interface Props extends Partial<ScaleProps> {
    initialValue: number
    name: string
}

export const CustomVolumeSlider = (props: Props) => Scale({
    showLabel: true,
    scrollIncrement: 5,
    roundOnScroll: 5,
    label: value => `${Math.round(value)}%`,
    ...props
})