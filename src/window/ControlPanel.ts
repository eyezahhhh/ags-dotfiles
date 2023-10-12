import app from "resource:///com/github/Aylur/ags/app.js";
import { Box, BoxArgs, BoxType, Connection, EventBox, EventBoxArgs, EventBoxType, Label, Window, WindowType } from "resource:///com/github/Aylur/ags/widget.js"
import { dcc } from "../Utils";
import { SmoothRevealer } from "../widget/SmoothRevealer";

export const PanelSection = (props: Partial<EventBoxArgs>) => EventBox(props);


class Section {
    public readonly children: (Widget | Section)[];
    constructor(...children: (Widget | Section)[]) {
        this.children = children;
    }
}

export class Row extends Section {}
export class Column extends Section {}

export interface Props {
    layout: Section
    monitor: number
    // @ts-expect-error
    connections?: Connection<WindowType>[]
}

export const ControlPanel = (props: Props) => {
    const layout = Box({
        className: 'E-ControlPanel-inner',
        vertical: props.layout instanceof Column
    });

    const toScan: number[][] = props.layout.children.map((_, i) => [i]);

    for (let fullPath of toScan) {
        const path = [...fullPath];
        const lastBit = path.pop()!;
        let parent = props.layout;
        let parentBox = layout;
        for (let container of path) {
            parent = parent.children[container] as Section;
            parentBox = parentBox.children[container] as BoxType;
        }
        const component = parent.children[lastBit] as Section | EventBoxType;
        if (component instanceof Section) {
            const newChildren = [...parentBox.children];
            newChildren[lastBit] = Box({
                vertical: component instanceof Column
            });
            parentBox.children = newChildren;
            toScan.push(...component.children.map((_, i) => [...fullPath, i]));
        } else {
            const newChildren = [...parentBox.children];
            component.onPrimaryClick = () => {
                lastClick = Date.now();
            }
            newChildren[lastBit] = Box({
                className: 'E-ControlPanel-section',
                children: [ component ]
            });
            parentBox.children = newChildren;
        }
    }
    
    let lastClick = 0;

    const revealer = SmoothRevealer({
        spacerHeight: 500,
        child: layout
    });

    return Window({
        monitor: props.monitor,
        popup: true,
        focusable: true,
        layer: 'overlay',
        anchor: ['bottom', 'left', 'right', 'top'],
        name: 'E-ControlPanel',
        className: 'E-ControlPanel',
        child: EventBox({
            hexpand: true,
            vexpand: true,
            onPrimaryClick: () => {
                if (lastClick + 100 < Date.now()) {
                    app.closeWindow('E-ControlPanel');
                }
            },
            child: Box({
                hexpand: false,
                vexpand: false,
                valign: 'center',
                halign: 'center',
                children: [
                    revealer.child
                ]
            })
        }),
        connections: [
            [app, (window, windowName: string, visible: boolean) => {
                if (windowName == window.name) {
                    revealer.setVisible(visible);
                }
            }],
            ...props.connections || []
        ]
    });
}