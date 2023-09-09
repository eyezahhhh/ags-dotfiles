import { cc, dcc } from "../Utils";
import { SimpleButton, Props as ButtonProps } from "./SimpleButton";

export interface Props extends ButtonProps {

}

export const LargeButton = (props: Props) => SimpleButton({
    ...props,
    props: {
        ...props.props,
        className: 'E-LargeButton' + dcc(props.props?.className)
    }
})