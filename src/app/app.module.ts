import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PagesModule } from "../pages/pages.module";
import { SharedModule } from "./shared/shared.module";
import { SidemenuModule } from "./sidemenu/sidemenu.module";
import { AndroidPermissions } from '@ionic-native/android-permissions';

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
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AndroidPermissions,
    ]
})
export class AppModule {}
