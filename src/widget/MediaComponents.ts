import { SimpleButton } from "./SimpleButton"
import { cc, dcc } from "../Utils"
import { ButtonArgs, LabelType } from "resource:///com/github/Aylur/ags/widget.js"

export class Player {
    busName: string
    name: string
    identity: string
    entry: string
    trackArtists: string[]
    trackTitle: string
    trackCoverUrl: string
    coverPath: string
    playBackStatus: 'Playing' | 'Paused' | 'Stopped'
    canGoNext: boolean
    canGoPrev: boolean
    canPlay: boolean
    shuffleStatus: boolean
    loopStatus: 'None' | 'Track' | 'Playlist'
    volume: number
    length: number
    position: number
    playPause: () => void
    play: () => void
    stop: () => void
    next: () => void
    previous: () => void
    shuffle: () => void
    loop: () => void
}

export const PlayPauseButton = (player: Player, props: Partial<ButtonArgs> = {}) => SimpleButton({
    label: '',
    props: {
        ...props,
        connections: [
            ...props?.connections || [],
            [player, button => {
                const label = button.child as LabelType;
                label.label = player.playBackStatus == 'Playing' ? '' : '';
            }]
        ],
        onClicked: () => player.playPause()
    }
});

export const PreviousButton = (player: Player, props: Partial<ButtonArgs> = {}) => {
    const button = SimpleButton({
        label: '',
        props: {
            ...props,
            connections: [
                ...props?.connections || [],
                [player, button => {
                    button.className = 'E-SimpleButton ' + dcc(props.className) + cc(!player.canGoPrev, 'E-Button-disabled');
                }]
            ],
            onClicked: () => player.previous()
        }
    });

    return button;
}

export const NextButton = (player: Player, props: Partial<ButtonArgs> = {}) => {
    const button = SimpleButton({
        label: '',
        props: {
            ...props,
            connections: [
                ...props?.connections || [],
                [player, button => {
                    button.className = 'E-SimpleButton ' + dcc(props.className) + cc(!player.canGoNext, 'E-Button-disabled');
                }]
            ],
            onClicked: () => player.next()
        }
    });

    return button;
}