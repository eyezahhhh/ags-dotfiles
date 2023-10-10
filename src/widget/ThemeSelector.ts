import { Box, EventBox, Label } from "resource:///com/github/Aylur/ags/widget.js";
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
            box.children = themes.map(theme => EventBox({
                className: 'E-ThemeSelector-theme',
                child: Label({
                    className: 'E-ThemeSelector-label',
                    label: theme.name,
                }),
                onPrimaryClick: async () => {
                    Themes.setTheme(theme.id);
                }
            }));
        }]
    ]
})