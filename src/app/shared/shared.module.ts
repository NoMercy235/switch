import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from "@ionic/storage";
import { UserSettingsService } from "./user-settings.service";
import { MotionService } from "./motion.service";
import { RingerService } from "./ringer.service";
import { MotionChangeLogicService } from "./motion-change-logic.service";

@NgModule({
    imports: [
        HttpModule,
        IonicStorageModule.forRoot(),
    ],
    exports: [
        HttpModule,
    ],
    declarations: [],
    providers: [
        UserSettingsService,
        MotionService,
        RingerService,
        MotionChangeLogicService,
    ],
})
export class SharedModule {
}
