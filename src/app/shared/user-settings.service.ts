import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";
import { Globals } from "./globals";

export interface UserSettings {
    isEnabled?: boolean,
    frequency?: number,
    intervalStep?: number,
    runInBackground?: boolean,
    silentScreen?: boolean,
    silentScreenDelay?: number,
    motionSensibility?: number,
    standingMode?: string,
}

@Injectable()
export class UserSettingsService {

    constructor(
        protected storage: Storage,
        protected events: Events,
    ) { }

    enable(): void {
        this.setIsEnabled(true);
    }

    disable(): void {
        this.setIsEnabled(false);
    }

    private setIsEnabled(val: boolean): void {
        this.setStorage('switch-enabled', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getIsEnabled(): Promise<boolean> {
        return this.getStorage('switch-enabled').then((val: boolean) => val);
    }

    setFrequency(val: number): void {
        this.setStorage('switch-frequency', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getFrequency(): Promise<number> {
        return this.getStorage('switch-frequency').then((val: number) => val);
    }

    setRunInBackground(val: boolean): void {
        this.setStorage('switch-runbg', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getRunInBackground(): Promise<boolean> {
        return this.getStorage('switch-runbg').then((val: boolean) => val);
    }

    setIntervalStep(val: number): void {
        this.setStorage('switch-intervalStep', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getIntervalStep(): Promise<number> {
        return this.getStorage('switch-intervalStep').then((val: number) => val);
    }

    setSilentScreen(val: boolean): void {
        this.setStorage('switch-silentScreen', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getSilentScreen(): Promise<boolean> {
        return this.getStorage('switch-silentScreen').then((val: boolean) => val);
    }

    setSilentScreenDelay(val: number): void {
        this.setStorage('switch-silentScreenDelay', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getSilentScreenDelay(): Promise<number> {
        return this.getStorage('switch-silentScreenDelay').then((val: number) => val);
    }

    setMotionSensibility(val: number): void {
        this.setStorage('switch-motionSensibility', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getMotionSensibility(): Promise<number> {
        return this.getStorage('switch-motionSensibility').then((val: number) => val);
    }

    setStandingMode(val: string): void {
        this.setStorage('switch-motionSensibility', val).then(this.fireSettingsChangedEvent.bind(this));
    }

    getStandingMode(): Promise<string> {
        return this.getStorage('switch-standingMode').then((val: string) => val);
    }

    getSettings(): Promise<UserSettings> {
        const promises = [
            this.getFrequency(),
            this.getIsEnabled(),
            this.getRunInBackground(),
            this.getIntervalStep(),
            this.getSilentScreen(),
            this.getSilentScreenDelay(),
            this.getMotionSensibility(),
            this.getStandingMode(),
        ];
        return Promise.all<any>(promises).then((data: any[]): UserSettings => {
            return {
                frequency: data[0] || 300,
                isEnabled: data[1] || false,
                runInBackground: data[2] || false,
                intervalStep: data[3] || 2,
                silentScreen: data[4] || false,
                silentScreenDelay: data[5] || 10,
                motionSensibility: data[6] || 5,
                standingMode: data[7] || 'silent',
            };
        });
    }

    setSettings(settings: UserSettings): void {
        if(settings.frequency !== undefined) this.setFrequency(settings.frequency);
        if(settings.isEnabled !== undefined) this.setIsEnabled(settings.isEnabled);
        if(settings.runInBackground !== undefined) this.setRunInBackground(settings.runInBackground);
        if(settings.intervalStep !== undefined) this.setIntervalStep(settings.intervalStep);
        if(settings.silentScreen !== undefined) this.setSilentScreen(settings.silentScreen);
        if(settings.silentScreenDelay !== undefined) this.setSilentScreenDelay(settings.silentScreenDelay);
        if(settings.motionSensibility !== undefined) this.setMotionSensibility(settings.motionSensibility * 1000);
    }

    private fireSettingsChangedEvent(): void {
        this.getSettings().then((data: UserSettings) => {
            this.events.publish(Globals.EVENTS.userSettings.settingsChanged, data);
        });
    }

    private setStorage(name: string, val: any): Promise<any> {
        return this.storage.set(name, val);
    }

    private getStorage(name: string): Promise<any> {
        return this.storage.get(name);
    }

    clearStorage(): void {
        this.storage.clear();
    }
}
