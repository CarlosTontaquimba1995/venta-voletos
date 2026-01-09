import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideToastr } from 'ngx-toastr';

// Register Spanish locale data
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      CommonModule,
      ReactiveFormsModule
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      enableHtml: true,
      tapToDismiss: false,
      newestOnTop: true,
      progressAnimation: 'increasing',
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      extendedTimeOut: 1000,
      disableTimeOut: false,
      easing: 'ease-in',
      easeTime: 300,
      toastClass: 'ngx-toastr',
      onActivateTick: false
    }),
    { provide: LOCALE_ID, useValue: 'es' }
  ],
};