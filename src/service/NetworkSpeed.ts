// @ts-ignore
import { Service } from 'resource:///com/github/Aylur/ags/service.js';
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { wait } from '../Utils';

export class NetworkInterface {
    id: string
    packetsReceived: number
    packetsSent: number
    bytesReceived: number
    bytesSent: number
    errorsReceived: number
    errorsSent: number
    overruns: number
    collisions: number
}

export class NetworkSpeedService extends Service {
    static {
        Service.register(this, {});
    }

    pollingDelay = 500;
    readonly interfaces = new Map<string, NetworkInterface>();

    constructor() {
        super();

        console.log('Registered network speed service');

        this.ifstat().finally(async () => {
            while (1) {
                await wait(this.pollingDelay);
                try {
                    await this.ifstat();
                } catch {}
            }
        });
    }

    private async ifstat() {
        const cmd = `ifstat --interval=5`;
        const response = await execAsync(cmd);
        this.interfaces.clear();

        let current: Partial<NetworkInterface> | null = null;

        function parse(value: string) {
            const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            const extension = value.substring(value.length - 1);

            if (numbers.includes(extension)) {
                return parseInt(value);
            }

            const number = parseInt(value.substring(0, value.length - 1));

            const extensions = ['K', 'M', 'G', 'T', 'P'];
            for (let i = 0; i < extensions.length; i++) {
                if (extension == extensions[i]) {
                    return number * Math.pow(1024, i + 1);
                }
            }
            return 0;
        }

        for (let line of response.split('\n').slice(3) as string[]) {
            const parts = line.split(' ').filter(a => a.trim());
            if (line.startsWith(' ')) {
                if (!current) return;
                current.errorsReceived = parse(parts[0]);
                current.errorsSent = parse(parts[2]);
                current.overruns = parse(parts[4]);
                current.collisions = parse(parts[6]);               
                
                this.interfaces.set(current.id!, current as NetworkInterface);
            } else {
                const id = parts[0];
                

                const packetsReceived = parse(parts[1]);
                const packetsSent = parse(parts[3]);
                const bytesReceived = parse(parts[5]);
                const bytesSent = parse(parts[7]);

                current = {
                    id,
                    packetsReceived,
                    packetsSent,
                    bytesReceived,
                    bytesSent
                }
            }
        }

        // @ts-ignore
        this.emit('changed');
    }
}


export class NetworkSpeed {
    static {
        Service.export(this, 'NetworkSpeed');
    }

    private static instance = new NetworkSpeedService();

    static get interfaces() {
        return this.instance.interfaces;
    }

    static set pollingDelay(milliseconds: number) {
        this.instance.pollingDelay = milliseconds;
    }

    static get pollingDelay() {
        return this.instance.pollingDelay;
    }
}