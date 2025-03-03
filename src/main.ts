/// <reference types="@angular/localize" />

/*********************************************************************
 * Copyright (c) Intel Corporation 2022
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { enableProdMode, importProvidersFrom } from '@angular/core'
import { environment } from './environments/environment'
import { AppComponent } from './app/app.component'
import { LoginComponent } from './app/login/login.component'
import { DashboardComponent } from './app/dashboard/dashboard.component'
import { provideRouter } from '@angular/router'
import { provideAnimations } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app/app-routing.module'
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser'
import { MomentModule } from 'ngx-moment'
import { AuthorizeInterceptor } from './app/authorize.interceptor'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HttpClient } from '@angular/common/http'

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      MomentModule, 
      BrowserModule, 
      AppRoutingModule,  
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    provideHttpClient(withInterceptors([AuthorizeInterceptor])),
    provideAnimations(),
    provideRouter([
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ])

  ]
}).catch((err) => {
  console.error(err)
})
