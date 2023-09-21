import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import { MediaPlayer, Props as PlayerProps } from "./MediaPlayer";
import { Player } from "./MediaComponents";
import { Box } from 'resource:///com/github/Aylur/ags/widget.js';

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