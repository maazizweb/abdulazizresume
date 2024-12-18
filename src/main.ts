import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { register as registerSwiperElements } from 'swiper/element/bundle';
registerSwiperElements();

bootstrapApplication(AppComponent, {
  providers: [
  
    provideHttpClient(),
  
    BrowserAnimationsModule,  // Add BrowserAnimationsModule for animations
  ]
}).catch(err => console.error(err));
