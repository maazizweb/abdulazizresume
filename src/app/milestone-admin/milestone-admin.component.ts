import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import achievementsData from '../ninety-day-plan/achievements.json';

type Status = 'have' | 'strengthen' | 'need' | 'later';

interface Achievement {
  id: string;
  title: string;
  isCourse: boolean;
  status: Status;
  note: string;
  category?: string;
  tagline?: string;
  focus?: string[];
  deliverable?: string;
  logo?: string;
  color?: string;
  background?: string;
  textColor?: string;
  courseCompletion?: string;
  link?: string;
}

const PAGE_SIZE = 9;

@Component({
  selector: 'app-milestone-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './milestone-admin.component.html',
  styleUrls: ['./milestone-admin.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MilestoneAdminComponent {
  readonly allAchievements: Achievement[] = achievementsData as Achievement[];
  readonly statusOptions: Array<Status | 'all'> = ['all', 'have', 'strengthen', 'need', 'later'];

  readonly statusMeta: Record<Status, { label: string; dot: string }> = {
    have: { label: 'Have', dot: '🟢' },
    strengthen: { label: 'Strengthen', dot: '🟠' },
    need: { label: 'Need', dot: '🔴' },
    later: { label: 'Later', dot: '⚪' },
  };

  search = '';
  statusFilter: Status | 'all' = 'all';
  page = 1;

  get filtered(): Achievement[] {
    const term = this.search.trim().toLowerCase();
    return this.allAchievements.filter((a) => {
      const matchesStatus = this.statusFilter === 'all' || a.status === this.statusFilter;
      const matchesTerm =
        !term ||
        a.title.toLowerCase().includes(term) ||
        a.note.toLowerCase().includes(term) ||
        (a.category ?? '').toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE));
  }

  get paged(): Achievement[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilterChange(): void {
    this.page = 1;
  }

  goToPage(page: number): void {
    this.page = Math.min(Math.max(page, 1), this.totalPages);
  }
}
