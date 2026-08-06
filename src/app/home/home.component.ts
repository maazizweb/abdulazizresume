import { AfterViewInit, Component, OnInit, NO_ERRORS_SCHEMA, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiServicesService } from '../../services/api-services.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';



@Component({
  selector: 'app-home',
  standalone: true,  // Standalone Component
  imports: [
    CommonModule,    // Required for common directives like NgIf, NgFor
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeComponent implements OnInit, AfterViewInit {
  title = 'Mohammed Abdul Aziz - Portfolio';

  clientLogos = [
    { src: './assets/images/clients-logo/EquityTaxation-LLP-Client_logo.png', alt: 'Equity Taxation LLP' },
    { src: './assets/images/clients-logo/paysii-logo.png', alt: 'Paysii' },
    { src: './assets/images/clients-logo/cyberarch-logo.png', alt: 'Cyberarch' },
    { src: './assets/images/clients-logo/epixelweb-Client_Logo.png', alt: 'Epixel Web' },
    { src: './assets/images/clients-logo/Tayseertechnologies-logo.png', alt: 'Tayseer Technologies' },
    { src: './assets/images/clients-logo/networkroots.logo.png', alt: 'Network Roots' },
    { src: './assets/images/clients-logo/pretimetax-logo.png', alt: 'Pretime Tax' },
    { src: './assets/images/clients-logo/sundusexchange.png', alt: 'Sundus Exchange' },
    { src: './assets/images/clients-logo/cravingbites-Logo.png', alt: 'Craving Bites' },
    { src: './assets/images/clients-logo/baloch-farmLogo.png', alt: 'Baloch Farm' },
    { src: './assets/images/clients-logo/FlashTaxAdvisors-logo.png', alt: 'Flash Tax Advisors' },
    { src: './assets/images/clients-logo/fourthpartner-logo.png', alt: 'Fourth Partner' },
    { src: './assets/images/clients-logo/sunduspay-exchange-logo.png', alt: 'Sundus Pay Exchange' },
    { src: './assets/images/clients-logo/agilehive-logo.png', alt: 'Agile Hive' },
    { src: './assets/images/clients-logo/ntrides-logo.png', alt: 'N Trides' },
    { src: './assets/images/clients-logo/physiocan-logo.png', alt: 'Physiocan' },
    { src: './assets/images/clients-logo/East-Coast-Driving-Academy.png', alt: 'East Coast Driving Academy' },
  ];

  skillGroups: { name: string; icon: string; skills: string[] }[] = [
    {
      name: 'Languages & Core',
      icon: 'bi-code-slash',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'jQuery'],
    },
    {
      name: 'Frameworks & Libraries',
      icon: 'bi-diagram-3',
      skills: ['Angular CLI', 'Angular Material', 'React JS', 'Next JS', 'Astro JS', 'Bootstrap 4 & 5', 'PrimeNG'],
    },
    {
      name: 'Design Tools',
      icon: 'bi-palette',
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Balsamiq', 'CorelDRAW'],
    },
    {
      name: 'CMS & Platforms',
      icon: 'bi-window-stack',
      skills: ['WordPress', 'Joomla', 'Dreamweaver', 'MySQL', 'CMS/E-Commerce'],
    },
    {
      name: 'Workflow & Tools',
      icon: 'bi-tools',
      skills: ['Git', 'GitHub', 'GitLab', 'Jira', 'Postman', 'Bash / CLI', 'Cursor AI', 'Claude Code'],
    },
  ];

  activeSkillTab = 0;

  constructor(
    private apiServ: ApiServicesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // Not In USE
    // this.apiServ.getGoogleSheetData().then((res)=> {
    //   console.log(res);
    // })
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const revealItems = document.querySelectorAll<HTMLElement>('.reveal-up');
    if (!revealItems.length) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    revealItems.forEach((item) => observer.observe(item));

    const counters = document.querySelectorAll<HTMLElement>('.tm_counter');
    if (counters.length) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateCounter(entry.target as HTMLElement);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  private animateCounter(el: HTMLElement) {
    const from = parseFloat(el.getAttribute('data-from') || '0');
    const to = parseFloat(el.getAttribute('data-to') || '0');
    const speed = parseFloat(el.getAttribute('data-speed') || '1500');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / speed, 1);
      const value = from + (to - from) * progress;
      el.textContent = value
        .toFixed(decimals)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }
}
