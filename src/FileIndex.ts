// @ts-ignore
const { GLib } = imports.gi;

const exists = new Map<string, boolean>();

export async function testPaths(paths: string | string[], forceCheck = false) {
    if (typeof paths == 'string') {
        paths = [ paths ];
    }
    for (let path of paths) {
        const pathExists = exists.get(path);
        if (forceCheck || pathExists === undefined) {
            try {
                const fileExists = GLib.file_test(path, GLib.FileTest.EXISTS);
                exists.set(path, fileExists);
                if (fileExists) {
                    return path;
                }
            } catch {}
        } else {
            if (pathExists) {
                return path;
            }
        }
    }
    return null;
}

export function testPathCache(paths: string | string[]) {
    for (let path of paths) {
        if (exists.get(path)) {
            return path;
        }
    }
    return null;
}

export function registerPath(path: string, fileExists: boolean) {
    exists.set(path, fileExists);
}