import { Box, Label } from "eags";
// @ts-ignore
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import { Image } from "./Image";

export interface Props {
    player?: string
}

class Player {
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

export const MediaSection = (props: Props = {}) => {
    const title = Label();
    const artist = Label();
    const image = Box();

    return Box({
        children: [
            image,
            Box({
                vertical: true,
                children: [
                    title,
                    artist
                ]
            })
        ],
        connections: [
            [Mpris, box => {
                const player = Mpris.getPlayer(props.player || '') as Player | null;
                if (!player) {
                    console.log('no player detected');
                    return;
                }

                title.label = player.trackTitle;
                artist.label = convertArtists(player.trackArtists);

                image.children = [
                    Image({
                        src: player.coverPath,
                        loadingSrc: '/home/eyezah/.config/ags/assets/start-button.png',
                        size: 64
                    })
                ];
            }]
        ]
    })
}