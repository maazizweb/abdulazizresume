import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProudlyWorkedWithComponent } from '../proudly-worked-with/proudly-worked-with.component';

@Component({
  selector: 'app-worked-with-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProudlyWorkedWithComponent],
  templateUrl: './worked-with-page.component.html',
  styleUrls: ['./worked-with-page.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class WorkedWithPageComponent {}
