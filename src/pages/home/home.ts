import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Globals } from "../../app/shared/globals";

import * as cpr from 'cordova-plugin-ringermode/www/ringerMode';

@IonicPage({ name: Globals.PAGE_NAMES.home })
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    data: any;

    constructor() {
    }

    getRingerMode(): void {
        cpr.getRingerMode(
            (data) => this.data = data,
            (err) => this.data = err,
        );
    }

    setRingerMode(mode: number): void {
        cpr.setRingerMode(
            mode,
            (data) => this.getRingerMode(),
            (err) => this.getRingerMode(),
        )
    }
}
