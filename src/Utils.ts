// @ts-ignore
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';

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