import { Button, ButtonClass, Label } from "eags";
import { cc, dcc } from "../Utils";

export interface Props {
    label: string
    labelClassName?: string
    props?: Partial<ButtonClass>
}

export const SimpleButton = (props: Props) => Button({
    ...props.props,
    className: 'E-SimpleButton' + dcc(props.props?.className),
    child: Label({
        label: props.label,
        className: 'E-SimpleButton-label' + dcc(props.labelClassName)
    })
})