import { Box } from "eags";
// @ts-ignore
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import { MediaPlayer, Player, Props as PlayerProps } from "./MediaPlayer";

export interface Props {
    player?: string
    props?: PlayerProps
}

export const MediaSection = (props: Props = {}) => {
    return Box({
        connections: [
            [Mpris, box => {
                const player = Mpris.getPlayer(props.player || '') as Player | null;
                if (!player) {
                    box.children = [];
                    return;
                }
    
                box.children = [ MediaPlayer(player, props.props) ];
            }]
        ]
    });
}