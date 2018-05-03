import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, ToastController } from 'ionic-angular';
import { Globals } from "../../app/shared/globals";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { UserSettings, UserSettingsService } from "../../app/shared/user-settings.service";
import { DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { GyroscopeOrientation } from '@ionic-native/gyroscope';
import { BackgroundMode } from '@ionic-native/background-mode';
import { MotionService } from "../../app/shared/motion.service";
import { RingerService } from "../../app/shared/ringer.service";
import {Utils} from "../../app/shared/utils";

@IonicPage({ name: Globals.PAGE_NAMES.home })
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    public userPrefs: UserSettings = {};
    public ringerChangeError: string;
    public accelVal: DeviceMotionAccelerationData = { x: 0, y: 0, z: 0, timestamp: null };
    public gyroVal: GyroscopeOrientation = { x: 0, y: 0, z: 0, timestamp: null };
    public ringerMode: string;

    public cordovaAvailable: boolean;

    constructor(
        private androidPermissions: AndroidPermissions,
        private userSettings: UserSettingsService,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private events: Events,
        private backgroundMode: BackgroundMode,
        private motionService: MotionService,
        private ringerService: RingerService,
    ) { }

    ionViewDidLoad(): void {
        this.cordovaAvailable = this.ringerService.isCordovaAvailable();

        if (this.cordovaAvailable) {
            this.checkPermission();
            this.setupUserSettings();
            this.getRingerMode();
            this.checkMotion();
        } else {
            this.setupUserSettings();
        }

        this.events.subscribe(Globals.EVENTS.motion.changeRinger, (data) => this.ringerMode = data);
    }

    private checkMotion(): void {
        this.motionService.accelStream.subscribe((val: DeviceMotionAccelerationData) => this.accelVal = val);
        this.motionService.gyroStream.subscribe((val: GyroscopeOrientation) => this.gyroVal = val);
    }

    private checkPermission(): void {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
            success => console.log('Permission granted'),
            err => {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
                    success => console.log('Permission granted'),
                    err => this.onChangeStateClick(true, true)
                )
            }
        );
    }

    private setupUserSettings(): void {
        const onResponse = (data: UserSettings): void => {
            this.userPrefs = data;
            if (this.userPrefs.isEnabled) {
                this.motionService.deactivate();
                this.motionService.activate(this.userPrefs.frequency);
            } else {
                this.motionService.deactivate();
            }
        };

        this.userSettings.getSettings().then(onResponse);
        this.events.subscribe(Globals.EVENTS.userSettings.settingsChanged, onResponse);
    }

    private getRingerMode(err?: string): void {
        if (err) {
            this.ringerChangeError = 'There was an error when changing the ringer mode. Fell back to the previous value.';
        }
        this.ringerService.getRingerMode().then((data: any) => {
            this.ringerMode = data;
        });
    }

    private setData(data: any): void {
        this.getRingerMode();
        this.userSettings.disable();
    }

    private setErr(err: any): void {
        this.getRingerMode(err);
    }

    setSilent(): void {
        this.ringerService.setNormal('silent').then(this.setData.bind(this)).catch(this.setErr.bind(this));
    }

    setVibrate(): void {
        this.ringerService.setNormal('vibrate').then(this.setData.bind(this)).catch(this.setErr.bind(this));
    }

    setNormal(): void {
        this.ringerService.setNormal('normal').then(this.setData.bind(this)).catch(this.setErr.bind(this));
    }

    getStateColor(): string {
        return this.ringerMode === RingerService.RINGER_MODE.silent ? 'primary' : 'danger';
    }

    onChangeStateClick(disabled: boolean, force?: boolean): void {
        if (disabled) {
            if (force) {
                this.userSettings.disable();
            } else {
                const confirm = this.alertCtrl.create({
                    title: 'Do you want to disable Switch?',
                    message: 'You can always come back to reactivate here.',
                    buttons: [
                        {
                            text: 'Yes', handler: () => {
                            const toast = this.toastCtrl.create({
                                message: 'Disabled Switch',
                                dismissOnPageChange: true,
                                showCloseButton: true,
                                position: 'bottom',
                                duration: 2000,
                            });
                            toast.present();
                            this.userSettings.disable();
                            return true;
                        }
                        },
                        { text: 'Cancel' },
                    ]
                });
                confirm.present();
            }
        } else {
            this.checkPermission();
            this.userSettings.enable();
        }
    }

    moveToBackground(): void {
        this.backgroundMode.moveToBackground();
    }

    // Just for debugging;
    generateCache(): void {
        this.motionService.generateMotion(Utils.generateRandomCache());
    }

    generateStanding(): void {
        for (let i = 0; i < 100; i ++) {
            this.motionService.generateMotion(Utils.generateRandomCache(-0.5, 0.5));
        }
    }

    generateMovingSteadily(): void {
        for (let i = 0; i < 50; i ++) {
            this.motionService.generateMotion(Utils.generateRandomCache(3.0, 3.5));
            this.motionService.generateMotion(Utils.generateRandomCache(-3.0, -3.5));
        }
    }

    generateMovingChaotically(): void {
        for (let i = 0; i < 100; i ++) {
            this.motionService.generateMotion(Utils.generateRandomCache());
        }
    }

    clearStorage(): void {
        this.userSettings.clearStorage();
    }

    getDisplayRingerMode(): string {
        return Utils.capitalizeFirstLetter(this.ringerMode.toLowerCase().split(/_/g)[2]);
    }
}
