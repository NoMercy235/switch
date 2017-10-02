import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from "ionic-angular";

@Component({
    selector: 'ab-sidemenu',
    templateUrl: 'sidemenu.component.html'
})

export class SidemenuComponent {
    @Input() inputNav: NavController;

    constructor() {
        console.log(this.inputNav);
    }

}