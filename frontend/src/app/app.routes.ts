import { Routes } from '@angular/router';
import { PromptListComponent } from './components/prompt-list/prompt-list.component';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail.component';
import { AddPromptComponent } from './components/add-prompt/add-prompt.component';

export const routes: Routes = [
  { path: '', component: PromptListComponent },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompt/:id', component: PromptDetailComponent },
  { path: 'add', component: AddPromptComponent },
  { path: '**', component: PromptListComponent }
];
