import { Box, BoxClass, Label } from "eags"
import { checkImageConversion, convertImage, dcc } from "../Utils"
import { Image } from "./Image"
import { SimpleButton } from "./SimpleButton"

export class Player {
    busName: string
    name: string
    identity: string
    entry: string
    trackArtists: []
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

function convertArtists(artists: string[]) {
    if (!artists.length) {
        return '';
    }

    let out = artists[0];
    for (let i = 1; i < artists.length; i++) {
        if (i < artists.length - 1) {
            out += `, ${artists[i]}`;
        } else {
            out += ` & ${artists[i]}`;
        }
    }

    return out;
}

export interface Props {
    className?: string
    iconClassName?: string
    titleClassName?: string
    artistsClassName?: string
    buttonsClassName?: string
    props?: Partial<BoxClass>
}

export const MediaPlayer = (player: Player, props: Props = {}) => {
    let destroyed = false;
    const blurArgs = ['-blur', '0x12', '-brightness-contrast', '-20'];

    const coverPath = player.coverPath && checkImageConversion(player.coverPath, ...blurArgs) || null;

    const box = Box({
        ...props.props,
        className: 'E-MediaSection' + dcc(props.className),
        // @ts-ignore
        style: coverPath ? `background-image: url("${coverPath}")` : undefined,
        hexpand: true,
        children: [
            Image({
                src: player.coverPath,
                loadingSrc: '/home/eyezah/.config/ags/assets/start-button.png',
                size: [64, 64],
                stylable: true,
                iconClassName: 'E-MediaSection-image' + dcc(props.iconClassName),
                props: {
                    valign: 'start'
                }
            }),
            Box({
                vertical: true,
                children: [
                    Label({
                        className: 'E-MediaSection-title' + dcc(props.titleClassName),
                        // @ts-ignore
                        xalign: 0,
                        label: player.trackTitle,
                        // @ts-ignore
                        wrap: true,
                    }),
                    Label({
                        className: 'E-MediaSection-artist' + dcc(props.artistsClassName),
                        // @ts-ignore
                        xalign: 0,
                        label: convertArtists(player.trackArtists),
                        // @ts-ignore
                        wrap: true,
                    }),
                    Box({
                        className: 'E-MediaSection-buttons' + dcc(props.buttonsClassName),
                        children: [
                            player.canGoPrev ? SimpleButton({
                                label: '',
                                props: {
                                    onClicked: () => player.previous()
                                }
                            }) : null,
                            player.canPlay ? SimpleButton({
                                label: player.playBackStatus == 'Playing' ? '' : '',
                                props: {
                                    onClicked: () => player.playPause()
                                }
                            }) : null,
                            player.canGoNext ? SimpleButton({
                                label: '',
                                props: {
                                    onClicked: () => player.next()
                                }
                            }) : null
                        ]
                    })
                ]
            })
        ],
        connections: [ 
            ['destroy', () => destroyed = true]
        ]
    });

    if (player.coverPath && !coverPath) {
        convertImage(player.coverPath, ...blurArgs).then(path => {
            if (path && !destroyed) {
                // @ts-ignore
                box.style = `background-image: url("${path}")`;
            }
        });
    }

    return box;
}