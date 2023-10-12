//#region Services

declare module 'resource:///com/github/Aylur/ags/service.js' {
    export class Service {
        static register(service: object, signals?: { [signal: string]: string[] });
        emit: (signal: string) => void
    }
}

declare module 'resource:///com/github/Aylur/ags/service/applications.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export interface App {
    app: object; // TODO
    name: string;
    desktop: string | null;
    description: string | null;
    executable: string;
    iconName: string;
    launch(): void;
    match(term: string): boolean;
  }

  interface Applications extends Service {
    query(term: string): App[];
  }

  const applications: Applications;
  export default applications;
}

declare module 'resource:///com/github/Aylur/ags/service/audio.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export interface Stream {
    name: string;
    description: string | null;
    iconName: string;
    id: number;
    isMuted: boolean;
    volume: number;
  }

  interface Audio extends Service {
    microphone: Stream;
    speaker: Stream;
    apps: Stream[];
    speakers: Stream[];
    microphones: Stream[];
  }

  const audio: Audio;
  export default audio;
}

declare module 'resource:///com/github/Aylur/ags/service/battery.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  interface Battery extends Service {
    available: boolean;
    percent: number;
    charging: boolean;
    charged: boolean;
  }

  const battery: Battery;
  export default battery;
}

declare module 'resource:///com/github/Aylur/ags/service/bluetooth.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export interface Device {
    address: string;
    batteryLevel: number;
    batteryPercentage: number;
    connected: boolean;
    iconName: string;
    alias: string;
    name: string;
    trusted: boolean;
    paired: boolean;

    setConnection(connect: boolean): void;
  }

  interface Bluetooth extends Service {
    enabled: boolean;
    devices: Device[];
    connectedDevices: Device[];

    toggle(): void;
  }

  const bluetooth: Bluetooth;
  export default bluetooth;
}

declare module 'resource:///com/github/Aylur/ags/service/hyprland.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export interface Monitor {
    id: number;
    name: string;
    description: string;
    make: string;
    model: string;
    serial: string;
    width: number;
    height: number;
    refreshRate: number;
    x: number;
    y: number;
    activeWorkspace: WorkspaceShort;
    specialWorkspace: WorkspaceShort;
    reserved: [number, number, number, number];
    scale: number;
    transform: number;
    focused: boolean;
    dpmsStatus: boolean;
    vrr: boolean;
  }

  export interface WorkspaceShort {
    id: number;
    name: string;
  }

  export interface Workspace extends WorkspaceShort {
    monitor: string;
    windows: number;
    hasfullscreen: boolean;
    lastwindow: string;
    lastwindowtitle: string;
  }

  export interface ClientShort {
    address: string;
    title: string;
    class: string;
  }

  export interface Client extends ClientShort {
    mapped: boolean;
    hidden: boolean;
    monitor: number;
    at: [number, number];
    size: [number, number];
    workspace: WorkspaceShort;
    floating: boolean;
    initialClass: string;
    initialTitle: string;
    pid: number;
    xwayland: boolean;
    pinned: boolean;
    fullscreen: boolean;
    fullscreenMode: 0 | 1;
    fakeFullscreen: boolean;
    grouped: object[]; // TODO
    swallowing: null; // TODO
  }

  export interface LayerClient {
    address: string;
    x: number;
    y: number;
    w: number;
    h: number;
    namespace: string;
  }

  export interface Layer {
    levels: Record<'0' | '1' | '2' | '3', LayerClient[]>;
  }

  export interface Device {
    address: string;
    name: string;
  }

  export interface Mouse extends Device {
    defaultSpeed: number;
  }

  export interface Keyboard extends Device {
    rules: string;
    model: string;
    layout: string;
    variant: string;
    options: string;
    active_keymap: string;
    main: boolean;
  }

  export interface Devices {
    mice: Mouse[];
    keyboards: Keyboard[];
    tablets: Device[]; // TODO
    touch: Device[];
    switches: Device[];
  }

  export interface Bind {
    locked: boolean;
    mouse: boolean;
    release: boolean;
    repeat: boolean;
    non_consuming: boolean;
    modmask: number;
    key: string;
    keycode: -1; // TODO
    dispatcher: string;
    arg: string;
  }

  export interface Version {
    branch: string;
    commit: string;
    dirty: boolean;
    commit_message: string;
    tag: string;
    flags: string[];
  }

  export interface Instance {
    instance: string;
    time: number;
    pid: number;
    wl_socket: string;
  }

  interface Hyprland extends Service {
    active: { client: ClientShort; monitor: string; workspace: WorkspaceShort };
    monitors: Map<number, Monitor>;
    workspaces: Map<number, Workspace>;
    clients: Map<string, Client>;

    getMonitor(id: number): Monitor;
    getWorkspace(id: number): Workspace;
    getClient(address: string): Client;

    HyprctlGet(cmd: 'monitors'): Monitor[];
    HyprctlGet(cmd: 'workspaces'): Workspace[];
    HyprctlGet(cmd: 'activeworkspace'): Workspace;
    HyprctlGet(cmd: 'clients'): Client[];
    HyprctlGet(cmd: 'activewindow'): Client;
    HyprctlGet(cmd: 'layers'): Record<string, Layer>;
    HyprctlGet(cmd: 'devices'): Devices;
    HyprctlGet(cmd: 'binds'): Bind[];
    HyprctlGet(cmd: 'version'): Version;
    HyprctlGet(cmd: 'splash'): string;
    HyprctlGet(cmd: 'cursorpos'): { x: number; y: number };
    HyprctlGet(cmd: 'globalshortcuts'): object[]; // TODO
    HyprctlGet(cmd: 'instances'): Instance[]; // TODO
    HyprctlGet(cmd: string): any;
  }

  const hyprland: Hyprland;
  export default hyprland;
}

