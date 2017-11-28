import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Subscription } from "rxjs/Subscription";
import { Gyroscope, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx";
import { MotionChangeLogicService } from "./motion-change-logic.service";

@Injectable()
export class MotionService {
    private active: boolean = false;

    private accelerometerWatch: Subscription;
    private gyroWatch: Subscription;

    public accelStream: Subject<DeviceMotionAccelerationData> = new Subject();
    public gyroStream: Subject<GyroscopeOrientation> = new Subject();

    constructor(
        private deviceMotion: DeviceMotion,
        private gyroscope: Gyroscope,
        private motionChange: MotionChangeLogicService,
    ) { }

    public isActive(): boolean {
        return this.active;
    }

    public activate(frequency: number = 500): void {
        this.active = true;
        Observable.zip(this.accelStream, this.gyroStream).subscribe((res: any[]) => {
            this.monitorMotion(res[0], res[1]);
        });
        this.setupWatches(frequency);
    }

    // Just for debugging
    public generateMotion(motion: any): void {
        this.monitorMotion(motion.accel, motion.gyro);
    }

    public deactivate(): void {
        this.active = false;
        this.removeWatches();
    }

    private setupWatches(frequency: number): void {
        this.accelerometerWatch = this.deviceMotion.watchAcceleration({ frequency: frequency }).subscribe((acceleration: DeviceMotionAccelerationData) => {
            this.accelStream.next(acceleration);
        });

        this.gyroWatch = this.gyroscope.watch({ frequency: frequency }).subscribe((orientation: GyroscopeOrientation) => {
            this.gyroStream.next(orientation);
        });
    }

    private removeWatches(): void {
        if (this.accelerometerWatch) this.accelerometerWatch.unsubscribe();
        if (this.gyroWatch) this.gyroWatch.unsubscribe();
    }

    private monitorMotion(accel: DeviceMotionAccelerationData, gyro: GyroscopeOrientation): void {
        this.motionChange.registerNew(accel, gyro);
    }
}