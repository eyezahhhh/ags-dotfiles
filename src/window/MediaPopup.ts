import { Box, Button, CenterBox, EventBox, Icon, Label, Revealer, RevealerClass, Widget, Window } from "eags";
import { SimpleButton } from "../widget/SimpleButton";
// @ts-ignore
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import { convertArtists } from "../widget/MediaPlayer";
import { NextButton, PlayPauseButton, Player, PreviousButton } from "../widget/MediaComponents";
import { convertImage } from "../Utils";
import { Image } from "../widget/Image";
// @ts-ignore
import { lookUpIcon } from 'resource:///com/github/Aylur/ags/utils.js';

export type MediaApp = {
    icon: string
    command: string
}

export interface Props {
    monitor: number
    player?: string
    apps?: MediaApp[]
}

function build(player: Player, open: boolean, openCallback: (open: boolean) => void): [RevealerClass, RevealerClass] {
    const blurArgs = ['-blur', '0x05', '-brightness-contrast', '-50'];
    let destroyed = false;

    const extra = Revealer({
        transition: 'slide_down',
        // @ts-ignore
        revealChild: open,
        child: Box({
            className: 'E-MediaPopup-extra',
            vertical: true,
            children: [
                Box({
                    connections: [
                        [player, box => {
                            const children: Widget[] = [
                                Box({
                                    vertical: true,
                                    children: [
                                        Label({
                                            halign: 'start',
                                            className: 'E-MediaPopup-extra-title',
                                            // @ts-ignore
                                            wrap: true,
                                            connections: [
                                                [player, label => {
                                                    label.label = player.trackTitle
                                                }]
                                            ]
                                        }),
                                        Label({
                                            halign: 'start',
                                            className: 'E-MediaPopup-extra-artist',
                                            // @ts-ignore
                                            wrap: true,
                                            connections: [
                                                [player, label => {
                                                    const artists = player.trackArtists.filter(a => a.trim());
                                                    label.label = convertArtists(artists);
                                                }]
                                            ]
                                        })
                                    ]
                                })
                            ];

                            if (player.coverPath) {
                                children.unshift(Image({
                                    iconClassName: 'E-MediaPopup-extra-cover',
                                    src: player.coverPath,
                                    stylable: true,
                                    size: [70, 70]
                                }));
                            }

                            box.children = children;
                        }]
                    ]
                }),
                CenterBox({
                    className: 'E-MediaPopup-entry-bar',
                    startWidget: Box({
                        children: [
                            PreviousButton(player, {
                                className: 'E-MediaPopup-extra-button'
                            }),
                            PlayPauseButton(player, {
                                className: 'E-MediaPopup-extra-button'
                            }),
                            NextButton(player, {
                                className: 'E-MediaPopup-extra-button'
                            })
                        ]
                    }),
                    connections: [
                        [player, box => {
                            const children: Widget[] = [
                                Label({
                                    label: player.identity
                                })
                            ];
                            
                            if (lookUpIcon(player.entry)) {
                                children.push(Icon({
                                    icon: player.entry,
                                    size: 20
                                }));
                            }

                            box.endWidget = Box({
                                valign: 'fill',
                                halign: 'end',
                                className: 'E-MediaPopup-entry-app',
                                children
                            });
                        }]
                    ]
                }),
                SimpleButton({
                    label: '',
                    props: {
                        className: 'E-MediaPopup-close',
                        onClicked: () => {
                            // @ts-ignore
                            extra.revealChild = false;
                            // @ts-ignore
                            peek.revealChild = true;
                            openCallback(false);
                        }
                    }
                })
            ],
            connections: [
                [player, box => {
                    if (player.coverPath) {
                        convertImage(player.coverPath, ...blurArgs).then(path => {
                            if (path && !destroyed) {
                                // @ts-ignore
                                box.style = `background-image: url("${path}")`;
                            }
                        });
                    }
                }],
                ['destroy', () => destroyed = true]
            ]
        })
    });

    const peek = Revealer({
        transition: 'slide_down',
        child: EventBox({
            className: 'E-EventBox',
            child: Box({
                className: 'E-MediaPopup-peek',
                halign: 'center',
                children: [
                    Label({
                        label: '',
                        className: 'E-MediaPopup-peek-title',
                        connections: [
                            [player, label => {
                                const artists = player.trackArtists.filter(a => a.trim());
                                const artist = artists.length ? `${convertArtists(artists)} - ` : '';
                                label.label = artist + player.trackTitle;
                            }]
                        ]
                    }),
                    PreviousButton(player),
                    PlayPauseButton(player),
                    NextButton(player)
                ]
            }),
            onPrimaryClick: () => {
                // @ts-ignore
                extra.revealChild = true;
                // @ts-ignore
                peek.revealChild = false;
                openCallback(true);
            }
        }),
        // @ts-ignore
        revealChild: !open
    });

    return [extra, peek];
}

export const MediaPopup = (props: Props) => {
    let busName: string | undefined;

    let opened = false;

    function setOpened(open: boolean) {
        opened = open;
    }

    function buildApps() {
        if (!props.apps?.length) {
            return [
                Label({
                    className: 'E-MediaPopup-notice',
                    label: 'No media detected.'
                })
            ];
        }
        return [
            Box({
                halign: 'center',
                children: props.apps.map(app => Button({
                    className: 'E-MediaPopup-app',
                    hexpand: false,
                    vexpand: false,
                    valign: 'center',
                    halign: 'center',
                    child: Icon({
                        icon: app.icon,
                        size: 32
                    }),
                    onClicked: app.command
                }))
            })
        ];
    }

    return Window({
        anchor: ['top'],
        monitor: props.monitor,
        name: `E-MediaPopup-${props.monitor}`,
        className: 'E-MediaPopup',
        child: Box({
            className: 'E-MediaPopup-inner',
            vertical: true,
            children: buildApps(),
            connections: [
                [Mpris, box => {
                    let player = Mpris.getPlayer(props.player || '') as Player | null;
                    if (player && player.playBackStatus == 'Stopped' && !player.trackTitle && !player.trackArtists.filter(a => a.trim()).length) {
                        player = null;
                    }
                    if (player && player.busName == busName) {
                        return;
                    }
                    busName = player?.busName;
                    if (player) {
                        box.children = build(player, opened, setOpened);
                    } else {
                        box.children = buildApps();
                    }
                }]
            ]
        })
    });
}