declare module 'resource:///com/github/Aylur/ags/service/mpris.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export interface Player extends Service {
    busName: string;
    name: string;
    identity: string;
    entry: string;
    trackArtists: string[];
    trackTitle: string;
    trackCoverUrl: string;
    coverPath: string;
    playBackStatus: 'Playing' | 'Paused' | 'Stopped';
    canGoNext: boolean;
    canGoPrev: boolean;
    canPlay: boolean;
    shuffleStatus: boolean;
    loopStatus: 'None' | 'Track' | 'Playlist';
    volume: number;
    length: number;
    position: number;

    playPause(): void;
    play(): void;
    stop(): void;
    next(): void;
    previous(): void;
    shuffle(): void;
    loop(): void;
  }

  interface Mpris extends Service {
    getPlayer(name: string): Player | null;
    // TODO: add another `getPlayer`
  }

  const mpris: Mpris;
  export default mpris;
}

declare module 'resource:///com/github/Aylur/ags/service/network.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export type State =
    | 'unknown'
    | 'unmanaged'
    | 'unavailable'
    | 'disconnected'
    | 'prepare'
    | 'config'
    | 'need_auth'
    | 'ip_config'
    | 'ip_check'
    | 'secondaries'
    | 'activated'
    | 'deactivating'
    | 'failed';

  export type Internet = 'connected' | 'connecting' | 'disconnected';

  export interface AccessPoint {
    bssid: string;
    address: string;
    lastSeen: number;
    ssid: string;
    active: boolean;
    strength: number;
  }

  export interface Wired {
    internet: Internet;
    state: State;
  }

  export interface Wifi {
    ssid: string;
    strength: number;
    internet: Internet;
    enabled: boolean;
    accessPoints: AccessPoint[];
    state: State;

    scan(): void;
  }

  interface Network extends Service {
    connectivity: 'unknown' | 'none' | 'portal' | 'limited' | 'full';
    primary: 'wifi' | 'wired';
    wired?: Wired;
    wifi?: Wifi;
  }

  const network: Network;
  export default network;
}

declare module 'resource:///com/github/Aylur/ags/service/notifications.js' {
    import { Service } from 'resource:///com/github/Aylur/ags/service.js'

  export type Urgency = 'low' | 'normal' | 'critical';

  export interface Notification {
    id: number;
    appName: string;
    appEntry: string;
    appIcon: string;
    summary: string;
    body: string;
    actions: { id: string; label: string }[];
    urgency: Urgency;
    time: number;
    image: string | null;
  }

  interface Notifications extends Service {
    dnd: boolean;
    popups: Map<number, Notification>;
    notifications: Map<number, Notification>;

    clear(): void;
    invoke(id: number, action: string): void;
    close(id: number): void;
    dismiss(id: number): void;
  }

  const notifications: Notifications;
  export default notifications;
}

//#endregion

//#region App

declare module 'resource:///com/github/Aylur/ags/app.js' {
    import { WindowType } from 'resource:///com/github/Aylur/ags/widget.js';

  interface App extends Service {
    windows: WindowType[]; // TODO
    configDir: string;

    getWindow(name: string): object | undefined;
    closeWindow(name: string): void;
    openWindow(name: string): void;
    toggleWindow(name: string): void;
    quit(): void;
    resetCss(): void;
    applyCss(path: string): void;
  }

