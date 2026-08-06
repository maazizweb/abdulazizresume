import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Scroll-to-top / scroll-to-fragment on navigation is handled manually in
// AppComponent instead of via withInMemoryScrolling — that built-in feature
// was not reliably firing for plain routerLink clicks in this app.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideClientHydration()
  ]
};
