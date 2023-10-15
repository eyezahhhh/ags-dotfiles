import { Service } from "resource:///com/github/Aylur/ags/service.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { debounce, wait } from "../Utils";

export type AvrInput = (
    "hdmi-1" |
    "hdmi-2" |
    "hdmi-3" |
    "hdmi-4" |
    "hdmi-5" |
    "hdmi-6" |
    "hdmi-7" |
    "pc" |
    "phono" |
    "am" |
    "fm" |
    "network" |
    "usb" |
    "bluetooth"
);

export type AvrListeningMode = (
    "pure-audio" |
    "dolby-atmos" |
    "neo-6-cinema" |
    "neo-x-cinema" |
    "dts-x" |
    "neural-x" |
    "stereo" |
    "direct" |
    "theater-dimensional" |
    "mono" |
    "whole-house" |
    "sports" |
    "auto-surround" |
    "auto" |
    "surr" |
    "ster"
);

export type AvrDimmerLevel = "bright" | "dim" | "dark" | "shut-off" | "bright-led-off";

export type AvrStatus = {
    on: boolean
    input: AvrInput
    listeningMode: AvrListeningMode
    dimmerLevel: AvrDimmerLevel
    volume: number,
    media: null | {
        source: string | null
        title: string
        artist: string | null
        image: string | null
        timestamp: number | null
        duration: number | null
    }
}

export class AvrService extends Service {
    static {
        Service.register(this, {});
    }

    public status: AvrStatus;
    public address = "http://localhost:8080/avr";

    constructor() {
        super();

        (async () => {
            while (1) {
                try {
                    this.handleResponse(await this.makeRequest(this.address));
                } catch {}
                await wait(500);
            }
        })();
    }

    public handleResponse(response: any) {
        try {
            const cache = JSON.parse(response);
            this.status = cache;
            this.emit("changed");
        } catch (e) {
            console.error(e);
        }
    }

    public makeRequest(url: string) {
        return execAsync(`curl ${url}`);
    }

    public async handleFullRequest(path: string) {
        try {
            this.handleResponse(await this.makeRequest(`${this.address}/${path}`));
            return this.status;
        } catch {
            return null;
        }
    }
}

export class Avr {
    static {
        // @ts-expect-error
        Service['Avr'] = this;
    }

    private static instance = new AvrService();

    public static readonly setInput = debounce(100, (input: AvrInput) => this.instance.handleFullRequest(`input/${input}`));
    public static readonly setVolume = debounce(100, (volume: number) => this.instance.handleFullRequest(`volume/${volume}`));
    public static readonly setDimmerLevel = debounce(250, (level: AvrDimmerLevel) => this.instance.handleFullRequest(`dimmer/${level}`));
    public static setListeningMode = debounce(250, (mode: AvrListeningMode) => this.instance.handleFullRequest(`listening-mode/${mode}`));
    public static setPower = debounce(250, (on: boolean) => this.instance.handleFullRequest(`power/${on ? 'on' : 'off'}`));

    static getStatus() {
        return this.instance.status;
    }

    static setAddress(address: string) {
        this.instance.address = address;
    }
}