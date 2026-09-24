import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import PocketBase from 'pocketbase';

interface JobRequirement {
  id: string;
  file?: string | string[];
  [key: string]: unknown;
}

@Component({
  selector: 'app-job-requirements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-requirements.component.html',
  styleUrls: ['./job-requirements.component.css'],
})
export class JobRequirementsComponent implements OnInit {
  jobs: JobRequirement[] = [];
  loading = true;
  previewSrc: string | null = null;
  private pb = new PocketBase('https://azzydevpb.nurexia.co');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.jobs = await this.pb.collection('Jobs_Requirements').getFullList<JobRequirement>();
    } finally {
      this.loading = false;
    }
  }

  imageUrls(job: JobRequirement): string[] {
    const file = job.file;
    if (!file) return [];
    const filenames = Array.isArray(file) ? file : [file];
    return filenames.map((filename) => this.pb.files.getURL(job, filename));
  }
}
