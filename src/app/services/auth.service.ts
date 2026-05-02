import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // ⭐ Signals for state management
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly userName = computed(() => this.currentUserSignal()?.name || 'Guest');

  // 🔑 Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setUser(response.data);
        }
      })
    );
  }

  // 📝 Register
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setUser(response.data);
        }
      })
    );
  }

  // 🚪 Logout
  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  // 👤 Get current user from server
  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`);
  }

  // 🎫 Get token
  getToken(): string | null {
    return this.currentUserSignal()?.token || null;
  }

  // 💾 Save user to localStorage and signal
  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  // 📥 Load user from localStorage
  private loadUserFromStorage(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}