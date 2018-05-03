import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, ToastController } from 'ionic-angular';
import { UserSettingsService } from "../../app/shared/user-settings.service";
import { FormControl, FormGroup } from "@angular/forms";
import { RingerService } from "../../app/shared/ringer.service";

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {
    public form: FormGroup;

    public runInBackground: boolean;
    public modes: string[];

    constructor(
        private userSettings: UserSettingsService,
        private toastCtrl: ToastController,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
    ) {
        this.modes = Object.keys(RingerService.RINGER_MODE);
        this.initForm();
    }

    private initForm(): void {
        this.form = new FormGroup({
            frequency: new FormControl(300),
            motionSensibility: new FormControl(5),
            runInBackground: new FormControl(false),
            standingMode: new FormControl(this.modes[0]),
            // silentScreen: new FormControl(false),
            // silentScreenDelay: new FormControl(10,
            //     [Validators.min(10), Validators.max(300)]
            // ),
        });
    }

    ionViewDidLoad(): void {
        this.userSettings.getSettings().then((data) => {
            if (data.frequency !== undefined) this.form.patchValue({ frequency: data.frequency });
            if (data.motionSensibility !== undefined) this.form.patchValue({ motionSensibility: data.motionSensibility / 1000 });
            if (data.runInBackground !== undefined) this.form.patchValue({ runInBackground: data.runInBackground });
            if (data.standingMode !== undefined) this.form.patchValue({ standingMode: data.standingMode });
            // if (data.silentScreen !== undefined) this.form.patchValue({ silentScreen: data.silentScreen });
            // if (data.silentScreenDelay !== undefined) this.form.patchValue({ silentScreenDelay: data.silentScreenDelay });
        })
    }

    onRunInBackgroundChange(): void {
        if (this.runInBackground) {
            const confirm = this.alertCtrl.create({
                title: 'Allow Switch to run in background',
                message: 'You can still close the app anytime if you don\'t want it to run.',
                buttons: [
                    { text: 'Yes' },
                    {
                        text: 'Cancel',
                        handler: () => {
                            this.runInBackground = false;
                            this.form.patchValue({ runInBackground: false });
                            return true;
                        }
                    },
                ]
            });
            confirm.present();
        }
    }

    saveSettings(): void {
        this.userSettings.setSettings(this.form.value);
        const toast = this.toastCtrl.create({
            message: 'Settings saved',
            showCloseButton: true,
            position: 'bottom',
            duration: 2000,
        });
        toast.present().then(() => {
            this.navCtrl.pop();
        });
    }
}
