import { Injectable } from '@angular/core';
import { Events } from "ionic-angular";
import { Globals } from "./globals";
import { UserSettingsService } from "./user-settings.service";

import * as cpr from 'cordova-plugin-ringermode/www/ringerMode';

declare const window: any;

@Injectable()
export class RingerService {
    public static readonly RINGER_MODE = {
        silent: 'RINGER_MODE_SILENT',
        vibrate: 'RINGER_MODE_VIBRATE',
        normal: 'RINGER_MODE_NORMAL',
    };

    constructor(
        private events: Events,
        private userSettings: UserSettingsService,
    ) {}

    isCordovaAvailable(): boolean {
        return !!(window.cordova && window.cordova.exec);
    }

    getRingerMode(): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            if (!this.isCordovaAvailable()) resolve(RingerService.RINGER_MODE.normal);
            cpr.getRingerMode(
                (data) => resolve(data),
                (err) => reject(err),
            );
        });
    }

    setSilent(enforceMode?: 'silent' | 'vibrate' | 'normal'): Promise<any> {
        if (enforceMode) return this.setMode(enforceMode);
        return this.userSettings.getStandingMode().then((mode: 'silent' | 'vibrate' | 'normal') => this.setMode(mode))
    }

    setNormal(enforceMode?: 'silent' | 'vibrate' | 'normal'): Promise<any> {
        if (enforceMode) return this.setMode(enforceMode);
        return this.userSettings.getMovingMode().then((mode: 'silent' | 'vibrate' | 'normal') => this.setMode(mode))
    }

    private setMode(mode: 'silent' | 'vibrate' | 'normal'): Promise<any> {
        switch (mode) {
            case 'silent':
                return this.silent();
            case 'vibrate':
                return this.vibrate();
            case 'normal':
                return this.normal();
        }
    }

    private silent(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            if (!this.isCordovaAvailable()) this.onResolve(resolve, RingerService.RINGER_MODE.silent);
            cpr.setRingerSilent(
                (data) => this.onResolve(resolve, data),
                (err) => reject(err),
            );
        });
    }

    private vibrate(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            if (!this.isCordovaAvailable()) this.onResolve(resolve, RingerService.RINGER_MODE.vibrate);
            cpr.setRingerVibrate(
                (data) => this.onResolve(resolve, data),
                (err) => reject(err),
            );
        });
    }

    private normal(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            if (!this.isCordovaAvailable()) this.onResolve(resolve, RingerService.RINGER_MODE.normal);
            cpr.setRingerNormal(
                (data) => this.onResolve(resolve, data),
                (err) => reject(err),
            );
        });
    }

    private onResolve(resolve, data): void {
        resolve(data);
        this.events.publish(Globals.EVENTS.motion.changeRinger, data);
    }
}
