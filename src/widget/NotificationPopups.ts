import { Box, RevealerTransition, Window, WindowAnchor } from "eags";
// @ts-ignore
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import { Notification, NotificationType } from "./Notification";



export interface Props {
    anchor: WindowAnchor[]
    monitor: number
    margin?: number[]
    transition?: RevealerTransition
    maxNotifications?: number
}

export const NotificationPopups = (props: Props) => {
    const oldNotifications: number[] = [];

    return Window({
        anchor: props.anchor,
        monitor: props.monitor,
        margin: props.margin || [],
        className: 'E-NotificationPopups',
        layer: 'top',
        child: Box({
            vertical: true,
            className: 'E-NotificationPopups-inner',
            connections: [
                [Notifications, box => {
                    const notifications = Array.from(Notifications.popups.values()) as NotificationType[];
                    if (props.maxNotifications && notifications.length > props.maxNotifications) {
                        notifications.slice(notifications.length - props.maxNotifications, notifications.length);
                    }

                    box.children = notifications.map(n => Notification(n, {
                        transition: oldNotifications.includes(n.id) ? null : props.transition || 'none'
                    }));

                    oldNotifications.splice(0, oldNotifications.length);
                    oldNotifications.push(...notifications.map(n => n.id));
                }]
            ]
        })
    })
}