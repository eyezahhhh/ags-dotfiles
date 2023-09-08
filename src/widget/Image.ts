import { Box, Icon } from "eags";
import { cc } from "../Utils";
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { testPathCache, testPaths } from "../FileIndex";

export interface Props {
    size?: number
    className?: string
    iconClassName?: string
    src: string | string[]
    loadingSrc?: string
    errorSrc?: string
    alwaysCheckAgain?: boolean
}

export const Image = (props: Props) => {
    const src = typeof props.src == 'string' ? [ props.src ] : props.src;

    let destroyed = false;

    const box = Box({
        className: 'E-Image' + cc(props.className, props.className),
        connections: [
            ['destroy', () => destroyed = true]
        ]
    });

    function buildIcon(src: string) {
        src = src.trim();
        if (!src) return;
        if (destroyed) return;
        box.children = [
            Icon({
                icon: src,
                size: props.size,
                className: 'E-Image-icon' + cc(props.iconClassName, props.iconClassName)
            })
        ];
    }

    const cachedFile = testPathCache(props.src);
    if (cachedFile) {
        buildIcon(cachedFile);
    } else if (props.loadingSrc) {
        buildIcon(props.loadingSrc);
    }
    if (props.alwaysCheckAgain || !cachedFile) {
        testPaths(props.src).then(path => {
            if (path) {
                buildIcon(path);
            } else if (props.errorSrc) {
                buildIcon(props.errorSrc);
            }
        });
    }

    return box;
}