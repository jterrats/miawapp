import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Miaw } from '../plugins/miaw.plugins';
import { devLog } from '../core/logger';

export interface AuthConfig {
  backendUrl: string;
  userEmail: string;
}

@Injectable({ providedIn: 'root' })
export class MiawChatService {
  private initialized = false;
  private initializing = false;
  private authConfig: AuthConfig | null = null;

  constructor(private platform: Platform) {}

  /**
   * Configure authentication for User Verification.
   * Call before init() when using authenticated chat.
   */
  async configureAuthentication(backendUrl: string, userEmail: string): Promise<void> {
    this.authConfig = { backendUrl, userEmail };
    await Miaw.setBackendUrl({ backendUrl });
    await Miaw.setAuthenticatedUser({ email: userEmail });
    devLog('[MiawChatService] Auth configured for:', userEmail);
  }

  /**
   * Initialize SDK. Call configureAuthentication first if using User Verification.
   */
  async init(): Promise<void> {
    if (this.initialized || this.initializing) return;
    this.initializing = true;
    try {
      const userVerificationRequired = !!this.authConfig;
      devLog('[MiawChatService] Calling Miaw.initialize() with:', {
        configFileName: 'configFile.json',
        userVerificationRequired
      });

      await Miaw.initialize({
        configFileName: 'configFile.json',
        userVerificationRequired
      });

      devLog('[MiawChatService] Miaw initialized');
      this.initialized = true;
    } catch (err) {
      console.error('[MiawChatService] Error initializing Miaw', err);
      throw err;
    } finally {
      this.initializing = false;
    }
  }

  /**
   * Setup chat with optional authentication. Call this when user logs in.
   */
  async setupChat(backendUrl?: string, userEmail?: string): Promise<void> {
    const wasInitialized = this.initialized;
    const wasGuest = wasInitialized && !this.authConfig;
    
    if (backendUrl && userEmail) {
      await this.configureAuthentication(backendUrl, userEmail);
      // Si ya estaba inicializado como guest, reinicializar con auth
      if (wasGuest) {
        devLog('[MiawChatService] Reinitializing SDK with authentication');
        this.initialized = false;
      }
    }
    if (!this.initialized) {
      await this.init();
    }
  }

  async openConversation() {
    return Miaw.openConversation();
  }

  async closeConversation() {
    return Miaw.closeConversation();
  }

  async logout(): Promise<void> {
    try {
      await Miaw.logout();
      this.authConfig = null;
      devLog('[MiawChatService] Logged out');
    } catch (err) {
      console.error('[MiawChatService] Logout error', err);
    }
  }
}
