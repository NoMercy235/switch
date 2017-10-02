import { NgModule } from '@angular/core';
import { SidemenuComponent } from './sidemenu';
import { IonicModule } from "ionic-angular";

@NgModule({
    imports: [
        IonicModule,
    ],
    exports: [
        SidemenuComponent,
    ],
    declarations: [
        SidemenuComponent,
    ],
    providers: [],
})
export class SidemenuModule {}
