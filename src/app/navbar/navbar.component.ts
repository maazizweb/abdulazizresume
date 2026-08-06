import {
  AfterViewInit,
  Component,
  Inject,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  mobileMenuOpen = false;

  private readonly isBrowser: boolean;

  private removeScrollListener?: () => void;
  private removeLoadListener?: () => void;

  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.closeMobileMenu();

    if (!this.isBrowser) {
      return;
    }

    const urlTree = this.router.parseUrl(this.router.url);
    const isHomeRoute =
      !urlTree.root.children['primary'] ||
      urlTree.root.children['primary'].segments.length === 0;

    if (isHomeRoute) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      return;
    }

    this.router.navigate(['/'], { fragment: sectionId });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.initScrollSpy();
  }

  ngOnDestroy(): void {
    this.removeScrollListener?.();
    this.removeLoadListener?.();
  }

  private initScrollSpy(): void {
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.section-link')
    );

    if (!navLinks.length) {
      return;
    }

    const setActive = (): void => {
      const sections = navLinks
        .map((link) => {
          const id = link.dataset['section'];
          return id ? document.getElementById(id) : null;
        })
        .filter((el): el is HTMLElement => el !== null);

      if (!sections.length) {
        return;
      }

      const scrollPos = window.scrollY + 160;

      let currentSection = sections[0];
      let bestTop = -Infinity;

      for (const section of sections) {
        if (section.offsetTop <= scrollPos && section.offsetTop > bestTop) {
          bestTop = section.offsetTop;
          currentSection = section;
        }
      }

      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.dataset['section'] === currentSection.id
        );
      });
    };

    const scrollHandler = (): void => setActive();
    const loadHandler = (): void => setActive();

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('load', loadHandler);

    this.removeScrollListener = () =>
      window.removeEventListener('scroll', scrollHandler);

    this.removeLoadListener = () =>
      window.removeEventListener('load', loadHandler);

    setActive();
  }
}