import { Button, ButtonArgs, Label } from "resource:///com/github/Aylur/ags/widget.js";
import { dcc } from "../Utils";

export interface Props {
    label: string
    labelClassName?: string
    props?: Partial<ButtonArgs>
}

export const SimpleButton = (props: Props) => Button({
    ...props.props,
    className: 'E-SimpleButton' + dcc(props.props?.className),
    child: Label({
        label: props.label,
        className: 'E-SimpleButton-label' + dcc(props.labelClassName)
    })
})