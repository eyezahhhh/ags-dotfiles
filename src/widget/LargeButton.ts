import { cc } from "../Utils";
import { SimpleButton, Props as ButtonProps } from "./SimpleButton";

export interface Props extends ButtonProps {

}

export const LargeButton = (props: Props) => SimpleButton({
    ...props,
    props: {
        ...props.props,
        className: 'E-LargeButton' + cc(props.props?.className, props.props?.className)
    }
})