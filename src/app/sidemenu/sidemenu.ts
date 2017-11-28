import { Component, Input } from '@angular/core';
import { NavController } from "ionic-angular";
import { SettingsPage } from "../../pages/settings/settings";

@Component({
    selector: 'ab-sidemenu',
    templateUrl: 'sidemenu.component.html'
})
export class SidemenuComponent {
    @Input() inputNav: NavController;

    constructor() {}

    goToSettings(): void {
        this.inputNav.push(SettingsPage);
    }
}