import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import { Notification } from "./Notification";
import { Anchor, Box, EventBox, EventBoxArgs, Margin, RevealerTransition, Window } from 'resource:///com/github/Aylur/ags/widget.js';



export interface Props {
    anchor: Anchor[]
    monitor: number
    margin?: Margin
    transition?: RevealerTransition
    maxNotifications?: number
    name: string
    showAll?: boolean
    layer?: 'overlay' | 'top' | 'bottom' | 'background'
    innerProps?: Partial<Omit<EventBoxArgs, "child">>
    containerProps?: Partial<Omit<EventBoxArgs, "child">>
}

export const NotificationPopups = (props: Props) => {
    const oldNotifications: number[] = [];

    return Window({
        anchor: props.anchor,
        monitor: props.monitor,
        margin: props.margin,
        className: 'E-NotificationPopups',
        name: props.name,
        layer: props.layer || 'top',
        child: EventBox({
            ...props.innerProps,
            child: Box({
                vertical: true,
                className: 'E-NotificationPopups-inner',
                connections: [
                    [Notifications, box => {
                        Notifications.popups
                        const notifications = Array.from(props.showAll ? Notifications.notifications.values() : Notifications.popups.values());
                        if (props.maxNotifications && notifications.length > props.maxNotifications) {
                            notifications.slice(notifications.length - props.maxNotifications, notifications.length);
                        }
    
                        box.children = notifications.map(n => EventBox({
                            ...props.containerProps,
                            child: Notification(n, {
                                transition: oldNotifications.includes(n.id) ? null : props.transition || 'none'
                            })
                        }));
    
                        oldNotifications.splice(0, oldNotifications.length);
                        oldNotifications.push(...notifications.map(n => n.id));
                    }]
                ]
            })
        })
    })
}