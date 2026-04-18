import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt } from '../models/prompt.model';

@Injectable({ providedIn: 'root' })
export class PromptService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.apiUrl}/prompts/`);
  }

  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}/prompts/${id}/`);
  }

  createPrompt(prompt: Partial<Prompt>): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.apiUrl}/prompts/`, prompt);
  }
}
