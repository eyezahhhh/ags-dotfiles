import { Box, Icon, IconClass } from "eags";
import { dcc } from "../Utils";
import { testPathCache, testPaths } from "../FileIndex";

export type Props = {
    className?: string
    iconClassName?: string
    src: string | string[]
    loadingSrc?: string
    errorSrc?: string
    alwaysCheckAgain?: boolean
    props?: Partial<IconClass>
} & (
    {
        stylable?: false
        size?: number
    } | {
        stylable: true
        size: [number, number]
    }
)

export const Image = (props: Props) => {
    let destroyed = false;

    const box = Box({
        className: 'E-Image' + dcc(props.className),
        connections: [
            ['destroy', () => destroyed = true]
        ]
    });

    function buildIcon(src: string) {
        src = src.trim();
        if (!src) return;
        if (destroyed) return;
        if (props.stylable) {
            box.children = [
                Box({
                    ...props.props,
                    // @ts-ignore
                    style: `background: url("${src}"); min-width: ${props.size[0]}px; min-height: ${props.size[1]}px; background-size: 100% 100%`,
                    className: 'E-Image-icon' + dcc(props.iconClassName)
                })
            ]
        } else {
            box.children = [
                Icon({
                    ...props.props,
                    icon: src,
                    size: props.size,
                    className: 'E-Image-icon' + dcc(props.iconClassName)
                })
            ];
        }
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