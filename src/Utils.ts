export function cc(condition: any, className?: string) {
    if (condition && className) return ` ${className}`;
    return '';
}

export function wait(milliseconds: number) {
    return new Promise(r => {
        setTimeout(r, milliseconds);
    });
}