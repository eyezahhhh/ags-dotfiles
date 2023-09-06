import { Box, BoxClass, Button, Label } from 'eags';
// @ts-ignore
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { cc } from '../Utils';

/*
    box.E-HyprlandWorkspaces-container
    .<className> {
        button
            .E-HyprlandWorkspaces-button
            .E-HyprlandWorkspaces-active
            .E-HyprlandWorkspaces-populated
            .<buttonClassName>
            .<activeClassName>
            .<populatedClassName> {}
    }
*/

export interface ButtonContentsProps {
    number: number
    active: boolean
    populated: boolean
}

export interface Props {
    className?: string
    buttonClassName?: string
    populatedClassName?: string
    activeClassName?: string
    buttonContents?: (props: ButtonContentsProps) => string,
    props?: Partial<BoxClass>
}

export const HyprlandWorkspaces = (props: Props = {}) => Box({
    ...props.props,
    className: 'E-HyprlandWorkspaces' + cc(props.className, props.className),
    connections: [
        [Hyprland, box => {
            const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
            box.children = numbers.map(i => {
                const populated = !!Hyprland.workspaces.get(i);
                const active = Hyprland.active.workspace.id == i;

                const contents = props.buttonContents ? props.buttonContents({
                    number: i,
                    active,
                    populated
                }) : `${i}`;

                return Button({
                    onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
                    child: Label({
                        label: contents
                    }),
                    className: 'E-HyprlandWorkspaces-button'
                        + cc(props.buttonClassName, props.buttonClassName)
                        + cc(active, 'E-HyprlandWorkspaces-active')
                        + cc(active, props.activeClassName)
                        + cc(populated, 'E-HyprlandWorkspaces-populated')
                        + cc(populated, props.populatedClassName)
                })
            })
        }]
    ]
})