import { AfterViewInit, Component, ElementRef, Inject, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import achievementsData from './achievements.json';

type Status = 'have' | 'strengthen' | 'need' | 'later';

interface Achievement {
  id: string;
  title: string;
  tagline: string;
  focus: string[];
  deliverable: string;
  logo: string;
  watermarkMode: string;
  color: string;
  background: string;
  textColor: string;
}

interface GapItem {
  area: string;
  status: Status;
  note: string;
}

interface Phase {
  number: number;
  days: string;
  title: string;
  tagline: string;
  focus: string[];
  deliverable: string;
}

interface WeekPlan {
  id: string;
  week: number;
  days: string;
  phase: number;
  title: string;
  goal: string;
  learn: string[];
  build: string[];
  practice: string[];
  career: string[];
  deliverable: string;
  checklist: string[];
}

const STORAGE_KEY = 'ninety-day-plan-progress';
const START_DATE_KEY = 'ninety-day-plan-start-date';
const ACHIEVEMENT_DAYS = 30;
const UNLOCK_PREVIEW_DAYS = 7;

@Component({
  selector: 'app-ninety-day-plan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ninety-day-plan.component.html',
  styleUrls: ['./ninety-day-plan.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NinetyDayPlanComponent implements AfterViewInit {
  activeStep = 'gaps';
  checked = new Set<string>();
  achievements: Achievement[] = achievementsData;
  achievementIndex = 0;
  achievementDaysLeft = ACHIEVEMENT_DAYS;
  unlockPreviewDays = UNLOCK_PREVIEW_DAYS;
  slideIndex = 0;

  readonly statusMeta: Record<Status, { label: string; dot: string }> = {
    have: { label: 'Have', dot: '🟢' },
    strengthen: { label: 'Strengthen', dot: '🟠' },
    need: { label: 'Need', dot: '🔴' },
    later: { label: 'Later', dot: '⚪' },
  };

  haveList = [
    'Angular CLI / Angular Material (real CRM rebuild)',
    'HTML5, CSS3, responsive layout across 15+ shipped projects',
    'REST API integration with backend teams',
    'Figma, design systems & component libraries',
    'Frontend performance work (Lighthouse, WebPageTest, code-splitting)',
    'Accessibility basics (WCAG applied on real projects)',
    'Git/GitHub, Jira, client-facing delivery experience',
  ];

  needList = [
    'React beyond a single project — hooks, state patterns, testing',
    'Automated testing (Jest / React Testing Library)',
    'CI/CD pipeline experience',
    'Modern React state management (Context / lightweight store)',
    'Structured interview preparation',
  ];

  gapTable: GapItem[] = [
    { area: 'HTML5 / CSS3', status: 'have', note: '10+ years, dozens of shipped responsive sites — maintain, don’t relearn.' },
    { area: 'JavaScript', status: 'have', note: 'Long-standing daily use — sharpen modern ES2020+ patterns, not fundamentals.' },
    { area: 'TypeScript', status: 'strengthen', note: 'Used across Angular projects; needs the same fluency inside React/Next.' },
    { area: 'Angular (CLI + Material)', status: 'have', note: 'Real CRM redesign, multiple production builds — a genuine strength, keep it visible.' },
    { area: 'React', status: 'strengthen', note: 'Listed as a skill and used once (Northsimcoephysio) — thin evidence, no modern-pattern depth yet.' },
    { area: 'Next.js', status: 'strengthen', note: 'Claimed on the site, zero project evidence in the resume — needs at least one real build.' },
    { area: 'Component architecture', status: 'have', note: 'Strong in Angular (reusable UI libraries); needs the React equivalent.' },
    { area: 'Responsive / mobile-first UI', status: 'have', note: 'Demonstrated repeatedly across client projects — maintain.' },
    { area: 'Accessibility (WCAG)', status: 'strengthen', note: 'Applied conceptually — needs concrete, explainable examples in a React project.' },
    { area: 'API integration', status: 'have', note: 'Explicit experience wiring frontend to backend/REST across multiple roles.' },
    { area: 'Git / GitHub workflow', status: 'have', note: 'Git, Bitbucket, branching and PR experience already on record.' },
    { area: 'Automated testing', status: 'need', note: 'No Jest, RTL, or test-writing experience anywhere on the resume — a real gap for 2026 hiring bars.' },
    { area: 'Modern React state (Context/hooks)', status: 'need', note: 'Not evidenced — this is the core of "can you actually build in React."' },
    { area: 'CI/CD', status: 'need', note: 'No pipeline experience listed — even a basic GitHub Actions deploy closes this.' },
    { area: 'Deployment', status: 'strengthen', note: 'Comfortable deploying (Vercel, client hosting) — extend to a CI-driven flow.' },
    { area: 'Frontend performance', status: 'have', note: 'Genuinely strong: Lighthouse audits, code-splitting, asset optimization already on the resume.' },
    { area: 'Interview preparation', status: 'need', note: 'No structured prep visible — treat as its own skill, separate from engineering ability.' },
    { area: 'Job-search system', status: 'need', note: 'No tracked, repeatable process yet — build one instead of applying ad hoc.' },
    { area: 'Node.js / backend / cloud (AWS, Docker)', status: 'later', note: 'Not needed for a frontend-focused hire in 90 days — revisit after landing the role.' },
  ];

  doNotLearnNow = [
    { item: 'A new backend framework (NestJS/Express depth)', reason: 'Not what a Frontend Developer posting screens for — skip until the role demands it.' },
    { item: 'Cloud infrastructure (AWS/GCP/Docker in depth)', reason: 'Interesting, but zero marginal value for a frontend interview in 90 days.' },
    { item: 'A second design tool or another CMS', reason: 'Figma + WordPress already cover this — more tools dilute, don’t add.' },
    { item: 'Another frontend framework (Vue, Svelte, SolidJS)', reason: 'You already have Angular + React in progress. A third framework is collection, not employability.' },
    { item: 'GraphQL / microservices', reason: 'Not required for frontend roles at your target level — optional/later, not now.' },
  ];

  phases: Phase[] = [
    {
      number: 1,
      days: 'Days 1–30',
      title: 'Next Achievement',
      tagline: 'Fill the specific holes the gap analysis found — nothing you already have.',
      focus: ['Modern JavaScript & TypeScript depth', 'React fundamentals, hooks, state', 'Component architecture in React', 'API integration, loading/error states', 'Accessibility & Git workflow in practice'],
      deliverable: 'A small, feature-complete React app proving the fundamentals landed.',
    },
    {
      number: 2,
      days: 'Days 31–60',
      title: 'Build Job-Ready Projects',
      tagline: '1–2 real projects, not ten tutorials — each solving a believable problem.',
      focus: ['Realistic UI with reusable components', 'Full API integration + forms/validation', 'Testing pass (Jest/RTL)', 'Deployment + CI', 'Case-study documentation'],
      deliverable: 'Two deployed, documented projects that survive a technical walkthrough.',
    },
    {
      number: 3,
      days: 'Days 61–75',
      title: 'Professional Positioning',
      tagline: 'Make sure what employers actually see matches what you can actually do.',
      focus: ['Resume rewrite (outcome-driven)', 'Portfolio audit: keep/improve/remove/add', 'LinkedIn + GitHub cleanup', 'Project case studies', 'Consistent title & numbers everywhere'],
      deliverable: 'Resume, portfolio, LinkedIn and GitHub all telling the same credible story.',
    },
    {
      number: 4,
      days: 'Days 76–90',
      title: 'Job Search + Interview',
      tagline: 'Applications and interview prep run together, on a repeatable weekly system.',
      focus: ['Targeted applications (realistic weekly volume)', 'Recruiter/direct outreach', 'Technical interview prep by topic', 'Behavioral (STAR) prep', 'Mock interviews'],
      deliverable: 'A live, tracked pipeline of applications and interviews in progress.',
    },
  ];

  dailyStructure = [
    { block: 'Learn', minutes: 60, detail: 'Targeted study on this week’s gap — not open-ended reading.' },
    { block: 'Build', minutes: 90, detail: 'Hands-on project work — the highest-leverage block, protect it.' },
    { block: 'Practice', minutes: 30, detail: 'Small coding drills or interview-style questions tied to the week.' },
    { block: 'Career', minutes: 30, detail: 'Applications, outreach, resume/portfolio work once phases 3–4 start.' },
  ];

  weeks: WeekPlan[] = [
    {
      id: 'w1', week: 1, days: 'Days 1–7', phase: 1,
      title: 'Modern JS/TS refresh + React setup',
      goal: 'Get comfortable in a React + TypeScript project without leaning on Angular habits.',
      learn: ['ES2020+ JS (destructuring, optional chaining, modules)', 'TypeScript in a non-Angular context (types, interfaces, generics basics)', 'React mental model vs Angular (JSX, props, one-way data flow)'],
      build: ['Scaffold a React + TypeScript app (Vite)', 'Rebuild one existing static layout as React components'],
      practice: ['Daily small JS/TS kata (20–30 min)'],
      career: ['List target companies and roles for later outreach'],
      deliverable: 'A running React+TS project with 3–4 componentized sections.',
      checklist: ['Scaffold project & push to GitHub', 'Convert one layout into components', 'Complete daily JS/TS practice 5x', 'Note Angular-vs-React differences that trip you up'],
    },
    {
      id: 'w2', week: 2, days: 'Days 8–14', phase: 1,
      title: 'React core: hooks, state, forms',
      goal: 'Be able to build an interactive UI with local state and controlled forms without copying a tutorial.',
      learn: ['useState, useEffect, event handling', 'Controlled forms & validation patterns', 'Lifting state up / prop drilling vs when to avoid it'],
      build: ['A form-driven feature (e.g. contact/lead form with validation)', 'A small interactive component (tabs, accordion, filter list)'],
      practice: ['Rebuild one component 2 ways (local state vs lifted state) to feel the trade-off'],
      career: ['Draft target job titles & search queries for Phase 4'],
      deliverable: 'A working form feature with client-side validation and clear error states.',
      checklist: ['Ship the form feature', 'Ship one interactive component', 'Commit daily', 'Write 3 sentences on when to lift state up'],
    },
    {
      id: 'w3', week: 3, days: 'Days 15–21', phase: 1,
      title: 'API integration + Context + routing',
      goal: 'Connect a real API and manage app-wide state without Redux-level overhead.',
      learn: ['fetch/axios + async data patterns', 'Context API for shared state', 'React Router basics'],
      build: ['Integrate a public API into the React app', 'Add loading, error and empty states', 'Add 2–3 routed pages with shared layout'],
      practice: ['Simulate a slow/broken API call and handle it gracefully'],
      career: ['Identify 5 companies you’d genuinely want to work for'],
      deliverable: 'A multi-page React app with live data, routing, and handled failure states.',
      checklist: ['API wired up with loading/error/empty states', 'Routing in place', 'Context used for at least one shared value', 'Push and deploy a preview build'],
    },
    {
      id: 'w4', week: 4, days: 'Days 22–30', phase: 1,
      title: 'Testing, accessibility, performance',
      goal: 'Close the three gaps that show up hardest in interviews: tests, a11y, performance.',
      learn: ['Jest + React Testing Library basics', 'Keyboard nav & ARIA essentials', 'Lighthouse audit workflow (already familiar from Angular work)'],
      build: ['Write tests for the Week 2–3 components', 'Accessibility pass on the whole mini-app', 'Run and fix a Lighthouse audit'],
      practice: ['Explain out loud why each test exists — interview rehearsal, not just code'],
      career: ['Draft your professional summary v1 (React + Angular positioning)'],
      deliverable: 'Phase 1 mini-project: tested, accessible, performance-audited, deployed.',
      checklist: ['5+ component/unit tests passing', 'Accessibility issues fixed and noted', 'Lighthouse score recorded before/after', 'Phase 1 project deployed live'],
    },
    {
      id: 'w5', week: 5, days: 'Days 31–37', phase: 2,
      title: 'Project 1 — plan & scaffold',
      goal: 'Define a believable product (not a todo app) and build its core structure.',
      learn: ['Scoping a portfolio project like a real product brief', 'Component architecture planning'],
      build: ['Define the project (e.g. a client/booking dashboard, drawing on real project experience)', 'Scaffold routes, layout, and core components'],
      practice: ['Sketch the data model before writing code'],
      career: ['Start a spreadsheet tracker for applications (ready for Phase 4)'],
      deliverable: 'Project 1 skeleton: routed, componentized, with a clear README brief.',
      checklist: ['Written 1-paragraph project brief', 'Core layout & routes built', 'README started', 'Repo public on GitHub'],
    },
    {
      id: 'w6', week: 6, days: 'Days 38–44', phase: 2,
      title: 'Project 1 — data, forms, states',
      goal: 'Make the project function end-to-end with real or realistic data.',
      learn: ['Async data patterns at scale (multiple endpoints/resources)', 'Form libraries vs hand-rolled validation trade-offs'],
      build: ['Full CRUD-style flow with forms and validation', 'Loading/error/empty states everywhere they matter'],
      practice: ['Break your own app on purpose and fix the failure states'],
      career: ['Shortlist 15–20 target companies for outreach later'],
      deliverable: 'Project 1 functionally complete end-to-end.',
      checklist: ['CRUD flow working', 'All states (loading/error/empty) handled', 'Responsive pass done', 'Commits reflect real incremental progress'],
    },
    {
      id: 'w7', week: 7, days: 'Days 45–51', phase: 2,
      title: 'Project 1 — test, deploy, document',
      goal: 'Turn the working app into a portfolio-grade, explainable piece of evidence.',
      learn: ['Deployment pipeline basics (Vercel + GitHub integration)', 'Writing a technical README/case study'],
      build: ['Test coverage for core flows', 'Deploy to production', 'Write the case study: problem → approach → contribution → outcome'],
      practice: ['Do a 5-minute spoken walkthrough of the project to yourself or a peer'],
      career: ['Draft resume bullet points for Project 1'],
      deliverable: 'Project 1 live, tested, and documented as a case study.',
      checklist: ['Deployed to production URL', 'Case study written', 'Tests passing in CI or locally', 'Resume bullets drafted'],
    },
    {
      id: 'w8', week: 8, days: 'Days 52–60', phase: 2,
      title: 'Project 2 (focused) + TypeScript/perf hardening',
      goal: 'Add a second, smaller React project that shows range without diluting focus.',
      learn: ['TypeScript strictness (avoid `any`, proper typing of props/API responses)', 'Performance budget thinking'],
      build: ['A smaller, sharply-scoped second project (different problem domain than Project 1)', 'Revisit Project 1 with a TypeScript/perf hardening pass'],
      practice: ['Type an untyped file from Week 1–2 properly'],
      career: ['Update portfolio structure to feature both projects (3 max, per positioning plan)'],
      deliverable: 'Two live projects, both typed cleanly and performance-checked.',
      checklist: ['Project 2 shipped and deployed', 'Project 1 TypeScript hardened', 'Both Lighthouse-audited', 'Portfolio draft updated with both'],
    },
    {
      id: 'w9', week: 9, days: 'Days 61–67', phase: 3,
      title: 'Resume + portfolio audit',
      goal: 'Make the resume and portfolio match the strongest, most current version of your work.',
      learn: ['Outcome-driven bullet writing', 'Keep/Improve/Remove/Add audit method'],
      build: ['Rewrite resume bullets using real outcomes (10% engagement lift, Lighthouse gains, etc.)', 'Audit the live portfolio: keep/improve/remove/add per section'],
      practice: ['Read your resume aloud — cut anything that doesn’t sound like evidence'],
      career: ['Finalize the "Frontend Developer" title consistently everywhere'],
      deliverable: 'Updated resume + a written audit list for the portfolio.',
      checklist: ['Resume bullets rewritten with outcomes', 'Portfolio audit list completed', 'Title consistent across resume/site/LinkedIn draft', 'Old/placeholder content flagged for removal'],
    },
    {
      id: 'w10', week: 10, days: 'Days 68–74', phase: 3,
      title: 'LinkedIn, GitHub & case studies',
      goal: 'Make every public profile tell the same credible, current story.',
      learn: ['LinkedIn headline/summary structure for developers', 'GitHub profile hygiene (pinned repos, READMEs)'],
      build: ['Rewrite LinkedIn headline & About section', 'Pin and clean up Project 1 & 2 on GitHub', 'Finish both project case studies on the portfolio'],
      practice: ['Get one honest round of feedback from a peer or mentor on resume + portfolio'],
      career: ['Warm up your network: 5 short reconnect messages'],
      deliverable: 'LinkedIn, GitHub and portfolio fully aligned and current.',
      checklist: ['LinkedIn updated', 'GitHub pinned repos cleaned', 'Case studies published on portfolio', 'Feedback collected and acted on'],
    },
    {
      id: 'w11', week: 11, days: 'Days 75–80', phase: 3,
      title: 'Final polish + first applications',
      goal: 'Close out positioning and start the search with materials you trust.',
      learn: ['Common ATS/resume-formatting pitfalls'],
      build: ['Fix everything flagged in the Week 9–10 feedback round', 'Prepare 2–3 resume variants for adjacent titles (Frontend/UI Engineer)'],
      practice: ['Time yourself explaining each project in under 60 seconds'],
      career: ['Submit first 5–10 well-targeted applications'],
      deliverable: 'Finalized materials + first applications submitted.',
      checklist: ['All flagged issues fixed', 'Resume variants ready', '60-second project pitch rehearsed', 'First applications logged in tracker'],
    },
    {
      id: 'w12', week: 12, days: 'Days 81–87', phase: 4,
      title: 'Technical interview prep + applications',
      goal: 'Build real interview reps while keeping the application pipeline moving.',
      learn: ['Core JS/React/TS interview questions', 'HTML/CSS & accessibility questions', 'Frontend architecture & API-design questions'],
      build: ['A personal question bank from mock/practice sessions'],
      practice: ['2–3 mock technical interviews (peer, mentor, or structured self-practice)'],
      career: ['10–15 targeted applications this week + 5–10 direct outreach messages'],
      deliverable: 'A rehearsed technical interview process + an active application pipeline.',
      checklist: ['Question bank started', '2+ mock interviews done', 'Weekly application target hit', 'Tracker updated with responses'],
    },
    {
      id: 'w13', week: 13, days: 'Days 88–90', phase: 4,
      title: 'Behavioral prep + review',
      goal: 'Round out interview readiness and take stock of the full 90 days.',
      learn: ['STAR method for behavioral answers'],
      build: ['5–6 STAR stories drawn from real project experience'],
      practice: ['1 full mock interview: technical + behavioral back to back'],
      career: ['Keep applications and follow-ups moving; review tracker for patterns'],
      deliverable: 'A complete, evidence-based Frontend Developer candidate profile — and a running search.',
      checklist: ['STAR stories written', 'Full mock interview completed', 'Tracker reviewed for what’s working', 'Day 90 review: what to carry into Phase 5'],
    },
  ];

  jobReadyChecklist = [
    'Build a frontend feature without following a tutorial',
    'Explain your architecture decisions out loud',
    'Build and reuse components deliberately',
    'Consume and integrate a real API',
    'Handle loading, error and empty states by default',
    'Write maintainable TypeScript (no stray `any`)',
    'Use Git with confidence — branches, PRs, clean history',
    'Deploy an application end-to-end',
    'Explain accessibility decisions on a real project',
    'Explain responsive-design decisions on a real project',
    'Debug an unfamiliar frontend problem methodically',
    'Discuss performance trade-offs with numbers',
    'Walk through any portfolio project in under 2 minutes',
    'Answer common frontend interview questions confidently',
    'Complete a realistic timed coding task',
  ];

  futureTracks = ['Advanced React patterns', 'Testing depth', 'Design systems', 'Accessibility specialization', 'Frontend architecture / senior scope', 'Full-stack (Node/DB)', 'Cloud & deployment'];

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get totalChecklistItems(): number {
    return this.weeks.reduce((sum, w) => sum + w.checklist.length, 0);
  }

  get activeSlide(): Achievement {
    return this.achievements[this.slideIndex];
  }

  /** Any achievement past the current one is still browsable in the slider, but shows a locked teaser instead of real content. */
  get isLockedPreview(): boolean {
    return this.slideIndex > this.achievementIndex;
  }

  /** Real days remaining until this slide's 30-day slot actually starts. */
  get daysUntilStart(): number {
    if (this.slideIndex <= this.achievementIndex) return 0;
    return this.achievementDaysLeft + (this.slideIndex - this.achievementIndex - 1) * ACHIEVEMENT_DAYS;
  }

  get isUnlockingSoon(): boolean {
    return this.daysUntilStart <= this.unlockPreviewDays;
  }

  get slideBadge(): string {
    return this.slideIndex === this.achievementIndex ? "🚀 This Month — What You'll Learn" : '✅ Completed';
  }

  get slideCountdown(): { value: string; label: string } {
    return this.slideIndex === this.achievementIndex
      ? { value: String(this.achievementDaysLeft), label: 'days left' }
      : { value: '✓', label: 'completed' };
  }

  nextSlide(): void {
    this.slideIndex = (this.slideIndex + 1) % this.achievements.length;
  }

  prevSlide(): void {
    this.slideIndex = (this.slideIndex - 1 + this.achievements.length) % this.achievements.length;
  }

  get progressPercent(): number {
    if (!this.totalChecklistItems) return 0;
    return Math.round((this.checked.size / this.totalChecklistItems) * 100);
  }

  get haveItems(): GapItem[] {
    return this.gapTable.filter((g) => g.status === 'have');
  }

  get strengthenItems(): GapItem[] {
    return this.gapTable.filter((g) => g.status === 'strengthen');
  }

  get needItems(): GapItem[] {
    return this.gapTable.filter((g) => g.status === 'need');
  }

  get laterItems(): GapItem[] {
    return this.gapTable.filter((g) => g.status === 'later');
  }

  weeksForPhase(phaseNumber: number): WeekPlan[] {
    return this.weeks.filter((w) => w.phase === phaseNumber);
  }

  toggleStep(id: string): void {
    this.activeStep = this.activeStep === id ? '' : id;
  }

  isChecked(weekId: string, index: number): boolean {
    return this.checked.has(`${weekId}-${index}`);
  }

  toggleItem(weekId: string, index: number): void {
    const key = `${weekId}-${index}`;
    this.checked.has(key) ? this.checked.delete(key) : this.checked.add(key);
    this.saveProgress();
  }

  private saveProgress(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.checked)));
  }

  private loadProgress(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      this.checked = new Set(JSON.parse(raw));
    } catch {
      this.checked = new Set();
    }
  }

  private loadCountdown(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    let startDate = localStorage.getItem(START_DATE_KEY);
    if (!startDate) {
      startDate = new Date().toISOString();
      localStorage.setItem(START_DATE_KEY, startDate);
    }
    const elapsedDays = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);
    const lastIndex = this.achievements.length - 1;
    this.achievementIndex = Math.min(lastIndex, Math.floor(elapsedDays / ACHIEVEMENT_DAYS));
    this.slideIndex = this.achievementIndex;
    const daysIntoCurrent = elapsedDays - this.achievementIndex * ACHIEVEMENT_DAYS;
    this.achievementDaysLeft = Math.max(0, ACHIEVEMENT_DAYS - daysIntoCurrent);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.loadProgress());
    this.loadCountdown();
    const revealItems = this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.reveal-up');
    if (!revealItems.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    revealItems.forEach((item) => observer.observe(item));
  }
}
