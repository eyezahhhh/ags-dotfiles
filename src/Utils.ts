// @ts-ignore
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

export function cc(condition: any, className?: string) {
    if (condition && className) return ` ${className}`;
    return '';
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