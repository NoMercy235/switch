import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from "@ionic/storage";

@NgModule({
    imports: [
        HttpModule,
        IonicStorageModule.forRoot(),
    ],
    exports: [
        HttpModule,
    ],
    declarations: [],
    providers: [],
})
export class SharedModule {
}
