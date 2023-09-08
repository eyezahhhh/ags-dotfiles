import { AliasReplacerArguments } from 'tsc-alias';

const subDirs = __dirname.split("/").length;

export default function exampleReplacer({ orig, file }: AliasReplacerArguments) {
    if (orig.endsWith(`from "eags"`) || orig.endsWith(`from 'eags'`)) {
        const difSubDirs = file.split("/").length - subDirs - 1;
        let path = "";
        for (let i = 0; i < difSubDirs; i++) {
            path += "../";
        }
        const newImport = orig.substring(0, orig.length - 11) + `from '${path}node_modules/eags/dist/index.js'`;
        return newImport;
    }

    function endCheck(end: string) {
        if (orig.endsWith(end) && !orig.endsWith(`.js${end}`)) {
            return orig.substring(0, orig.length - end.length) + `.js${end}`;
        }
        return null;
    }

    for (let end of [`'`, `';`, `"`, `";`]) {
        const newImport = endCheck(end);
        if (newImport) {
            return newImport;
        }
    }

    return orig;
}