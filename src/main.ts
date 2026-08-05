import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { routes } from './app/app.routes';
registerSwiperElements();

bootstrapApplication(AppComponent, {
  providers: [

    provideRouter(routes),
    provideHttpClient(),

    BrowserAnimationsModule,  // Add BrowserAnimationsModule for animations
  ]
}).catch(err => console.error(err));
