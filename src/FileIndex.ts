// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';


const exists = new Map<string, boolean>();

export async function testPaths(paths: string | string[], forceCheck = false) {
    if (typeof paths == 'string') {
        paths = [ paths ];
    }
    for (let path of paths) {
        const pathExists = exists.get(path);
        if (forceCheck || pathExists === undefined) {
            // check if file exists
            const fileExists = (await execAsync(`node scripts/file-exists.js ${path}`)).trim() == path;
            exists.set(path, fileExists);
            if (fileExists) {
                return path;
            }
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