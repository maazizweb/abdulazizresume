import { AfterViewInit, Component, Inject, NO_ERRORS_SCHEMA, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  formData = {
    name: '',
    email: '',
    message: '',
  };

  contactStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  // Whether the "Go Up" button has scrolled into its visible state.
  backTopShow = false;

  private onScroll = () => {
    this.backTopShow = window.scrollY >= 500;
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Wired here (rather than the legacy assets/js/main.js) because that
    // script runs synchronously at page-load time, before Angular has
    // rendered this element into the DOM — its querySelector(".back-top")
    // returned null and the click handler was never attached.
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.removeEventListener('scroll', this.onScroll);
  }

  scrollToTop() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sendEmail(form: any) {
    const serviceID = 'service_clfo30o';
    const templateID = 'template_wyg4bop';
    const publicKey = 'GC651imGW-EZCLx62';
    this.contactStatus = 'sending';
    emailjs
      .send(serviceID, templateID, this.formData, publicKey)
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          this.contactStatus = 'success';
          this.formData = { name: '', email: '', message: '' }; // Reset form
          form.resetForm();
          if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => window.location.reload(), 3000);
          }
        },
        (error) => {
          console.log('FAILED...', error);
          this.contactStatus = 'error';
        }
      );
  }
}