  const app: App;
  export default app;
}
//#endregion

//#region Widgets

interface Widget {
    destroy: () => void
    grab_focus: () => void
    style: string
}

declare module 'resource:///com/github/Aylur/ags/widget.js' {
  type Applications =
    typeof import('resource:///com/github/Aylur/ags/service/applications.js').default;
  type Audio =
    typeof import('resource:///com/github/Aylur/ags/service/audio.js').default;
  type Battery =
    typeof import('resource:///com/github/Aylur/ags/service/battery.js').default;
  type Bluetooth =
    typeof import('resource:///com/github/Aylur/ags/service/bluetooth.js').default;
  type Hyprland =
    typeof import('resource:///com/github/Aylur/ags/service/hyprland.js').default;
  type Mpris =
    typeof import('resource:///com/github/Aylur/ags/service/mpris.js').default;
  type Player = import('resource:///com/github/Aylur/ags/service/mpris.js').Player;
  type Network =
    typeof import('resource:///com/github/Aylur/ags/service/network.js').default;
  type Notifications =
    typeof import('resource:///com/github/Aylur/ags/service/notifications.js').default;

  type Command<W extends Widget> =
    | string
    | ((widget: W, ...args: any[]) => void);
  type Justification = 'left' | 'center' | 'right' | 'fill';
  type Align = 'start' | 'center' | 'end' | 'fill' | 'baseline';
  type Truncate = 'none' | 'start' | 'middle' | 'end';
  type Scroll = 'always' | 'automatic' | 'external' | 'never';
  type Anchor = 'top' | 'bottom' | 'left' | 'right';
  type Margin = number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

  interface WindowArgs extends CommonArgs<WindowType> {
    child: Widget;
    name: string;
    anchor: Anchor | Anchor[];
    exclusive: boolean;
    focusable: boolean;
    layer: 'overlay' | 'top' | 'bottom' | 'background';
    margin: Margin;
    monitor: number;
    popup: boolean;
  }
  type WindowType = WindowArgs & {
    show: () => void,
    hide: () => void
  };
  export function Window(args: Partial<WindowArgs>): WindowType;

  type Connection<W extends Widget> = [Service, Command<W>, string] | [Service, Command<W>]; // TODO

  interface CommonArgs<W extends Widget> {
    className: string;
    label: string;
    connections: (Connection<W> | number)[];
    halign: Align;
    valign: Align;
    hexpand: boolean
    vexpand: boolean
    style: string
  }

  interface BoxArgs extends CommonArgs<BoxType> {
    children: (Widget | null)[];
    vertical: boolean;
  }
  type BoxType = Widget & BoxArgs
  export function Box(args: Partial<BoxArgs>): BoxType;

  interface ButtonArgs extends CommonArgs<ButtonType> {
    child: Widget;
    onClicked: Command<ButtonType>;
    onPrimaryClick: Command<ButtonType>
    onSecondaryClick: Command<ButtonType>
    onMiddleClick: Command<ButtonType>
    onPrimaryClickRelease: Command<ButtonType>
    onSecondaryClickRelease: Command<ButtonType>
    onMiddleClickRelease: Command<ButtonType>
    onScrollUp: Command<ButtonType>
    onScrollDown: Command<ButtonType>;
  }
  type ButtonType = Widget & ButtonArgs;
  export function Button(args: Partial<ButtonArgs>): Widget;

  interface CenterBoxArgs extends CommonArgs<CenterBoxType> {
    startWidget: Widget;
    centerWidget: Widget;
    endWidget: Widget;
  }
  type CenterBoxType = Widget & CenterBoxArgs;
  export function CenterBox(args: Partial<CenterBoxArgs>): CenterBoxType;

  interface EntryArgs extends CommonArgs<EntryType> {
    onChange: Command<EntryType>;
    onAccept: Command<EntryType>;
  }
  type EntryType = Widget & EntryArgs;
  export function Entry(args: Partial<EntryArgs>): EntryType;

  interface EventBoxArgs extends CommonArgs<EventBoxType> {
    child: Widget;
    onPrimaryClick: Command<EventBoxType>
    onSecondaryClick: Command<EventBoxType>;
    onMiddleClick: Command<EventBoxType>;
    onPrimaryClickRelease: Command<EventBoxType>;
    onSecondaryClickRelease: Command<EventBoxType>;
    onMiddleClickRelease: Command<EventBoxType>;
    onHoverRelease: Command<EventBoxType>;
    onHoverLost: Command<EventBoxType>;
    onScrollUp: Command<EventBoxType>;
    onScrollDown: Command<EventBoxType>;
  }
  type EventBoxType = Widget & EventBoxArgs;
  export function EventBox(args: Partial<EventBoxArgs>): EventBoxType;

