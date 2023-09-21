import { checkImageConversion, convertImage, dcc } from "../Utils"
import { Image } from "./Image"
import { SimpleButton } from "./SimpleButton"
import { Player } from "./MediaComponents";
import { Box, BoxArgs, Label } from "resource:///com/github/Aylur/ags/widget.js";


export function convertArtists(artists: string[]) {
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
    props?: Partial<BoxArgs>
}

export const MediaPlayer = (player: Player, props: Props = {}) => {
    let destroyed = false;
    const blurArgs = ['-blur', '0x12', '-brightness-contrast', '-50'];

    const coverPath = player.coverPath && checkImageConversion(player.coverPath, ...blurArgs) || null;

    const box = Box({
        ...props.props,
        className: 'E-MediaSection' + dcc(props.className),
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
                        xalign: 0,
                        label: player.trackTitle,
                        wrap: true,
                    }),
                    Label({
                        className: 'E-MediaSection-artist' + dcc(props.artistsClassName),
                        xalign: 0,
                        label: convertArtists(player.trackArtists),
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
                box.style = `background-image: url("${path}")`;
            }
        });
    }

    return box;
}