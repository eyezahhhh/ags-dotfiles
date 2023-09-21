import { Box, BoxArgs, Label } from "resource:///com/github/Aylur/ags/widget.js";
import { NetworkSpeed } from "../service/NetworkSpeed";
import { cc, dcc, formatFileSize } from "../Utils";

export interface Props {
    interface: string
    sendLabel?: (speed: number) => string
    receiveLabel?: (speed: number) => string
    className?: string
    sendClassName?: string
    receiveClassName?: string
    noticeClassName?: string
    props?: Partial<BoxArgs>
}

export const NetworkUsage = (props: Props) => Box({
    ...props.props,
    className: 'E-NetworkUsage' + dcc(props.className),
    connections: [
        [NetworkSpeed, box => {
            const network = NetworkSpeed.interfaces.get(props.interface);

            if (network) {
                box.children = [
                    Label({
                        label: props.receiveLabel ? props.receiveLabel(network.bytesReceived) : `Down: ${formatFileSize(network.bytesReceived)}`,
                        className: 'E-NetworkUsage-receive' + dcc(props.receiveClassName)
                    }),
                    Label({
                        label: props.sendLabel ? props.sendLabel(network.bytesSent) : `Up: ${formatFileSize(network.bytesSent)}`,
                        className: 'E-NetworkUsage-send' + dcc(props.sendClassName)
                    })
                ];
            } else {
                box.children = [
                    Label({
                        label: `Couldn't load interface '${props.interface}'`,
                        className: 'E-NetworkUsage-notice' + dcc(props.noticeClassName)
                    })
                ];
            }
        }]
    ]
})