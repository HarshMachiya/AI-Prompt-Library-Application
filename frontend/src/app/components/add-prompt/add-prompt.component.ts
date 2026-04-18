import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container fade-in">
      <div class="back-nav">
        <a routerLink="/prompts" class="btn-back">← Cancel and Go Back</a>
      </div>

      <div class="glass-card form-container">
        <h1>Create New AI Prompt</h1>
        <p class="subtitle">Share your masterpiece with the community.</p>

        <form [formGroup]="promptForm" (ngSubmit)="onSubmit()" class="prompt-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" formControlName="title" placeholder="e.g. Cyberpunk Samurai in Neon Rain" 
                   [class.invalid]="isInvalid('title')">
            <div class="error-msg" *ngIf="isInvalid('title')">
              Title must be at least 3 characters long.
            </div>
          </div>

          <div class="form-group">
            <label for="complexity">Complexity (1 - 10)</label>
            <div class="range-container">
              <input type="range" id="complexity" formControlName="complexity" min="1" max="10">
              <span class="range-value">{{ promptForm.get('complexity')?.value }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="content">Prompt Content</label>
            <textarea id="content" formControlName="content" rows="8" 
                      placeholder="Enter the full AI prompt here... (Detailed prompts yield better results)"
                      [class.invalid]="isInvalid('content')"></textarea>
            <div class="error-msg" *ngIf="isInvalid('content')">
              Content must be at least 20 characters long.
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-block" [disabled]="promptForm.invalid || loading">
              {{ loading ? 'Saving...' : 'Publish Prompt' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .subtitle {
      color: var(--text-muted);
      margin-bottom: 2.5rem;
    }

    .prompt-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
      color: var(--text-main);
      font-size: 0.9rem;
    }

    input[type="text"], textarea {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      color: white;
      font-family: inherit;
      transition: all 0.3s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }

    input.invalid, textarea.invalid {
      border-color: var(--danger);
    }

    .error-msg {
      color: var(--danger);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .range-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    input[type="range"] {
      flex-grow: 1;
      accent-color: var(--primary);
    }

    .range-value {
      background: var(--primary);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      font-weight: 700;
      min-width: 2.5rem;
      text-align: center;
    }

    .btn-block {
      width: 100%;
      margin-top: 1rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class AddPromptComponent {
  promptForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.promptForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.promptForm.valid) {
      this.loading = true;
      this.promptService.createPrompt(this.promptForm.value).subscribe({
        next: () => {
          this.router.navigate(['/prompts']);
        },
        error: (err) => {
          console.error('Error saving prompt', err);
          this.loading = false;
        }
      });
    }
  }
}
