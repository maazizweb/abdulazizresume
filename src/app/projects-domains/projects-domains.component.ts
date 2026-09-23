import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import PocketBase from 'pocketbase';

interface ProjectDomain {
  id: string;
  url: string;
}

@Component({
  selector: 'app-projects-domains',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-domains.component.html',
  styleUrls: ['./projects-domains.component.css'],
})
export class ProjectsDomainsComponent implements OnInit {
  projects: ProjectDomain[] = [];
  loading = true;
  search = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const pb = new PocketBase('https://azzydevpb.nurexia.co');
    try {
      this.projects = await pb.collection('projects_domains').getFullList<ProjectDomain>();
    } finally {
      this.loading = false;
    }
  }

  domainName(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  get filteredProjects(): ProjectDomain[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.projects;
    return this.projects.filter((p) => this.domainName(p.url).toLowerCase().includes(term));
  }
}
