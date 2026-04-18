import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container fade-in">
      <div class="header-actions">
        <h1>AI Prompt Library</h1>
        <button class="btn btn-primary" routerLink="/add">+ New Prompt</button>
      </div>

      <!-- Loading Skeleton -->
      <div class="grid" *ngIf="loading">
        <div class="glass-card skeleton-card" *ngFor="let i of skeletons">
          <div class="skeleton-title"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <!-- Prompts Grid -->
      <div class="grid" *ngIf="!loading && prompts.length > 0">
        <div *ngFor="let prompt of prompts; trackBy: trackById"
             class="glass-card prompt-card"
             (click)="openPrompt(prompt)">
          <div class="card-header">
            <h3>{{ prompt.title }}</h3>
            <span class="complexity-badge" [ngClass]="getComplexityClass(prompt.complexity)">
              {{ prompt.complexity }}
            </span>
          </div>
          <p class="preview">{{ (prompt.content || '') | slice:0:120 }}...</p>
          <div class="card-footer">
            <span class="date">{{ prompt.created_at | date:'mediumDate' }}</span>
            <span class="view-more">View Details →</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && prompts.length === 0" class="empty-state glass-card">
        <p>🎨 No prompts yet. Create your first one!</p>
        <button class="btn btn-primary" routerLink="/add" style="margin-top:1rem">+ Create Prompt</button>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .prompt-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .prompt-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .card-header h3 {
      margin: 0;
      font-size: 1.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 78%;
    }
    .complexity-badge {
      padding: 0.2rem 0.6rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .complexity-low  { background: #10b981; }
    .complexity-mid  { background: #f59e0b; }
    .complexity-high { background: #ef4444; }
    .preview {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      flex-grow: 1;
      line-height: 1.5;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 0.75rem;
    }
    .view-more { color: var(--primary); font-weight: 600; }
    .empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }

    /* Skeleton */
    .skeleton-card { min-height: 160px; display: flex; flex-direction: column; gap: 0.75rem; }
    .skeleton-title, .skeleton-line {
      border-radius: 0.5rem;
      background: linear-gradient(90deg,
        rgba(255,255,255,0.04) 25%,
        rgba(255,255,255,0.09) 50%,
        rgba(255,255,255,0.04) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    .skeleton-title { height: 1.4rem; width: 55%; }
    .skeleton-line  { height: 0.8rem; width: 100%; }
    .skeleton-line.short { width: 38%; }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  skeletons = [1, 2, 3, 4, 5, 6];

  constructor(
    private promptService: PromptService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  openPrompt(prompt: Prompt): void {
    // Pass full prompt data through router state — detail page renders instantly
    this.router.navigate(['/prompt', prompt.id], { state: { prompt } });
  }

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data: Prompt[]) => {
        this.prompts = data;
        this.loading = false;
        this.cdr.detectChanges();          // Force UI update immediately
      },
      error: (err: any) => {
        console.error('Failed to load prompts:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackById(_: number, prompt: Prompt): string {
    return prompt.id ?? '';
  }

  getComplexityClass(level: number): string {
    if (level <= 3) return 'complexity-low';
    if (level <= 7) return 'complexity-mid';
    return 'complexity-high';
  }
}
