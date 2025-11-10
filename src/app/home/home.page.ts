import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses } from 'ionicons/icons';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { Miaw } from '../plugins/miaw.plugins';
import { MiawChatService } from '../services/miaw-chat.service';

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
    IonContent,
    IonSpinner,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class HomePage {
  isLoading = false;

  constructor(private miawService: MiawChatService) {
    addIcons({ chatbubbleEllipses });
  }

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[Miaw] Only available on native app');
      return;
    }

    // No need to initialize here - the service does it automatically!
    console.log('[Miaw] Ready to use - initialized by service');
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
}
