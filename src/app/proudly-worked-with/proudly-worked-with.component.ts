import { AfterViewInit, Component, ElementRef, Inject, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface WorkedWithLogo {
  src: string;
  name: string;
  url?: string;
}

@Component({
  selector: 'app-proudly-worked-with',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proudly-worked-with.component.html',
  styleUrls: ['./proudly-worked-with.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProudlyWorkedWithComponent implements AfterViewInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    // Self-contained reveal animation — doesn't depend on the host page's
    // WOW.js instance, which only scans the DOM once and misses elements
    // rendered later via Angular's client-side route navigation.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const revealItems = this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.pw-reveal');
    if (!revealItems.length) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  // Sourced only from src/assets/images/portfolio-screenshot — no placeholders.
  logos: WorkedWithLogo[] = [
    { src: './assets/images/portfolio-screenshot/ALGAD.png', name: 'Algad' },
    { src: './assets/images/portfolio-screenshot/Cfenviro.png', name: 'CF Enviro' },
    { src: './assets/images/portfolio-screenshot/Direct-Drilling-Utilities-Inc.png', name: 'Direct Drilling Utilities Inc.' },
    { src: './assets/images/portfolio-screenshot/EPIXEL.png', name: 'Epixel' },
    { src: './assets/images/portfolio-screenshot/EQUITY TAXATION.png', name: 'Equity Taxation' },
    { src: './assets/images/portfolio-screenshot/East-Coast-Driving-Academy.png', name: 'East Coast Driving Academy' },
    { src: './assets/images/portfolio-screenshot/Equity-Taxation-LLP_CRM.png', name: 'Equity Taxation LLP CRM' },
    { src: './assets/images/portfolio-screenshot/FlashTax-Advisors.png', name: 'FlashTax Advisors' },
    { src: './assets/images/portfolio-screenshot/Haleel-Group-Empowering-Growth-Inspiring-Innovation.png', name: 'Haleel Group' },
    { src: './assets/images/portfolio-screenshot/North-Simcoe-Physiotherapy.png', name: 'North Simcoe Physiotherapy' },
    { src: './assets/images/portfolio-screenshot/Online-Money-Transfer-Send-Money-Abroad-Hami-Remit.png', name: 'Hami Remit' },
    { src: './assets/images/portfolio-screenshot/PAYSII.png', name: 'Paysii' },
    { src: './assets/images/portfolio-screenshot/PreTime-Tax-Services.png', name: 'PreTime Tax Services' },
    { src: './assets/images/portfolio-screenshot/SundusPay-Money-Transfer.png', name: 'SundusPay' },
    { src: './assets/images/portfolio-screenshot/TAYSEER.png', name: 'Tayseer' },
    { src: './assets/images/portfolio-screenshot/balochfarms-ca.png', name: 'Baloch Farms' },
    { src: './assets/images/portfolio-screenshot/cyberarch-new.png', name: 'Cyberarch' },
    { src: './assets/images/portfolio-screenshot/cyberarch-ca.png', name: 'Cyberarch (Legacy)' },
    { src: './assets/images/portfolio-screenshot/networkroots.png', name: 'Network Roots' },
  ];
}
