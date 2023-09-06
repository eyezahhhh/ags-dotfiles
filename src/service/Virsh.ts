// @ts-ignore
import { Service } from 'resource:///com/github/Aylur/ags/service.js';
// @ts-ignore
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { wait } from '../Utils';


export enum VirtualMachineState {
    RUNNING = 1,
    IDLE = 2,
    PAUSED = 3,
    SHUTTING_DOWN = 4,
    OFF = 5,
    CRASHED = 6,
    DYING = 7,
    SLEEPING = 8,
    UNKNOWN = 9
}

export class VirtualMachine {
    readonly id: string
    state: VirtualMachineState
    readonly start: () => Promise<void>
    readonly stop: () => Promise<void>
}

class VirshService extends Service {
    static {
        Service.register(this, {})
    }
    
    pollingDelay = 500;
    readonly vms = new Map<string, VirtualMachine>();

    constructor() {
        super();
        this.domstats().finally(async () => {
            while (1) {
                await wait(this.pollingDelay);
                try {
                    await this.domstats();
                } catch {}
            }
        });
    }

    private async domstats() {
        const response = await execAsync('virsh --connect qemu:///system domstats');

        let changed = false;
        let currentVm: VirtualMachine | null = null;

        const lostVms = Array.from(this.vms.keys());

        for (let line of response.split('\n')) {
            if (line.startsWith('Domain: \'')) {
                const id = line.substring('Domain: \''.length, line.length - 1);

                const existingVm = this.vms.get(id);
                if (existingVm) {
                    currentVm = existingVm;
                } else {
                    currentVm = {
                        id,
                        state: VirtualMachineState.UNKNOWN,
                        start: async () => {
                            await execAsync(`virsh --connect qemu:///system start ${id}`);
                        },
                        stop: async () => {
                            await execAsync(`virsh --connect qemu:///system shutdown ${id}`);
                        }
                    }
                    this.vms.set(id, currentVm);
                    changed = true;
                }

                const index = lostVms.indexOf(id);
                if (index >= 0) {
                    lostVms.splice(index, 1);
                }
            } else if (currentVm && line.startsWith('  ')) {
                const parts = line.substring(2).split('=');
                if (parts.length != 2) {
                    continue;
                }
                const [key, value] = parts;

                if (key == 'state.state') {
                    const state = parseInt(value) as VirtualMachineState;
                    if (currentVm.state != state) {
                        currentVm.state = state;
                        changed = true;
                    }
                }
            }
        }

        for (let id of lostVms) {
            changed = true;
            this.vms.delete(id);
        }
        
        if (changed) {
            // @ts-ignore
            this.emit('changed');
        }
    }
}

export class Virsh {
    static {
        Service.export(this, 'Virsh');
    }

    static instance = new VirshService();

    static get vms() {
        return this.instance.vms;
    }

    static set pollingDelay(milliseconds: number) {
        this.instance.pollingDelay = milliseconds;
    }
}