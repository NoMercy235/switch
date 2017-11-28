import {Component, ViewChild} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HomePage } from "../pages/home/home";
import { BackgroundMode } from '@ionic-native/background-mode';
import { UserSettings, UserSettingsService } from "./shared/user-settings.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('nav') nav: NavController;

    rootPage: any = HomePage;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private backgroundMode: BackgroundMode,
        private userSettings: UserSettingsService,
    ) {
        this.initBackgroundMode();
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();

            platform.registerBackButtonAction(() => {
                this.userSettings.getSettings().then((data: UserSettings) => {
                    if (this.nav.canGoBack()) {
                        this.nav.pop();
                    } else
                    if (data.isEnabled && data.runInBackground) {
                        this.backgroundMode.moveToBackground();
                    }else {
                        this.platform.exitApp();
                    }
                });
            });
        });
    }

    private initBackgroundMode(): void {
        // Do nothing beacuse the app should be left in the background.
        this.backgroundMode.enable();
        // this.backgroundMode.overrideBackButton();
        this.backgroundMode.setDefaults({
            title: 'Switch is working',
            text: 'Switch is currently handling your ringer profile',
            icon: 'screen',
        });
    }
}
