import { Injectable } from '@angular/core';
import { DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { GyroscopeOrientation } from '@ionic-native/gyroscope';
import { RingerService } from "./ringer.service";
import { UserSettings, UserSettingsService } from "./user-settings.service";
import { Utils } from "./utils";

export interface Cache {
    accel: { x: number, y: number, z: number },
    gyro: { x: number, y: number, z: number },
}

@Injectable()
export class MotionChangeLogicService {
    public static readonly CACHE_SIZE: number = 100;
    public static readonly REQUIRED_HIT_COUNT: number = 20;
    public static readonly MAX_INTERVAL: number = 20;

    private accel: { last: number, current: number, value: number, lastValue: number } = { last: 0, current: 0, value: 0, lastValue: 0 };

    private cached: Cache[] = [];
    private deviation: Cache;
    private deviationCache: Cache[] = [];

    private computeDeviationInterval: number = MotionChangeLogicService.MAX_INTERVAL / 2;
    private currentHitCount: number = MotionChangeLogicService.REQUIRED_HIT_COUNT / 2;

    private userPrefs: UserSettings;
    private delayTimeout: number;
    private scheduleReset: number;
    private waitForDelay: boolean = false;
    private trackMotion: boolean = true;

    constructor(
        private ringerService: RingerService,
        private userSettings: UserSettingsService,
    ) {
        this.userSettings.getSettings().then((data) => this.userPrefs = data);
    }

    // Use the current and previous values of acceleration and its delta values to check if motion has taken place.
    motionDetect(accel: DeviceMotionAccelerationData): boolean {
        this.accel.last = this.accel.current;
        this.accel.current = Math.sqrt(accel.x * accel.x + accel.y * accel.y + accel.z * accel.z);
        const delta = this.accel.current - this.accel.last;
        this.accel.lastValue = this.accel.value;
        this.accel.value = this.accel.value * 0.9 + delta;
        return this.accel.value > this.accel.lastValue + 0.3;
    }

    registerNew(accel: DeviceMotionAccelerationData, gyro: GyroscopeOrientation): void {
        this.ringerService.getRingerMode().then((ringerMode: string) => {
            this.registerNewUnwrapped(ringerMode, accel, gyro);
        });
    }

    registerNewUnwrapped(ringerMode: string, accel: DeviceMotionAccelerationData, gyro: GyroscopeOrientation): void {
        // If motion has taken place place, keep in mind that the user wants to wait for some seconds before trying to change the ringer.
        if (this.trackMotion && this.motionDetect(accel) && !this.delayTimeout && ringerMode === RingerService.RINGER_MODE.silent) {
            console.log('Motion detected. Taking into account the user\'s motion sensibility. Starting safe period');
            this.trackMotion = false;
            this.waitForDelay = true;
            this.delayTimeout = setTimeout(() => {
                console.log('Safe period ended. Waiting to see if there\'re other movements');
                this.waitForDelay = false;
                clearTimeout(this.delayTimeout);
                this.delayTimeout = null;
            }, this.userPrefs.motionSensibility);
            this.scheduleReset = setTimeout(() => {
                console.log('Safe period reset');
                this.trackMotion = true;
                clearTimeout(this.scheduleReset);
                this.scheduleReset = null;
            }, this.userPrefs.motionSensibility * 4);
        }

        if (!this.waitForDelay) this.cached.push({ accel: accel, gyro: gyro });

        if (!this.waitForDelay && this.cached.length !== 0 && this.cached.length % this.computeDeviationInterval === 0) {
            if (this.ringerService.isCordovaAvailable()) {
                this.computeDeviation(ringerMode);
                if (this.cached.length >= MotionChangeLogicService.CACHE_SIZE) this.halfCache();
            } else {
                this.computeDeviation(RingerService.RINGER_MODE.normal);
                if (this.cached.length >= MotionChangeLogicService.CACHE_SIZE) this.halfCache();
            }
        }
    }

    private computeDeviation(ringerMode: string): void {
        this.deviation = Utils.cacheStandardDeviation(this.cached);
        this.deviationCache.push(this.deviation);

        const cacheDev = Utils.cacheStandardDeviation(this.deviationCache);

        // If it has low deviation, it means that the device is standing and should be switched to silent.
        // This is only true if the values of past deviations are
        if (Utils.cacheIsBetween(this.deviationCache, -0.3, 0.3) && Utils.cacheLowDeviation(cacheDev, 0)) {
            if (ringerMode !== RingerService.RINGER_MODE.silent) {
                this.ringerService.setSilent();
                this.resetIntervalAndHitCount();
                console.log('setting to silent');
                console.log('resetting interval from silent');
            } else {
                this.increaseInterval(this.userPrefs.intervalStep, MotionChangeLogicService.MAX_INTERVAL);
                console.log('increasing interval from silent: ' + this.computeDeviationInterval);
            }
            return;
        }


        console.log('phone is moving');
        // Phone is still moving. Increase hit counter.
        if (this.currentHitCount < MotionChangeLogicService.REQUIRED_HIT_COUNT){
            this.currentHitCount ++;
            this.decreaseInterval(this.userPrefs.intervalStep, 1);
            console.log('increasing counter: ' + this.currentHitCount);
            console.log('decrease interval from phone moving: ' + this.computeDeviationInterval);
        }
        if (this.currentHitCount === MotionChangeLogicService.REQUIRED_HIT_COUNT) {
            if (ringerMode !== RingerService.RINGER_MODE.normal) {
                this.ringerService.setNormal();
                this.resetIntervalAndHitCount();
                console.log('setting to normal');
                console.log('resetting interval from phone is moving');
            } else {
                // If the counter had reached max value, it means that the device has been moving for some time and
                // and is likely to keep moving in the future. There's no need to scan so often.
                this.increaseInterval(this.userPrefs.intervalStep, MotionChangeLogicService.MAX_INTERVAL);
                console.log('increasing interval from phone moving: ' + this.computeDeviationInterval);
            }
        }
    }

    private halfCache(): void {
        console.log('Halving cache');
        this.cached = this.cached.slice(MotionChangeLogicService.CACHE_SIZE / 2);
        this.deviationCache = this.deviationCache.slice(this.deviationCache.length / 2)
        this.removeExtremes();
        this.resetIntervalAndHitCount();
    }

    private removeExtremes(): void {
        console.log('Remove extremes');
        this.cached = Utils.removeExtremes(this.cached);
        this.deviationCache = Utils.removeExtremes(this.deviationCache);
    }

    private resetIntervalAndHitCount(): void {
        this.currentHitCount = MotionChangeLogicService.REQUIRED_HIT_COUNT / 2;
        this.computeDeviationInterval = MotionChangeLogicService.MAX_INTERVAL / 2;
    }

    private decreaseInterval(step: number, minVal: number): void {
        this.computeDeviationInterval = Math.floor(this.computeDeviationInterval / step);
        this.computeDeviationInterval = this.computeDeviationInterval > minVal ? this.computeDeviationInterval : minVal;
    }

    private increaseInterval(step: number, maxVal: number): void {
        this.computeDeviationInterval *= step;
        this.computeDeviationInterval = this.computeDeviationInterval < maxVal ? this.computeDeviationInterval : maxVal;
    }
}
