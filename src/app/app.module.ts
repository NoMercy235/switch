import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { PagesModule } from "../pages/pages.module";
import { SharedModule } from "./shared/shared.module";
import { SidemenuModule } from "./sidemenu/sidemenu.module";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DeviceMotion } from '@ionic-native/device-motion';
import { Gyroscope } from '@ionic-native/gyroscope';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, { preloadModules: false, }),
        PagesModule,
        SharedModule,
        SidemenuModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        StatusBar,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AndroidPermissions,
        DeviceMotion,
        Gyroscope,
        BackgroundMode,
    ]
})
export class AppModule {}
