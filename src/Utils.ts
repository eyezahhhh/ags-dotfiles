export function cc(condition: any, className?: string) {
    if (condition && className) return ` ${className}`;
    return '';
}