import { Component, Inject, NO_ERRORS_SCHEMA, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent implements OnInit {
  title = 'Mohammed Abdul Aziz - Portfolio';

  // Rendered once at the app root (outside <router-outlet>), so this only
  // ever shows on the true first load of the SPA — never re-appears when
  // navigating back to a route client-side.
  preloaderFadingOut = false;
  preloaderRemoved = false;

  // Thin top progress bar shown for the duration of any route navigation,
  // so switching pages (e.g. Home -> /worked-with) gives instant feedback
  // instead of feeling like nothing happened until the new page paints.
  routeLoading = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.scrollTo(0, 0);

    setTimeout(() => {
      this.preloaderFadingOut = true;
      setTimeout(() => {
        this.preloaderRemoved = true;
      }, 300);
    }, 300);

    // Manual scroll handling on every route change. Angular's own
    // withInMemoryScrolling (configured in app.config.ts) is supposed to
    // cover this, but in practice it has not been reliably scrolling to
    // top on plain routerLink navigation in this app — so this takes full,
    // explicit control instead of layering another workaround on top of a
    // mechanism that isn't firing.
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.routeLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.routeLoading = false;
        const fragment = this.router.parseUrl(event.urlAfterRedirects).fragment;
        // Wait a tick so the new route's view has rendered before we act
        // on its layout (scrollIntoView needs the target element to exist;
        // scrollTo needs the new page's content in place so nothing later
        // in the render pushes the scroll position again).
        setTimeout(() => {
          if (fragment) {
            document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo(0, 0);
          }
        }, 0);
      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.routeLoading = false;
      }
    });
  }
}
