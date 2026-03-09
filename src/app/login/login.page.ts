import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';

import { AuthService } from '../services/auth.service';
import { MiawChatService } from '../services/miaw-chat.service';
import { devLog } from '../core/logger';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
  ],
})
export class LoginPage {
  email = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private miawService: MiawChatService,
    private router: Router
  ) {}

  async onSubmit() {
    this.errorMessage = '';
    if (!this.email.trim()) {
      this.errorMessage = 'Email is required';
      return;
    }

    this.isLoading = true;
    try {
      const session = await this.auth.login(this.email);
      devLog('[Login] Success:', session.user.email);

      // Configure chat with User Verification
      await this.miawService.setupChat(
        this.auth.getBackendUrl(),
        session.user.email
      );

      this.router.navigate(['/home']);
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('[Login] Error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async continueAsGuest() {
    await this.miawService.setupChat();
    this.router.navigate(['/home']);
  }
}
