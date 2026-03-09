import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses, logOutOutline } from 'ionicons/icons';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';

import { MiawChatService } from '../services/miaw-chat.service';
import { AuthService } from '../services/auth.service';
import { devLog } from '../core/logger';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonSpinner,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
  ],
})
export class HomePage {
  isLoading = false;

  constructor(
    private miawService: MiawChatService,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ chatbubbleEllipses, logOutOutline });
  }

  get user() {
    return this.auth.getUser();
  }

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      devLog('[Miaw] Only available on native app');
      return;
    }

    // Chat configured in LoginPage; setupChat no-ops if already initialized
    await this.miawService.setupChat();
    devLog('[Miaw] Ready to use');
  }

  async openChat() {
    devLog('[HomePage] openChat() started');

    if (!Capacitor.isNativePlatform()) {
      await this.showToast('Chat is only available in the installed app');
      return;
    }

    devLog('[HomePage] Native platform detected');
    this.isLoading = true;

    try {
      devLog('[HomePage] Calling miawService.openConversation()...');
      await this.miawService.openConversation();
      devLog('[HomePage] openConversation OK');
    } catch (err) {
      console.error('[HomePage] Error in openConversation', err);
      const msg = err instanceof Error ? err.message : 'Could not open chat';
      await this.showToast(msg, 'danger');
    } finally {
      this.isLoading = false;
      devLog('[HomePage] openChat() finished');
    }
  }

  async closeChat() {
    try {
      await this.miawService.closeConversation();
      devLog('[Miaw] closeConversation OK');
    } catch (err) {
      console.error('[Miaw] Error in closeConversation', err);
    }
  }

  private async showToast(message: string, color?: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: color ?? 'primary',
      position: 'bottom'
    });
    await toast.present();
  }

  async logout() {
    await this.miawService.logout();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
