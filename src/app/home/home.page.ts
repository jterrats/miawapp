import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';

import { Miaw } from 'capacitor-salesforce-miaw';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  // 👇 IMPORTANTE: aquí registramos los componentes de Ionic que usamos en la plantilla
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  ],
})
export class HomePage {
  isOpening = false;

  async openChat() {
    try {
      this.isOpening = true;

      await Miaw.initialize({
        configFileName: 'configFile.json', // 👈 se lee desde /android/app/src/main/assets
      } as any);

      await Miaw.openConversation();
    } catch (err) {
      console.error('[Miaw] Error al abrir el chat', err);
    } finally {
      this.isOpening = false;
    }
  }

  async closeChat() {
    try {
      const res = await Miaw.closeConversation();
      console.log('[MIAW] closeConversation', res);
    } catch (err) {
      console.error('[MIAW] error closeChat', err);
    }
  }
}
