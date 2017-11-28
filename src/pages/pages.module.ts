import { NgModule } from '@angular/core';
import { HomePageModule } from "./home/home.module";
import { SettingsPageModule } from "./settings/settings.module";

@NgModule({
    imports: [
        HomePageModule,
        SettingsPageModule,
    ],
    exports: [],
    providers: [],
})
export class PagesModule {
}
