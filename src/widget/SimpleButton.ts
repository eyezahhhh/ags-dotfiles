import { Button, ButtonClass, Label } from "eags";
import { cc } from "../Utils";

export interface Props {
    label: string
    labelClassName?: string
    props?: Partial<ButtonClass>
}

export const SimpleButton = (props: Props) => Button({
    ...props.props,
    className: 'E-SimpleButton' + cc(props.props?.className, props.props?.className),
    child: Label({
        label: props.label,
        className: 'E-SimpleButton-label' + cc(props.labelClassName, props.labelClassName)
    })
})