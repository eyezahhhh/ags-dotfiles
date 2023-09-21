import { exec, execAsync, CACHE_DIR, ensureDirectory } from 'resource:///com/github/Aylur/ags/utils.js';
import { registerPath, testPathCache, testPaths } from './FileIndex';

export function cc(condition: any, className?: string) {
    if (condition && className) return ` ${className}`;
    return '';
}

export function dcc(condition?: string) {
    return cc(condition, condition);
}

export function wait(milliseconds: number) {
    return new Promise(r => {
        setTimeout(r, milliseconds);
    });
}

export function getEnvs() { // blocks thread
    const response = exec('node scripts/get-envs.js').trim();
    return JSON.parse(response) as {[key: string]: string | number};
}

export function round(number: number, decimals: number) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function formatFileSize(bytes: number, useBinaryUnits = false) {
    const labels = ['', 'K', 'M', 'G', 'T', 'P'];
    const divisor = useBinaryUnits ? 1024 : 1000;

    for (let i = 0; i < labels.length - 1; i++) {
        if (bytes < divisor) {
            return `${round(bytes, 1)}${labels[i]}${useBinaryUnits ? 'i' : ''}B`;
        }
        bytes /= divisor;
    }
    return `${round(bytes, 1)}${labels.pop()}${useBinaryUnits ? 'i' : ''}B`;
}

export function hashCode(input: string) {
    let hash = 0;
    let i;
    let chr;

    if (!input.length) return hash;

    for (i = 0; i < input.length; i++) {
        chr = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}



const imageConversions = new Map<string, string>();

export function checkImageConversion(path: string, ...args: string[]) {
    const array = JSON.stringify([path, ...args]);
    return imageConversions.get(array) || null;
}

export async function convertImage(path: string, ...args: string[]) {
    try {
        const hash = hashCode(`path - ${args.join(' ')}`);
        const newPath = `${CACHE_DIR}/modified/${hash}`;
        if (testPathCache(newPath)) {
            console.log('using cache');
            return newPath;
        }
        if (!(await testPaths(path))) {
            return null;
        }

        ensureDirectory(CACHE_DIR + '/modified');
        await execAsync(['convert', path, ...args, newPath]);
        registerPath(newPath, true);

        const array = JSON.stringify([path, ...args]);
        imageConversions.set(array, newPath);
        setTimeout(() => {
            imageConversions.delete(array);
        }, 10 * 60_000);

        return newPath;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export function getLoggedInUser() {
    const parts = CACHE_DIR.split('/');
    if (parts[0] == '' && parts[1] == 'home' && parts.length > 2) {
        return parts[2];
    }
}