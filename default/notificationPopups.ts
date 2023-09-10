import { Loader } from "../src/Load";
import { NotificationPopups } from "../src/widget/NotificationPopups";

const popups = NotificationPopups({
    anchor: ['bottom', 'right'],
    monitor: 0,
    margin: [0, 10, 0, 0],
    transition: 'slide_left',
    maxNotifications: 5
});

export default function(loader: Loader) {
    loader.loadWindows(popups);
    loader.setNotificationPopupTimeout(10_000);
}