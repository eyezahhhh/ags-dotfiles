import { Box, Button, Label } from "resource:///com/github/Aylur/ags/widget.js";
import { Themes } from "../service/Themes";

export interface Props {
    
}

export const ThemeSelector = (props: Props = {}) => Box({
    vertical: true,
    className: 'E-ThemeSelector',
    hexpand: true,
    connections: [
        [Themes, box => {
            const themes = Array.from(Themes.themes.values());
            box.children = themes.map(theme => Button({
                className: 'E-Button E-ThemeSelector-theme',
                child: Label({
                    className: 'E-ThemeSelector-label',
                    label: theme.name,
                }),
                onClicked: async () => {
                    Themes.setTheme(theme.id);
                }
            }));
        }]
    ]
})