import { Box, EventBox, Label } from "eags";
import { Theme, Themes } from "../service/Themes";

export interface Props {
    
}

export const ThemeSelector = (props: Props = {}) => Box({
    vertical: true,
    halign: 'end',
    className: 'E-ThemeSelector',
    connections: [
        [Themes, box => {
            const themes = Array.from(Themes.themes.values());
            box.children = themes.map(theme => EventBox({
                className: 'E-ThemeSelector-theme',
                child: Label({
                    className: 'E-ThemeSelector-label',
                    label: theme.name,
                    halign: 'start'
                }),
                onPrimaryClick: async () => {
                    Themes.setTheme(theme.id);
                }
            }));
        }]
    ]
})