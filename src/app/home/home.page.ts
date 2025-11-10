import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
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
    IonButton,
    IonSpinner,
  ],
})
export class HomePage {
  isLoading = false;

  constructor(private miawService: MiawChatService) {}

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[Miaw] Solo disponible en app nativa');
      return;
    }

    // No need to initialize here - the service does it automatically!
    console.log('[Miaw] Ready to use - initialized by service');
  }

  async openChat() {
    if (!Capacitor.isNativePlatform()) {
      alert('El chat solo está disponible en la app instalada');
      return;
    }

    this.isLoading = true;

    try {
      // Use the service method which handles everything
      const res = await this.miawService.openConversation();
      console.log('[Miaw] openConversation OK', res);
    } catch (err) {
      console.error('[Miaw] Error en openConversation', err);
    } finally {
      this.isLoading = false;
    }
  }

  async closeChat() {
    try {
      const res = await this.miawService.closeConversation();
      console.log('[Miaw] closeConversation OK', res);
    } catch (err) {
      console.error('[Miaw] Error en closeConversation', err);
    }
  }
}
