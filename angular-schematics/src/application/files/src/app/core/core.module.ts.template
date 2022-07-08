import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [],
    exports: [],
    providers: [
        // put your services here, ensures they are actually singletons
    ]
})

/**
 * Main/singular application module for the application. Good
 * place to add in services and application specific views/models/etc.
 *
 * @see https://angular.io/guide/module-types.
 */
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: CoreModule,
            providers: [
                // add in service config providers
                // {provide: MyServiceConfig, useValue: config}
            ]
        };
    }

}
