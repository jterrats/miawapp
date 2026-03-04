import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'miawapp',
  webDir: 'www',
  server: {
    url: 'http://192.168.50.235:8100',
    allowNavigation: ['192.168.50.235']
  }
};

export default config;
