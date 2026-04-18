import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Loading state -->
    <div class="container fade-in" *ngIf="loading">
      <div class="back-nav">
        <a routerLink="/prompts" class="btn-back">← Back to Gallery</a>
      </div>
      <div class="glass-card detail-card loading-card">
        <div class="skeleton-title big"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-block"></div>
      </div>
    </div>

    <!-- Error state -->
    <div class="container fade-in" *ngIf="!loading && !prompt">
      <div class="back-nav">
        <a routerLink="/prompts" class="btn-back">← Back to Gallery</a>
      </div>
      <div class="glass-card detail-card" style="text-align:center;padding:4rem">
        <p style="font-size:1.5rem;margin-bottom:1rem">❌ Prompt not found</p>
        <a routerLink="/prompts" class="btn btn-primary">Go to Gallery</a>
      </div>
    </div>

    <!-- Data loaded -->
    <div class="container fade-in" *ngIf="!loading && prompt">
      <div class="back-nav">
        <a routerLink="/prompts" class="btn-back">← Back to Gallery</a>
      </div>
      <div class="glass-card detail-card">
        <div class="detail-header">
          <div class="title-section">
            <h1>{{ prompt.title }}</h1>
            <div class="meta">
              <span class="complexity-badge" [ngStyle]="{'background': getComplexityColor(prompt.complexity)}">
                Complexity: {{ prompt.complexity }} / 10
              </span>
              <span class="date">Added on {{ prompt.created_at | date:'longDate' }}</span>
            </div>
          </div>
          <div class="view-counter">
            <span class="count">{{ prompt.view_count || 0 }}</span>
            <span class="label">Total Views</span>
          </div>
        </div>
        <div class="content-section">
          <h3>The Prompt</h3>
          <div class="prompt-box">
            <p>{{ prompt.content }}</p>
            <button class="btn-copy" (click)="copyToClipboard(prompt.content)">
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-nav { margin-bottom: 2rem; }
    .btn-back {
      color: var(--text-muted); text-decoration: none;
      font-weight: 500; transition: color 0.2s;
    }
    .btn-back:hover { color: var(--primary); }
    .detail-card { padding: 2.5rem; }
    .detail-header {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--border); padding-bottom: 2rem;
    }
    .title-section h1 { margin-bottom: 0.5rem; font-size: 2rem; }
    .meta { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; color: var(--text-muted); font-size: 0.875rem; }
    .complexity-badge { padding: 0.25rem 1rem; border-radius: 2rem; color: white; font-weight: 600; }
    .view-counter {
      text-align: center; background: rgba(99,102,241,0.1);
      padding: 1rem 1.5rem; border-radius: 1rem; border: 1px solid var(--primary);
      flex-shrink: 0;
    }
    .view-counter .count { display: block; font-size: 2rem; font-weight: 700; color: var(--primary); line-height: 1; }
    .view-counter .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .content-section h3 { font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-muted); background: none; -webkit-text-fill-color: initial; }
    .prompt-box { background: rgba(15,23,42,0.5); border-radius: 1rem; padding: 2rem; position: relative; border: 1px solid var(--border); }
    .prompt-box p { font-family: 'Courier New', monospace; font-size: 1rem; color: #e2e8f0; white-space: pre-wrap; line-height: 1.6; }
    .btn-copy {
      position: absolute; top: 1rem; right: 1rem;
      padding: 0.4rem 0.9rem; background: var(--primary);
      border: none; border-radius: 0.5rem; color: white;
      font-size: 0.8rem; cursor: pointer; opacity: 0.75; transition: opacity 0.2s;
    }
    .btn-copy:hover { opacity: 1; }
    /* Skeleton */
    .loading-card { display: flex; flex-direction: column; gap: 1rem; }
    .skeleton-title.big, .skeleton-line, .skeleton-block {
      border-radius: 0.5rem;
      background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
      background-size: 200% 100%; animation: shimmer 1.4s infinite;
    }
    .skeleton-title.big { height: 2.5rem; width: 50%; }
    .skeleton-line { height: 0.9rem; width: 90%; }
    .skeleton-line.short { width: 35%; }
    .skeleton-block { height: 180px; width: 100%; margin-top: 1rem; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Check if data was passed via router state (from gallery click) — instant render!
    const nav = this.router.getCurrentNavigation();
    const cached = nav?.extras?.state?.['prompt'] as Prompt | undefined;
    // When navigating back, getCurrentNavigation() is null, so also check history state
    const historyCached = history.state?.prompt as Prompt | undefined;
    const preload = cached || historyCached;

    if (preload) {
      // Show instantly with cached data, view_count will update shortly
      this.prompt = { ...preload, view_count: preload.view_count ?? 0 };
      this.loading = false;
      this.cdr.detectChanges();
    }

    // Always fetch from API to get accurate view_count (and increment it)
    this.promptService.getPrompt(id).subscribe({
      next: (data: Prompt) => {
        this.prompt = data;        // Update with fresh data including new view_count
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching prompt:', err);
        if (!this.prompt) {        // Only show error if we have no cached data
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  getComplexityColor(level: number): string {
    const hue = Math.round((1 - (level - 1) / 9) * 120);
    return `hsl(${hue}, 65%, 42%)`;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Prompt copied to clipboard!');
    });
  }
}
