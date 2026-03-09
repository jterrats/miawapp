import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
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

  /** URL del backend según plataforma (environment.apiUrl / apiUrlIos). */
  getBackendUrl(): string {
    if (Capacitor.getPlatform() === 'ios') {
      return (environment as { apiUrlIos?: string }).apiUrlIos ?? environment.apiUrl;
    }
    return environment.apiUrl;
  }

  /**
   * Login with email only (same as backend /api/auth/login).
   * Backend searches user in Salesforce via OAuth Client Credentials.
   */
  async login(email: string): Promise<AuthSession> {
    const url = `${this.getBackendUrl()}/api/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    });

    const text = await response.text();
    if (!response.ok) {
      let errorMsg = 'Login failed';
      try {
        const data = JSON.parse(text);
        errorMsg = data.error ?? errorMsg;
      } catch {
        if (text) errorMsg = text;
      }
      throw new Error(errorMsg);
    }

    const data = JSON.parse(text);
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
