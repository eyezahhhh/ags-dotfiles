import { Box, Button, CenterBox, Label, Revealer, RevealerTransition } from "eags";
import { Image } from "./Image";
import { SimpleButton } from "./SimpleButton";
// @ts-ignore
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';

export class NotificationType {
    id: number
    appName: string
    appEntry: string
    appIcon: string
    summary: string
    body: string
    actions: { id: string, label: string }[]
    urgency: 'low' | 'normal' | 'critical'
    time: number
    image: string | null
}

export interface Props {
    transition?: RevealerTransition | null
}

export const Notification = (notification: NotificationType, props: Props = {}) => {
    const revealer = Revealer({
        // @ts-ignore
        revealChild: !props.transition,
        transition: props.transition || 'none',
        child: Box({
            children: [
                notification.image ? Image({
                    src: notification.image,
                    size: [70, 70],
                    stylable: true,
                    iconClassName: 'E-Notification-image',
                    props: {
                        valign: 'start'
                    }
                }) : null,
                Box({
                    vertical: true,
                    children: [
                        CenterBox({
                            startWidget: Label({
                                label: notification.summary,
                                halign: 'start',
                                className: 'E-Notification-title'
                            }),
                            endWidget: SimpleButton({
                                label: '',
                                props: {
                                    halign: 'end',
                                    onClicked: () => Notifications.dismiss(notification.id)
                                },
                                labelClassName: 'E-Notification-close'
                            })
                        }),
                        Label({
                            label: notification.body,
                            halign: 'start',
                            className: 'E-Notification-body' // todo: figure out word wrapping
                        }),
                        Box({
                            children: notification.actions.map(action => Button({
                                child: Label({
                                    label: action.label
                                }),
                                className: 'E-Button',
                                onClicked: () => Notifications.invoke(notification.id, action.id)
                            }))
                        })
                    ]
                })
            ]
        })
    });

    if (props.transition) {
        setTimeout(() => {
            // @ts-ignore
            revealer.revealChild = true;
        })
    }

    return Box({
        className: 'E-Notification',
        halign: 'end',
        children: [ revealer ]
    });
}