import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Globals } from "../../app/shared/globals";
import { AndroidPermissions } from '@ionic-native/android-permissions';

import * as cpr from 'cordova-plugin-ringermode/www/ringerMode';

@IonicPage({ name: Globals.PAGE_NAMES.home })
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    data: any;
    hasV: any;
    hasS: any;
    hasN: any;

    constructor(
        private androidPermissions: AndroidPermissions,
    ) {

        this.hasS = cpr.setRingerSilent;
        this.hasV = cpr.setRingerVibrate;
        this.hasN = cpr.setRingerNormal;

        // this.getRingerMode();
    }

    ionViewDidLoad(): void {
        console.log('asking for permission');
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS).then(
            success => console.log('Permission granted'),
            err => {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
            }
        );
    }

    getRingerMode(): void {
        cpr.getRingerMode(
            (data) => this.setData(data),
            (err) => this.setData(err),
        );
    }

    setSilent(): void {
        cpr.setRingerSilent(
            (data) => this.setData(data),
            (err) => this.setData(err),
        );
    }

    setVibrate(): void {
        cpr.setRingerSilent(
            (data) => this.setData(data),
            (err) => this.setData(err),
        );
    }

    setNormal(): void {
        cpr.setRingerSilent(
            (data) => this.setData(data),
            (err) => this.setData(err),
        );
    }

    setRingerMode(mode: number): void {
        cpr.setRingerMode(
            mode,
            (data) => this.getRingerMode(),
            (err) => this.getRingerMode(),
        )
    }

    setData(data: string): void {
        this.data = 'Data: ' + data;
    }

    setErr(data: string): void {
        this.data = 'Err: ' + data;
    }
}