  interface IconArgs extends CommonArgs<IconType> {
    icon: string;
    size: number;
  }
  type IconType = Widget & IconArgs;
  export function Icon(args: Partial<IconArgs>): IconType;

  interface LabelArgs extends CommonArgs<LabelType> {
    justification: Justification;
    truncate: Truncate;
    xalign: number;
    yalign: number;
    wrap: boolean;
  }
  type LabelType = Widget & LabelArgs;
  export function Label(args: Partial<LabelArgs>): LabelType;

  interface OverlayArgs extends CommonArgs<OverlayType> {
    child: Widget;
    overlays: Widget[];
    passthrough: boolean;
  }
  type OverlayType = Widget & OverlayArgs;
  export function Overlay(args: Partial<OverlayArgs>): OverlayType;

  interface ProgressBarArgs extends CommonArgs<ProgressBarType> {
    vertical: boolean;
    value: number;
  }
  type ProgressBarType = Widget & ProgressBarArgs;
  export function ProgressBar(args: Partial<ProgressBarArgs>): ProgressBarType;
  
  type RevealerTransition = 'none' | 'crossfade' | 'slide_left' | 'slide_right' | 'slide_down' | 'slide_up';
  interface RevealerArgs extends CommonArgs<RevealerType> {
    child: Widget;
    transitionDuration: number;
    transition: RevealerTransition;
    revealChild: boolean
  }
  type RevealerType = Widget & RevealerArgs;
  export function Revealer(args: Partial<RevealerArgs>): RevealerType;

  interface ScrollableArgs extends CommonArgs<ScrollableType> {
    child: Widget;
    hscroll: Scroll;
    vscroll: Scroll;
  }
  type ScrollableType = Widget & ScrollableArgs;
  export function Scrollable(args: Partial<ScrollableArgs>): ScrollableType;

  interface SliderArgs extends CommonArgs<SliderType> {
    vertical: boolean;
    value: number;
    min: number;
    max: number;
    drawValue: boolean;
    inverted: boolean;
    onChange: Command<SliderType>;
  }
  type SliderType = Widget & SliderArgs;
  export function Slider(args: Partial<SliderArgs>): SliderType;

  interface StackArgs extends CommonArgs<StackType> {
    items: [string, Widget][];
    shown: string;
    transition:
    | 'none'
    | 'crossfade'
    | 'slide_right'
    | 'slide_left'
    | 'slide_up'
    | 'slide_down'
    | 'slide_left_right'
    | 'slide_up_down'
    | 'over_up'
    | 'over_down'
    | 'over_left'
    | 'over_right'
    | 'under_up'
    | 'under_down'
    | 'under_left'
    | 'under_right'
    | 'over_up_down'
    | 'over_down_up'
    | 'over_left_right'
    | 'over_right_left';
  }
  type StackType = Widget & StackArgs;
  export function Stack(args: Partial<StackArgs>): StackType;

  interface MenuArgs extends CommonArgs<MenuType> {
    children: MenuItemType[]; // TODO
    onPopup: Command<MenuType>;
    onMoveScroll: Command<MenuType>;
  }
  type MenuType = Widget & MenuArgs;
  export function Menu(args: Partial<MenuArgs>): MenuType;

  interface MenuItemArgs extends CommonArgs<MenuItemType> {
    child: Widget;
    onActivate: Command<MenuItemType>;
    onSelect: Command<MenuItemType>;
    onDeselect: Command<MenuItemType>;
  }
  type MenuItemType = Widget & MenuItemArgs;
  export function MenuItem(args: Partial<MenuItemArgs>): Widget;
}

//#endregion

//#region Utils

declare module 'resource:///com/github/Aylur/ags/utils.js' {
  export function exec(command: string): string;
  export function execAsync(command: string | string[]): Promise<string>;
  export function subprocess(cmd: string | string[], callback: (out: string) => void, onError: (err: Error) => void, bind?: Widget): void;
  export function readFile(path: string): string;
  export function readFileAsync(path: string): Promise<string>;
  export function writeFile(string: string, path: string): string;
  export function writeFileAsync(string: string, path: string): Promise<object>; // TODO
  export function timeout(ms: number, callback: () => void): void;
  export function interval(ms: number, callback: () => void, bind?: Widget): void;
  export function lookUpIcon(name?: string, size?: number): object; // TODO
  export const CACHE_DIR: string;
  export const ensureDirectory: (path?: string) => void
}

//#endregion