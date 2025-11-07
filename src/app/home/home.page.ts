import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';

import { Miaw, InitializeOptions } from 'capacitor-salesforce-miaw';

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
  private miawReady = false;

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[Miaw] Solo disponible en app nativa');
      return;
    }

    const options: InitializeOptions = {
      configFileName: 'configFile.json',
    };

    try {
      const res = await Miaw.initialize(options);
      console.log('[Miaw] initialize OK', res);
      this.miawReady = true;
    } catch (err) {
      console.error('[Miaw] Error en initialize', err);
    }
  }

  async openChat() {
    if (!Capacitor.isNativePlatform()) {
      alert('El chat solo está disponible en la app instalada');
      return;
    }

    try {
      await Miaw.openConversation();
    } catch (err) {
      console.error('[Miaw] Error al abrir el chat', err);
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
