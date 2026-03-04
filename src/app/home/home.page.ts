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
    private router: Router
  ) {
    addIcons({ chatbubbleEllipses, logOutOutline });
  }

  get user() {
    return this.auth.getUser();
  }

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[Miaw] Only available on native app');
      return;
    }

    // Chat configured in LoginPage; setupChat no-ops if already initialized
    await this.miawService.setupChat();
    console.log('[Miaw] Ready to use');
  }

  async openChat() {
    console.log('🔵 [HomePage] openChat() started');

    if (!Capacitor.isNativePlatform()) {
      alert('Chat is only available in the installed app');
      return;
    }

    console.log('🔵 [HomePage] Native platform detected');
    this.isLoading = true;

    try {
      console.log('🔵 [HomePage] Calling miawService.openConversation()...');
      const res = await this.miawService.openConversation();
      console.log('✅ [HomePage] openConversation OK - Real Salesforce SDK!', res);
    } catch (err) {
      console.error('❌ [HomePage] Error in openConversation', err);
      alert('Error opening chat: ' + JSON.stringify(err));
    } finally {
      this.isLoading = false;
      console.log('🔵 [HomePage] openChat() finished');
    }
  }

  async closeChat() {
    try {
      const res = await this.miawService.closeConversation();
      console.log('[Miaw] closeConversation OK', res);
    } catch (err) {
      console.error('[Miaw] Error in closeConversation', err);
    }
  }

  async logout() {
    await this.miawService.logout();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
