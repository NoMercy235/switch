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

    constructor() {
        cpr.getRingerMode(
            (data) => console.log(data),
            (err) => console.log(err),
        );
    }

}
