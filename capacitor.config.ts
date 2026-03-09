import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'miawapp',
  webDir: 'www',
  // server: { url: 'http://TU_IP:8100' } para live reload
  android: {
    // Permite contenido HTTP en desarrollo
    allowMixedContent: true
  }
};

export default config;
