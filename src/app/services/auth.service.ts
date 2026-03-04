import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  salesforceContactId: string;
}

export interface AuthSession {
  user: AuthUser;
  verificationToken: string;
  sessionToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'miaw_auth_session';

  get isAuthenticated(): boolean {
    return !!this.getSession();
  }

  getSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  getUser(): AuthUser | null {
    const session = this.getSession();
    return session?.user ?? null;
  }

  getBackendUrl(): string {
    return environment.apiUrl;
  }

  /**
   * Login with email only (same as backend /api/auth/login).
   * Backend searches user in Salesforce via OAuth Client Credentials.
   */
  async login(email: string): Promise<AuthSession> {
    const url = `${environment.apiUrl}/api/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    const session: AuthSession = {
      user: data.user,
      verificationToken: data.verificationToken,
      sessionToken: data.sessionToken
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
